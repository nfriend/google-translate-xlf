'use string';

/**
 * Generates string with date and time in format 'YYYY-MM-DDThh:mm:ssZ'
 * More info: http://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html#date
 *
 * @returns {string}
 */
function date() {
    const currentDate = new Date();
    const dateString = `${currentDate.getFullYear()}-${getMonth(currentDate)}-${getDate(currentDate)}T${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}Z`;

    return dateString;
}

function getMonth(date) {
    const monthNum = date.getMonth() + 1;

    return monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
}

function getDate(date) {
    const dateNum = date.getDate();

    return dateNum < 10 ? `0${dateNum}` : `${dateNum}`;
}

module.exports = date;