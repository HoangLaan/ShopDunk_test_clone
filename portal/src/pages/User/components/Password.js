import React, { useState } from 'react';
import { changePassword } from 'services/users.service';
import { Alert, notification } from 'antd';
import styled from 'styled-components';

const StyledAlert = styled(Alert)`
    margin-bottom: 10px;
`

export default function ({ user, onClose}) {
    const [ password, setPassword ] = useState('');
    const [ passwordConfirmation, setPasswordConfirmation ] = useState('');
    const [ error, setError ] = useState(null);

    const handleSubmit = async () => {
        if(!password) { setError('Vui lòng nhập mật khẩu.'); return ;}
        else if(password != passwordConfirmation) { setError('Mật khẩu không khớp.'); return; }
        try {
            await changePassword(user.user_id, { password, password_confirmation: passwordConfirmation});
            notification.success({
                message: 'Thay đổi mật khẩu thành công.',
            });
            onClose();
        } catch (error) {
            setError(error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
        }
    }

    return (
        <div className="bw_modal bw_modal_open" id="bw_change_pass">
            <div className="bw_modal_container">
                <div className="bw_title_modal">
                    <h3>Đổi mật khẩu</h3>
                    <span className="bw_close_modal fi fi-rr-cross-small" onClick={onClose}></span>
                </div>
                <div className="bw_main_modal bw_border_top">
                    <ul className="bw_form_changePass">
                        {
                            error && <StyledAlert type="error" message={error} />
                        }
                        <li><span>UserID</span> <b>{user.user_name} - {user.full_name}</b></li>
                        <li><span>Mật khẩu</span> <input onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder="Mật khẩu" className="bw_inp" /></li>
                        <li><span>Xác nhận mật khẩu</span> <input onChange={e => setPasswordConfirmation(e.target.value)} value={passwordConfirmation} type="password" placeholder="Mật khẩu" className="bw_inp" /></li>
                    </ul>
                </div>
                <div className="bw_footer_modal">
                    <button onClick={handleSubmit} className="bw_btn bw_btn_success"><span className="fi fi-rr-check"></span> Đổi mật khẩu</button>
                    <button type="button" onClick={onClose} className="bw_btn_outline bw_btn_outline_success"><span className="fi fi-rr-refresh"></span>
                        Đóng</button>
                </div>
            </div>
        </div>
    )
}