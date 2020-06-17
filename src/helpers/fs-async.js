const fs = require('fs');

/**
 * Wraps fs.readFile with Promise
 *
 * @param {string} path
 * @returns
 */
function readFileAsync(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(err);
            }

            resolve(data);
        })
    });
}

/**
 * Wraps fs.writeFile with Promise
 *
 * @param {string} path
 * @param {string} data
 * @returns
 */
function writeFileAsync(path, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, null, (err) => {
            reject(err);
        });
        resolve(data);
    });
}

module.exports = { readFileAsync , writeFileAsync };