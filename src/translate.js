const googleTranslate = require('@vitalets/google-translate-api');
const chalk = require('chalk');
const cloneDeep = require('lodash.clonedeep');
const convert = require('xml-js');
const Bottleneck = require('bottleneck/es5');

const log = require('./helpers/log');
const match = require('./helpers/text-matcher');
const date = require('./helpers/date');

/**
 * Translates an .xlf file from one language to another
 *
 * @param {string} input The source of the .xlf file, as a string
 * @param {string} from The language code of the input file
 * @param {string} to The language code of the output file
 *
 * @returns {string}
 */
async function translate(input, from, to, minTime, maxConcurrent, skip) {
    const xlfStruct = convert.xml2js(input);
    const limiter = new Bottleneck({
        maxConcurrent,
        minTime,
    });

    const elementsQueue = [];
    const targetsQueue = [];

    elementsQueue.push(xlfStruct);
    while (elementsQueue.length) {
        const elem = elementsQueue.shift();

        if (elem.name === 'file') {
            elem.attributes['target-language'] = to;
            elem.attributes['date'] = date();
        }

        if (elem.name === 'trans-unit') {
            const source = elem.elements.find((el) => el.name === 'source');

            if (source) {
                const target = cloneDeep(source);
                target.name = 'target';

                target.elements.forEach((el) => {
                    if (el.type === 'text' && !match(el.text)) {
                        if (skip) {
                            el.text = '[INFO] Add your translation here';
                        } else {
                            targetsQueue.push(el);
                        }
                    }
                });

                elem.elements.push(target);
            }

            continue;
        }

        if (elem && elem.elements && elem.elements.length) {
            elementsQueue.push(...elem.elements);
        }
    }

    const allPromises = skip
        ? []
        : targetsQueue.map((el) =>
              limiter.schedule(() => getTextTranslation(el, from, to, skip))
          );

    await Promise.all(allPromises);

    return convert.js2xml(xlfStruct, {
        spaces: 4,
        // https://github.com/nashwaan/xml-js/issues/26#issuecomment-355620249
        attributeValueFn: function (value) {
            return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        },
    });
}

async function getTextTranslation(el, from, to) {
    try {
        const result = await googleTranslate(el.text, { from, to });
        log(
            'Translating ' +
                chalk.yellow(el.text) +
                ' to ' +
                chalk.green(result.text)
        );
        el.text = result.text;
    } catch (err) {
        console.log(`[ERROR] ${JSON.stringify(err)}`);
        console.log('[TRACE]', err.stack);
        el.text = '[WARN] Failed to translate';
    }
}

module.exports = translate;
