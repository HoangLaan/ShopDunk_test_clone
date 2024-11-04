const toSQLDateTime = (date) => new Date(date.split('/').reverse().join('-')).toISOString();

module.exports = {
    toSQLDateTime,
};
