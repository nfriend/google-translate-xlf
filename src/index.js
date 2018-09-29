#! /usr/bin/env node

/* 
    For usage help, run "node index.js help"
*/

const path = require('path');
const chalk = require('chalk');
const bluebird = require('bluebird');
const moment = require('moment');
const fs = bluebird.promisifyAll(require('fs'));
const translate = require('./translate');
const log = require('./log');

// setup up the command line interface
const argv = require('yargs')
    .usage(
        'Translates all property values in an .xlf file from one language to another.'
    )
    .example(
        'translate --in messages.xlf --out messages.hi.xlf --from en --to hi',
        'Translate an .xlf file from English to Hindi'
    )
    .example(
        'translate -i messages.xlf -o messages.fr.xlf -f en -t fr',
        'Translate an .xlf file from English to French'
    )
    .option('i', {
        alias: 'in',
        demand: true,
        describe: 'The input .xlf file to translate',
        type: 'string'
    })
    .option('o', {
        alias: 'out',
        demand: true,
        describe: 'The name of the translated output file',
        type: 'string'
    })
    .option('f', {
        alias: 'from',
        demand: true,
        describe: 'The language code of the input file',
        type: 'string'
    })
    .option('t', {
        alias: 'to',
        demand: true,
        describe: 'The language code to translate to',
        type: 'string'
    })
    .option('c', {
        alias: 'comment',
        demand: false,
        describe:
            'Indicates if an XML comment should be prepended to the output file',
        type: 'boolean',
        default: true
    }).argv;

// start a timer so that we can
// report how long the whole process took
const startTime = Date.now();

fs
    // get the input .xlf file from the filesystem
    .readFileAsync(path.resolve(argv.in))

    // translate the file
    .then(xlf => {
        return translate(xlf, argv.from, argv.to, argv.include, argv.exclude);
    })

    // write the result to the output file
    .then(output => {
        // add a comment to the top of the file unless --comment = false
        if (argv.comment) {
            const nowString = moment().format('MMMM Do YYYY, h:mm:ss a');

            output =
                `<!-- Translated on ${nowString} by google-translate-xlf:` +
                ` https://github.com/nfriend/google-translate-xlf -->\n${output}`;
        }

        return fs.writeFileAsync(path.resolve(argv.out), output);
    })

    // write a cheery message to the console
    .then(() => {
        const endTime = Date.now();
        log(
            chalk.green('✓') +
                ' Finished translating ' +
                argv.in +
                ' in ' +
                (endTime - startTime) +
                'ms.'
        );
    })

    // or, if something went wrong,  a grumpy one
    .catch(err => {
        log(
            chalk.red('X') +
                ' Something went wrong while translating ' +
                argv.in +
                '!'
        );
        log('' + err.stack);
    });
