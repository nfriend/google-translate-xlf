const googleTranslate = require('@k3rn31p4nic/google-translate-api');
const chalk = require('chalk');
const log = require('./helpers/log');
const cloneDeep = require('lodash.clonedeep');
const convert = require('xml-js');
const Bottleneck = require('bottleneck/es5');

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
    const limiter = new Bottleneck({
        maxConcurrent: 1,
        minTime: 333,
    });

    const elementsQueue = [];
    const targetQueue = [];

    elementsQueue.push(xlfStruct);

    while (elementsQueue.length) {
        const elem = elementsQueue.shift();

        if (elem.name === 'trans-unit') {
            const source = elem.elements.find(el => el.name === 'source');

            if (source) {
                const target = cloneDeep(source);
                target.name = 'target';

                target.elements.forEach(el => {
                    if (el.type === 'text' && !el.text.match(/^\W+$/gi)) {
                        targetQueue.push(el);
                    }
                });

                elem.elements.push(target);
            }

            continue;
        }

        if (elem && elem.elements && elem.elements.length) {
            elementsQueue.push(...elem.elements)
        };
    }
    

    return limiter.schedule(() => {
        const allPromises = targetQueue.map(el => googleTranslate(
            el.text,
            {
                from,
                to
            }
        )
            .then(res => {
                log(
                    'Translating ' +
                    chalk.yellow(el.text) +
                    ' to ' +
                    chalk.green(res.text)
                );

                el.text = res.text
            })
            .catch(err => {
                console.log(`[ERROR] ${JSON.stringify(err)}`);
                console.log('[TRACE]', err.stack);
                el.text = '[WARN] Failed to translate'
            })
        );

        return Promise.all(allPromises);
    })
        .then(() => convert.js2xml(xlfStruct, { spaces: 4 }))
}

module.exports = translate;
