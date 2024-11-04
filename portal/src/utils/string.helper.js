function changeToSlug(str) {
  try {
    if (!str) return '';
    if (str) {
      str = str.replace(/^\s+|\s+$/g, ''); // trim
      str = str.toLowerCase();

      //Đổi ký tự có dấu thành không dấu
      str = str.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
      str = str.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
      str = str.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
      str = str.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
      str = str.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
      str = str.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
      str = str.replace(/đ/gi, 'd');

      str = str
        .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes
    }
    return str;
  } catch (error) {}
}

const getSlugId = (slug) => {
  try {
    let arr = slug.split('-') || [];
    return arr.length ? arr.pop() : -1;
  } catch (error) {}
};

function getFileSlug(str) {
  try {
    if (str) {
      str = str.replace(/^\s+|\s+$/g, ''); // trim
      str = str.toLowerCase();

      //Đổi ký tự có dấu thành không dấu
      str = str.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
      str = str.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
      str = str.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
      str = str.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
      str = str.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
      str = str.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
      str = str.replace(/đ/gi, 'd');

      str = str
        .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '_') // collapse whitespace and replace by -
        .replace(/-+/g, '_'); // collapse dashes
    }
    return str;
  } catch (error) {}
}

const getSlugType = (slug) => {
  try {
    let arr = slug.split('-') || [];
    let objId = arr.length ? arr.pop() : -1;
    if (objId == -1) {
      throw new Error('Error Slug');
    } else {
      let typeSlug = objId.charAt(0);
      return {
        id: objId.replace(typeSlug, ''),
        typeSlug,
      };
    }
  } catch (error) {
    throw error;
  }
};

const toLowerCaseString = (text = '') => (text || '').trim().toLowerCase();

const isExistsSpecialString = (value = '') => {
  const regexSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (regexSpecial.test(value)) return true;
  return false;
};

export { changeToSlug, getSlugId, getSlugType, getFileSlug, toLowerCaseString, isExistsSpecialString };
