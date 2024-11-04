import React, { useState } from 'react';
import { Layout, Spin, Dropdown, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { LogoutOutlined, KeyOutlined } from '@ant-design/icons';
import ChangePassword from './modal/ChangePassword';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { setCookie } from 'utils/cookie';
import { COOKIE_JWT } from 'utils/constants';
import styled from 'styled-components';
import BaseMenu from './BaseMenu';
import './style.scss';

const { Sider } = Layout;

const IconFoldOutlined = styled.div`
  width: 23px;
  height: 23px;
  border-radius: 14px;
  background: var(--mainColor);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ffffff;
  font-size: 15px;
  line-height: 0;
  position: absolute;
  transition: all 300ms;
  top: 18px;
  right: ${(props) => (props.collapsed ? '-10%' : '-4%')};
  transform: ${(props) => (props.collapsed ? 'rotate(180deg)' : '')};
  z-index: 99;
`;

const DropdownStyled = styled(Dropdown)`
  cursor: pointer;
`;

function SliderMenu(props) {
  const dispatch = useDispatch();
  const { logo, collapsed, onCollapse, user } = props;
  const [modalChangePassword, setModalChangePassword] = useState(undefined);

  const _renderMenuUser = () => {
    let items = [
      {
        key: 'CHANGE_PASSWORD',
        label: (
          <span
            onClick={() => {
              setModalChangePassword(true);
            }}
            className='header-menu'
            style={{ display: 'inline-block', width: '100%' }}>
            <KeyOutlined />
            Đổi mật khẩu
          </span>
        ),
      },
      {
        key: 'LOG_OUT',
        label: (
          <span
            style={{ display: 'inline-block', width: '100%' }}
            className='header-menu'
            onClick={(e) => {
              dispatch(
                showConfirmModal(
                  ['Bạn xác nhận sẽ đăng xuất?'],
                  async () => {
                    setCookie(COOKIE_JWT, undefined);
                    setTimeout(() => {
                      localStorage.removeItem('dataDefaultOrder')
                    }, 1000);
                    props.history.push('/logout');
                    e.preventDefault();
                  },
                  'Đồng ý',
                ),
              );
            }}>
            <LogoutOutlined type='logout' />
            Đăng xuất
          </span>
        ),
      },
    ];

    if (user) {
      return (
        <DropdownStyled menu={{ items }} placement='bottomRight'>
          <span className='antd-pro-components-global-header-index-action antd-pro-components-global-header-index-account'>
            <Avatar
              size={40}
              className='ant-avatar antd-pro-components-global-header-index-avatar ant-avatar-sm ant-avatar-circle ant-avatar-image'
              src={user?.default_picture_url}
              alt='avatar'
              style={{ marginRight: 10 }}
            />
            <span className={'antd-pro-components-global-header-index-name'} style={{ color: '#fff' }}>
              {user?.full_name}
            </span>
          </span>
        </DropdownStyled>
      );
    }
    return <Spin size='small' style={{ marginLeft: 8, marginRight: 8 }} />;
  };

  return (
    <Sider
      trigger={null}
      collapsible
      className='bw_sidebar'
      collapsed={collapsed}
      breakpoint='lg'
      width={280}
      style={{
        position: 'fixed',
        height: '100vh',
        top: 0,
        left: 0,
        zIndex: 1,
        background: '#0B2447',
      }}>
      <IconFoldOutlined collapsed={collapsed} onClick={onCollapse}>
        <i className='fi fi-rr-angle-small-left'></i>
      </IconFoldOutlined>

      <div className='antd-pro-components-sider-menu-index-logo' key='logo' id='logo'>
        <Link to='/'>
          <img src={logo} alt='logo' />
        </Link>
      </div>
      <div className='antd-pro-components-sider-menu-index-logo' key='user' id='user'>
        {_renderMenuUser()}
      </div>
      <BaseMenu {...props} />
    </Sider>
  );
}

export default SliderMenu;
