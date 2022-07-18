const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const convert = require('xml-js');
const date = require('../src/helpers/date');

// import the file to test and mock out its dependencies
const translate = proxyquire('../src/translate', {
    '@vitalets/google-translate-api': (text) => {
        // this function simulates the Google Translate API.
        // all words will be translated to [word]_TRANSLATED, i.e:
        // "hello world" => "hello_TRANSLATED world_TRANSLATED"

        const words = text.split(/\s+/);
        const translatedWords = [];
        words.forEach((word) => {
            translatedWords.push(word + '_TRANSLATED');
        });

        const translatedText = translatedWords.join(' ');

        return Promise.resolve({
            text: translatedText,
        });
    },
    './helpers/log': () => {
        /* noop */
    },
});

describe('translate', () => {
    it('verifies that all properties are correctly translated', () => {
        const input = `
            <?xml version="1.0" encoding="UTF-8" ?>
            <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
                <file source-language="en" datatype="plaintext" original="ng2.template">
                    <body>
                        <trans-unit id="introductionHeader" datatype="html">
                            <source>Hello i18n!</source>
                            <context-group purpose="location">
                                <context context-type="sourcefile">app\app.component.ts</context>
                                <context context-type="linenumber">4</context>
                            </context-group>
                            <note priority="1" from="description">An introduction header for this sample</note>
                            <note priority="1" from="meaning">User welcome</note>
                        </trans-unit>
                    </body>
                </file>
            </xliff>
        `;

        const TEST_LN = 'en';

        const expectedOutput = `
            <?xml version="1.0" encoding="UTF-8" ?>
            <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
                <file source-language="en" datatype="plaintext" original="ng2.template" target-language="${TEST_LN}" date="${date()}">
                    <body>
                        <trans-unit id="introductionHeader" datatype="html">
                            <source>Hello i18n!</source>
                            <context-group purpose="location">
                            <context context-type="sourcefile">app\app.component.ts</context>
                            <context context-type="linenumber">4</context>
                            </context-group>
                            <note priority="1" from="description">An introduction header for this sample</note>
                            <note priority="1" from="meaning">User welcome</note>
                            <target>Hello_TRANSLATED i18n!_TRANSLATED</target>
                        </trans-unit>
                    </body>
                </file>
            </xliff>
        `;

        return translate(input, 'en', TEST_LN, 500, 1, false)
            .then((output) => [
                convert.xml2js(output),
                convert.xml2js(expectedOutput),
            ])
            .then(([output, expectedOutput]) => {
                expect(output).to.deep.equal(expectedOutput);
            });
    });
});
