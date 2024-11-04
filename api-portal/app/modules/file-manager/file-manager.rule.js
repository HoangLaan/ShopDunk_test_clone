const Joi = require('joi');

const ruleCreateOrUpdate = {
    // comment_content: Joi.string().required(),
    file_tag_id : Joi.string().allow(null,''),
    file_tag_name : Joi.string().required(),
    color :  Joi.string().required(),
    icon_url :  Joi.string().allow(null,''),
};

const ruleCreateDirectory = {
    directory_name : Joi.string()
    .trim()
    .min(1)
    .required(),
    document_type_id : Joi.number().required(),
}

const ruleUpdateNameFile = {
    file_id : Joi.string().required(),
    file_name :  Joi.string()
    .trim()
    .min(1)
    .required(),
}

const ruleUpdateNameDir = {
    directory_id : Joi.string().required(),
    directory_name :  Joi.string()
    .trim()
    .min(1)
    .required(),
}


const ruleCreateDocumentType = {
    document_type_name :  Joi.string()
    .trim()
    .min(1)
    .required(),
}

const ruleUpdateDocumentType = {
    document_type_name :  Joi.string()
    .trim()
    .min(1)
    .required(),
}




const validateRules = {
  createFileManager : {
    body: ruleCreateOrUpdate,
  },
  updateFileName: {
    body: ruleUpdateNameFile,
  },

  updateDirName : {
    body: ruleUpdateNameDir,
  },

  createDirectory : {
    body: ruleCreateDirectory,
  },
  createDocumentType : {
    body: ruleCreateDocumentType,
  },
  updateDocumentType : {
    body: ruleUpdateDocumentType,
  },

  updateFileManager: {
    body: ruleCreateOrUpdate,
  },
  changeStatusNews: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
