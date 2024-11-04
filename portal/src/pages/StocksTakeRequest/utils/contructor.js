class UserSchema {
  constructor(department_id, user_name, position_name, is_main_responsibility) {
    this.department_id = department_id;
    this.user_name = user_name;
    this.position_name = position_name;
    this.is_main_responsibility = is_main_responsibility;
  }
}

export { UserSchema };
