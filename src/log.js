// this wrapper allows us to suppress
// log messages in tests

function log(...args) {
    console.log.call(this, ...args);
}

module.exports = log;