const randomPassword = () => {
    return Math.random().toString(36).slice(-8);
};

const mapperData = (arrayInput, conditionCallback) => {
    if (Array.isArray(arrayInput)) {
        return arrayInput.filter(conditionCallback);
    }
};

module.exports = {
    randomPassword,
    mapperData,
};
