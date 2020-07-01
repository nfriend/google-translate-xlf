/**
 * This wrapper allows us to suppress log messages in tests
 *
 * @param {*} args
 */
function log(...args) {
    console.log.call(this, ...args);
}

module.exports = log;