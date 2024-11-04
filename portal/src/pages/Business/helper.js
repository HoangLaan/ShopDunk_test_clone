export const checkMisaPermission = (userAuth, businessId) => {
  const business_list = userAuth.user_business;
  // nếu là quyền admin hoặc nhân viên được phân cho chi nhánh cần chỉnh sửa hoặc nếu là form thêm mới thì sẽ có quyền tài khoản misa
  return userAuth.isAdministrator || business_list.includes(String(businessId)) || !businessId;
};
