const MISSED_CALL_FILTER = {
  ALL : { value: 0, filter: ['busy-line', 'no-answered', 'busy', 'answered', 'ivr', 'invalid-number', 'not-available', 'cancel'] },
  YES: { value: 1, filter: ['busy-line', 'no-answered', 'busy', 'ivr'] },
  NO : { value: 2, filter: ['answered', 'invalid-number', 'not-available'] },
};

module.exports = {
    MISSED_CALL_FILTER,
};
