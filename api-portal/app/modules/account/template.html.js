const htmlMail = async (email, password) => {
    return `<div style="width: 100%; font-family: Helvetica, san-serif; background: #fff">
    <div style="margin: 60px auto; max-width: 680px">
      <span style="display: block; padding: 10px 0; line-height: 20px"
        >Thân chào<b> ${email}</b> chúng tôi đã tạo tài khoản dành cho bạn</span
      >
      <span style="display: block; margin-top: 15px; line-height: 24px">
        Tài khoản của bạn là:
        <b> ${email} </b>.
      </span>
      <span style="margin-top: 30px; font-weight: 700; display: block">
        Mật khẩu của bạn là:<b style="color: red;"
          >  ${password}
        </b>
      </span>
      <span
        style="display: block; margin: 20px 0; line-height: 24px; color: #828282"
      >
        Vui lòng giữ mọi thông tin đăng nhập ở chế độ an toàn.</span
      >
      <span
        style="display: block; margin-top: 20px; font-size: 13px; color: #bdbdbd"
        ><i
          >* Vui lòng không phản hồi lại mail. Đây là mail tự động của hệ thống</i
        ></span
      >
  
      <span style="display: block; margin-top: 20px">Trân trọng!</span>
  
      <span
        style="
          border-top: 1px solid #d09f1f;
          display: block;
          margin-top: 20px;
          padding: 15px 0;
        "
      >
        <img src="https://i.ibb.co/L6R3FL8/logo.png" alt="logo" />
      </span>
    </div>
  </div>
  `
  };
  
module.exports = {
  htmlMail
  };
  