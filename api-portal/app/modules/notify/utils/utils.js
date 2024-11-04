const truncateString = (inputString, maxLength) => {
    if (inputString.length > maxLength) {
        return inputString.substring(0, maxLength) + '...';
    } else {
        return inputString;
    }
};

module.exports = {
    truncateString,
};
