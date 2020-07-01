'use string';

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

/**
 * Generates string with date and time in format 'MMMM DD YYYY, H:mm:ss'
 *
 * @returns {string}
 */
function date() {
    const currentDate = new Date();
    const dateString = `${MONTHS[currentDate.getMonth()]} ${currentDate.getDate()} ${currentDate.getFullYear()}, ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

    return dateString;
}

module.exports = date;