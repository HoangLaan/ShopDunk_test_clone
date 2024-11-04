class MemberSchema {
  constructor(member_id, data_leads_id, customer_code, full_name, gender, birthday, phone_number, email) {
    this.member_id = member_id;
    this.data_leads_id = data_leads_id;
    this.customer_code = customer_code;
    this.full_name = full_name;
    this.gender = gender ? 1 : 0;
    this.birthday = birthday;
    this.phone_number = phone_number;
    this.email = email;
  }
}

export { MemberSchema };
