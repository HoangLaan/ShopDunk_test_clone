const Transform = require('../../common/helpers/transform.helper');

const baseTemplate = {
  internal_transfer_type_id: '{{#? INTERNALTRANSFERTYPEID }}',
  internal_transfer_type_name: '{{#? INTERNALTRANSFERTYPENAME }}',
  description: '{{#? DESCRIPTION }}',
  created_date: '{{#? CREATEDDATE }}',
  created_user: '{{#? CREATEDUSER }}',
  is_active: '{{ ISACTIVE ? 1: 0 }}',
  is_same_bussiness: '{{ ISSAMEBUSSINESS ? 1: 0 }}',
};

const list = (data = []) => {
  const _template = baseTemplate;
  return new Transform(_template).transform(data, Object.keys(_template));
};

const getById = (data = {}) => {
  const _template = baseTemplate;
  return new Transform(_template).transform(data, Object.keys(_template));
};

const reviewLevelList = (data = []) => {
  const _template = {
      review_level_id: '{{#? REVIEWLEVELID}}',
      review_level_name: '{{#? REVIEWLEVELNAME}}',
      company_name: '{{#? COMPANYNAME}}',
      business_name: '{{#? BUSINESSNAME}}',
      description: '{{#? DESCRIPTION}}',
      created_user: '{{#? CREATEDUSER}}',
      created_date: '{{#? CREATEDDATE}}',
      is_active: '{{ISACTIVE ? 1 : 0}}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const departmentList = (data = []) => {
  const _template = {
      review_level_id: '{{#? REVIEWLEVELID}}',
      department_id: '{{#? DEPARTMENTID}}',
      department_name: '{{#? DEPARTMENTNAME}}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const positionList = (data = []) => {
  const _template = {
      review_level_id: '{{#? REVIEWLEVELID}}',
      department_id: '{{#? DEPARTMENTID}}',
      position_id: '{{#? POSITIONID}}',
      position_name: '{{#? POSITIONNAME}}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const levelUserDetailList = (data = []) => {
  const _template = {
      review_level_id: '{{#? REVIEWLEVELID}}',
      review_level_name: '{{#? REVIEWLEVELNAME}}',
      value: '{{#? +USERREVIEW}}',
      user_review: {
        label: '{{#? USERREVIEWNAME}}',
        value: '{{#? USERREVIEW}}'
      },
      is_review: '{{#? ISREVIEW ? 1: 0}}',
      is_auto_review: '{{ISAUTOREVIEW ? 1 : 0}}',
      is_complete: '{{ISCOMPLETE ? 1 : 0}}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const getReviewInformation = (data = {}) => {
  const _template = {
      review_list_id: '{{#? PURCHASEREQUISITIONREVIEWLISTID}}',
      purchase_requisition_id: '{{#? PURCHASEREQUISITIONID}}',
      review_level_id: '{{#? PURCHASEREQUISITIONREVIEWLEVELID}}',
      is_review: '{{ISREVIEW ? 1 : 0}}',
      review_note: '{{#? REVIEWNOTE}}',
      review_date: '{{#? REVIEWDATE}}',
      review_user: '{{#? REVIEWUSER}}',
      full_name: '{{#? FULLNAME}}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const reviewList = (data = []) => {
  const _template = {
      purchase_requisition_id: '{{#? PURCHASEREQUISITIONID}}',
      full_name: '{{#? FULLNAME}}',
      review_date: '{{#? REVIEWDATE}}',
      user_review: '{{#? USERREVIEW}}',
      is_review: '{{ISREVIEW === null ? 2 : ISREVIEW}}',
      is_auto_review: '{{ISAUTOREVIEW ? 1 : 0}}',
      is_complete: '{{ISCOMPLETE ? 1 : 0}}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const option = (data) => {
  const _template = {
      id: '{{#? ID}}',
      name: '{{#? NAME}}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

module.exports = {
  list,
  getById,
  reviewLevelList,
  departmentList,
  positionList,
  levelUserDetailList,
  getReviewInformation,
  reviewList,
  option,
};
