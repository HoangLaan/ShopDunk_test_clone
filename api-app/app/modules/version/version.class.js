const Transform = require('../../common/helpers/transform.helper');

const template = {
  'id': '{{#? ID}}',
  'platform': '{{#? PLATFORM}}',
  'version': '{{#? VERSION}}',
  'build_number': '{{#? BUILDNUMBER}}',
  'message': '{{#? MESSAGE}}',
  'feature': '{{#? FEATURE}}',
};

const listVersion = (province = []) => {
  const transform = new Transform(template);
  return transform.transform(province, Object.keys(template));
};

module.exports = {
    listVersion
};
