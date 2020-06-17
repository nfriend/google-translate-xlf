const googleTranslate = require('@k3rn31p4nic/google-translate-api');
const chalk = require('chalk');
const log = require('./helpers/log');
const cloneDeep = require('lodash.clonedeep');
const convert = require('xml-js');

/**
 * Translates an .xlf file from one language to another
 * 
 * @param {string} input The source of the .xlf file, as a string
 * @param {string} from The language code of the input file
 * @param {string} to The language code of the output file
 * 
 * @returns {string}
 */
function translate(input, from, to) {
    const xlfStruct = convert.xml2js(input);

    const queue = [];
    const toTranslate = [];
    const allPromises = [];

    queue.push(xlfStruct);

    while (queue.length) {
        const elem = queue.pop();

        if (elem.name === 'trans-unit') {
            const source = elem.elements.find(el => el.name === 'source');

            if (source) {
                const target = cloneDeep(source);
                target.name = 'target';

                toTranslate.push(...target.elements.filter(el => el.type === 'text'))

                elem.elements.push(target);
            }

            continue;
        }

        if (elem && elem.elements && elem.elements.length) {
            queue.push(...elem.elements)
        };
    }

    toTranslate.forEach(el => {
        const translatePromise = googleTranslate(
            el.text,
            {
                from,
                to,
                raw: true
            }
        ).then(res => {
            log(
                'Translating ' +
                chalk.yellow(el.text) +
                ' to ' +
                chalk.green(res.text)
            );

            el.text = res.text
        });

        allPromises.push(translatePromise);
    });

    return Promise.all(allPromises)
        .then(() => convert.js2xml(xlfStruct, { spaces: 4 }))
        .catch(e => {
            throw new Error(e);
        });
}

module.exports = translate;
