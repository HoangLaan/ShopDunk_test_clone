const stringifyError = (error) => {
    const errorJson = JSON.stringify(error, (key, value) => {
        if (value instanceof Error) {
            let error = {};

            Object.getOwnPropertyNames(value).forEach((key) => {
                error[key] = value[key];
            });

            return error;
        }

        return value;
    });

    return errorJson;
};


const sortObject = (obj) => {
    var sorted = {};
    var str = [];
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = {
    stringifyError,
    sortObject
};
