#! /usr/bin/env node

/*
    For usage help, run "node index.js help"
*/
const path = require('path');
const chalk = require('chalk');
const { readFileAsync, writeFileAsync } = require('./helpers/fs-async');
const translate = require('./translate');
const log = require('./helpers/log');

// setup up the command line interface
const argv = require('yargs')
    .usage(
        'Translates all property values in an .xlf file from one language to another.'
    )
    .example(
        'translate --in messages.xlf --out messages.hi.xlf --from en --to nl',
        'Translate an .xlf file from English to Dutch'
    )
    .example(
        'translate -i messages.xlf -o messages.fr.xlf -f en -t fr',
        'Translate an .xlf file from English to French'
    )
    .option('i', {
        alias: 'in',
        demand: true,
        describe: 'The input .xlf file to translate',
        type: 'string',
    })
    .option('o', {
        alias: 'out',
        demand: true,
        describe: 'The name of the translated output file',
        type: 'string',
    })
    .option('f', {
        alias: 'from',
        demand: true,
        describe: 'The language code of the input file',
        type: 'string',
    })
    .option('t', {
        alias: 'to',
        demand: true,
        describe: 'The language code to translate to',
        type: 'string',
    })
    .option('r', {
        alias: 'rate',
        demand: false,
        describe:
            'Sets the rate limit for requests. For more information see https://github.com/SGrondin/bottleneck#readme',
        type: 'number',
        default: 0,
    })
    .option('s', {
        alias: 'skip',
        demand: false,
        describe:
            'Skips translating and adds only target tag with boilerplate text',
        type: 'boolean',
        default: false,
    }).argv;

// start a timer so that we can
// report how long the whole process took
const startTime = Date.now();

// get the input .xlf file from the filesystem
readFileAsync(path.resolve(argv.in))
    // translate the file
    .then(xlf => {
        return translate(xlf.toString(), argv.from, argv.to, argv.rate, argv.skip);
    })

    // write the result to the output file
    .then(output => {
        return writeFileAsync(path.resolve(argv.out), output);
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

