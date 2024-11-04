const makeImei = (length = 10) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    result = result.toUpperCase();
    return result;
};

const clearInput = (value = '') => String(value).trim().toLowerCase();

const clearData = (data = []) => {
    if (data?.length) {
        return data.map((item) => {
            if (item?.length) {
                return item.map((item_) => {
                    return {
                        ...item_,
                        label: clearInput(item_.label),
                    };
                });
            }
            return item;
        });
    }
    return data;
};

const getDataValue = (data, key, value = '') => {
    if (data && data[key] && value) {
        const value_ = clearInput(value);
        return data[key].find((item) => item.label === value_)?.value;
    }
    return undefined;
};

module.exports = {
    makeImei,
    clearInput,
    clearData,
    getDataValue,
};
