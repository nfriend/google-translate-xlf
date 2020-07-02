/**
 * Checks if provided text doesn't equal only to number, [<number>] or any punctuation character
 *
 * @param {string} text - text to check
 * @returns {boolean}
 */
function textMatchesCriteria(text) {
    return text.match(/^\W+$/gi) || text.match(/^\[+\d?\]+\s*$/gi) || text.match(/^\d+$/gi)
}

module.exports = textMatchesCriteria;