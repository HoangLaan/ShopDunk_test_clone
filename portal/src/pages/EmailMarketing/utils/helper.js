function extractParams(html) {
  const regex = /{{(.*?)}}/g;
  const matches = [];
  let match;

  while ((match = regex.exec(html))) {
    const value = match[1];
    if (/^[a-zA-Z0-9_]+$/.test(value)) {
      matches.push(value);
    }
  }

  return matches;
}

module.exports = { extractParams };
