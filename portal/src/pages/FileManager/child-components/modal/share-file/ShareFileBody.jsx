import React, { useEffect, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import fileManager from 'pages/FileManager/actions/file-manager';
import logoDefault from 'assets/bw_image/logo.png';
import SelectPermission from 'pages/FileManager/child-components/modal/share-file/SelectPermission';
import { PERMISSION } from 'pages/FileManager/utils/constants';
import { Select } from 'antd';
import { permissionOptions, permissionChangeOptions } from 'pages/FileManager/utils/helper';
import ConfirmDeletePermissionModal from 'pages/FileManager/child-components/modal/share-file/ConfirmDeletePermissionModal';
import { Spin } from 'antd';
import { showToast } from 'utils/helpers';
const { Option, OptGroup } = Select;

const Wrapper = styled.div`
  width: 100%;
  padding: 0 30px;
`;

const ContainnerLoader = styled.div`
  margin: 20px 0;
  margin-bottom: 20px;
  padding: 30px 50px;
  text-align: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
`;

const Header = styled.div``;

const Search = styled.div`
  position: relative !important;
  display: flex;
  justify-content: center;
  button {
    width: 133px;
    height: 50px;
  }
  input {
    width: 100%;
    font-size: 13px;
    padding: 10px;
    height: 50px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    ::placeholder {
      padding: 10px;
      font-size: 13px;
    }
  }
  .select-user {
    position: absolute !important;
    top: 13px !important;
    right: 23px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      margin-left: 7px;
    }
  }
`;

const SelectStyled = styled(Select)`
  margin-right: 7px;
  .ant-select-selector {
    min-height: 51px !important;
    padding-right: 90px !important;
  }
  .ant-select-selection-item {
    border-radius: 12px;
  }
  .ant-select-selection-item-remove {
    line-height: 18px;
  }
`;

const UserSection = styled.div`
  width: 100%;
  height: 63px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 10px;
  .main {
    width: 100%;
    height: 78%;
    border-radius: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 0px !important;
  }
  .left {
    display: flex;
    align-items: center;
    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 35px;
      height: 35px;
      margin-right: 5px;
      background-size: cover;
      /* Blue 1 */
      border: 1px solid #2f80ed;
      border-radius: 50%;
    }
  }
  .right {
    display: flex;
    align-items: center;
    .anticon {
      font-size: 10px !important;
    }
  }
  .line {
    width: 100%;
    margin-top: 10px;
    height: 0px;
    border-bottom: 1px solid #f2f2f2;
  }
`;

const ShareFileBody = ({ defaultValue, onClose }) => {
  const dispatch = useDispatch();
  const userAuth = window._$g.userAuth;
  const {
    listShare,
    userList,
    departmentList,
    getListShareLoading,
    informationFileData,
    informationDirectoryData,
    typeOfDocumentsList,
  } = useSelector((state) => state.fileManager);

  const [permissionValue, setPermissionValue] = useState(PERMISSION.VIEW);
  const [listUserSelect, setListUserSelect] = useState();
  const [modalDelete, setModalDelete] = useState(undefined);
  const [valueDetele, setValueDelete] = useState(undefined);
  const [loading, setLoading] = useState(undefined);

  const {
    items: { list_user, list_department },
  } = listShare;
  const { items: typeOfDocumentData } = typeOfDocumentsList;

  const informationValue = useMemo(
    () => (Boolean(defaultValue?.is_file) ? informationFileData : informationDirectoryData),
    [informationFileData, informationDirectoryData, defaultValue],
  );

  const loadShare = useCallback(() => {
    setListUserSelect(undefined);

    const params = {
      id: Boolean(defaultValue?.is_directory) ? defaultValue?.directory_id : defaultValue?.file_id,
      is_directory: Boolean(defaultValue?.is_directory),
    };
    dispatch(fileManager.getListShare(params));
  }, [defaultValue]);
  useEffect(loadShare, [loadShare]);

  const loadAllUser = useCallback(() => {
    if (informationValue)
      dispatch(
        fileManager.getUser({
          itemsPerPage: 210983290,
          company_id: typeOfDocumentData?.find(
            (e) => e?.document_type_id === (informationValue && informationValue[0]?.document_type_id),
          )?.company_id,
        }),
      );
    dispatch(
      fileManager.getDeparment({
        itemsPerPage: 210983290,
        company_id: typeOfDocumentData?.find(
          (e) => e?.document_type_id === (informationValue && informationValue[0]?.document_type_id),
        )?.company_id,
      }),
    );
  }, [dispatch, typeOfDocumentData, informationValue]);
  useEffect(loadAllUser, [loadAllUser]);

  const childrenUser = useMemo(() => {
    const userFilter = userList?.filter((e) => {
      if (userAuth.user_name !== e?.user_name)
        if (!list_user?.find((value) => e.user_name === value?.user_name))
          if (e?.user_name !== (defaultValue?.file_owner || defaultValue?.directory_owner)) return e;
    });
    return userFilter?.map((value) => {
      return (
        <Option
          value={`USERNAME - ${value?.user_name} - ${value?.full_name}`}
          key={`${value?.user_name} - ${value?.full_name}`}>
          {value?.user_name} - {value?.full_name}
        </Option>
      );
    });
  }, [userList, list_user]);

  const childrenDeparment = useMemo(() => {
    return departmentList
      .filter((e) => {
        if (!list_department?.find((value) => value?.department_id === e?.id)) {
          return e;
        }
      })
      ?.map((value) => {
        return (
          <Option value={`DEPARMENT - ${value?.id} - ${value?.name}`} key={`${value?.id}`}>
            {value?.name}
          </Option>
        );
      });
  }, [departmentList, list_department]);

  const handleSubmit = async () => {
    if (!listUserSelect || listUserSelect.length === 0) {
      showToast.error('Vui lòng chọn tài khoản để chia sẻ');
      return;
    }
    const permission = permissionOptions.find((e) => e.key === permissionValue)?.value;
    const type = Boolean(defaultValue?.is_directory) ? 'share-dir' : 'share-file';
    setLoading(true);
    const params = {
      file_id: defaultValue?.file_id,
      directory_id: defaultValue?.directory_id,
      list_user: listUserSelect?.map((e) => {
        return {
          ...permission,
          user_name: e.split(' - ')[0] === 'USERNAME' ? e.split(' - ')[1] : undefined,
        };
      }),
      list_department: listUserSelect?.map((e) => {
        return {
          ...permission,
          department_id: e.split(' - ')[0] === 'DEPARMENT' ? e.split(' - ')[1] : undefined,
        };
      }),
    };
    await dispatch(fileManager.share(params, type));
    setListUserSelect(undefined);
    setLoading(false);
    onClose();
  };

  const handleEditPermission = async (user, valuePer, deparment) => {
    const permission = permissionChangeOptions.find((e) => e.key === valuePer)?.value;
    const type = Boolean(defaultValue?.is_directory) ? 'share-dir' : 'share-file';
    const params = {
      file_id: defaultValue?.file_id,
      directory_id: defaultValue?.directory_id,
      list_user: [
        {
          user_name: user,
          ...permission,
        },
      ],
      list_department: [
        {
          department_id: deparment,
          ...permission,
        },
      ],
      description: new Date(),
    };
    try {
      await dispatch(fileManager.share(params, type, true));
    } catch {}
  };

  const valuePermission = (object) => {
    if (Boolean(object?.is_read) && Boolean(object?.is_write) && !Boolean(object?.is_delete)) {
      return PERMISSION.EDIT;
    }
    if (Boolean(object?.is_read) && !Boolean(object?.is_write) && !Boolean(object?.is_delete)) {
      return PERMISSION.VIEW;
    }
  };

  const loadGetInfor = useCallback(() => {
    if (Boolean(defaultValue?.is_file)) {
      dispatch(fileManager.getInformationFile(defaultValue?.file_id));
    } else {
      dispatch(fileManager.getInformationDirectory(defaultValue?.directory_id));
    }
  }, [dispatch]);
  useEffect(loadGetInfor, [loadGetInfor]);

  return (
    <Wrapper>
      <Header>
        <Search>
          <SelectStyled
            onChange={setListUserSelect}
            defaultValue={listUserSelect}
            mode='multiple'
            style={{ width: '100%' }}
            placeholder='Nhập tài khoản cần chia sẻ'>
            <OptGroup label='Phòng ban'>{childrenDeparment}</OptGroup>
            <OptGroup label='Nhân viên'>{childrenUser}</OptGroup>
          </SelectStyled>
          <SelectPermission
            absolute
            options={permissionOptions}
            onChange={(e) => setPermissionValue(e)}
            style={{ position: 'absolute', top: '4px', right: '100px' }}
          />
          <Button
            loading={loading}
            disabled={!listUserSelect || listUserSelect.length === 0}
            type='primary'
            size='medium'
            onClick={() => handleSubmit()}>
            Gửi
          </Button>
        </Search>
        <div style={{ marginTop: '35px' }}>
          <UserSection>
            <div className='main'>
              <div className='left'>
                {informationValue && (
                  <>
                    <img
                      src={informationValue[0]?.avatar}
                      className='avatar'
                      onError={(event) => {
                        event.currentTarget.src = logoDefault;
                        event.currentTarget.style.padding = '1px';
                      }}></img>
                    <span>{informationValue[0]?.created_user}</span>
                  </>
                )}
              </div>
              <div className='right'>
                <span style={{ color: '#828282' }}>Người tạo</span>
              </div>
            </div>
            <div className='line'></div>
          </UserSection>
          {(list_department || [])?.map((value, index) => (
            <UserSection key={index} background={value?.avatar ? `url("${value?.avatar}")` : null}>
              <div className='main'>
                <div className='left'>
                  <img
                    src={logoDefault}
                    className='avatar'
                    onError={(event) => {
                      event.currentTarget.src = logoDefault;
                      event.currentTarget.style.padding = '1px';
                    }}></img>
                  <span>{value?.department_name}</span>
                </div>
                <div className='right'>
                  <SelectPermission
                    valuePermission={() => valuePermission(value)}
                    options={permissionChangeOptions}
                    onChange={(e) => {
                      if (e === PERMISSION.UNPERMISSION) {
                        setModalDelete(true);
                        setValueDelete(value);
                        return;
                      }
                      setPermissionValue(e);
                      handleEditPermission(null, e, value?.department_id);
                    }}
                  />
                </div>
              </div>
              <div className='line'></div>
            </UserSection>
          ))}
          {(list_user || [])?.map((value, index) => (
            <UserSection key={index} background={value?.avatar ? `url("${value?.avatar}")` : null}>
              <div className='main'>
                <div className='left'>
                  <img
                    src={value?.avatar}
                    className='avatar'
                    onError={(event) => {
                      event.currentTarget.src = logoDefault;
                      event.currentTarget.style.padding = '1px';
                    }}></img>
                  <span>
                    {value?.user_name} - {value?.full_name}
                  </span>
                </div>
                <div className='right'>
                  <SelectPermission
                    valuePermission={() => valuePermission(value)}
                    options={permissionChangeOptions}
                    onChange={(e) => {
                      if (e === PERMISSION.UNPERMISSION) {
                        setModalDelete(true);
                        setValueDelete(value);
                        return;
                      }
                      setPermissionValue(e);
                      handleEditPermission(value?.user_name, e);
                    }}
                  />
                </div>
              </div>
              <div className='line'></div>
            </UserSection>
          ))}
          {getListShareLoading && (
            <ContainnerLoader>
              <Spin />
            </ContainnerLoader>
          )}
        </div>
      </Header>

      {modalDelete && (
        <ConfirmDeletePermissionModal
          visible={modalDelete}
          defaultValue={valueDetele}
          handleSubmit={handleEditPermission}
          onRefesh={loadShare}
          onClose={() => setModalDelete(false)}
        />
      )}
    </Wrapper>
  );
};

ShareFileBody.propTypes = {
  defaultValue: PropTypes.object,
  onClose: PropTypes.bool,
};

export default ShareFileBody;
