import Modal from 'components/shared/Modal/index';
import { FormProvider, useForm } from 'react-hook-form';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from 'components/shared/DataTable/index';
import BWButton from 'components/shared/BWButton/index';
import { getListStoreBankAccount } from 'services/pay-partner.service';

const ModalStoreBankAccount = ({ open, onClose, handleAddStoreBankAccount, defaultDataSelect }) => {
  const methods = useForm();
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 25,
  });
  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [defaultData, setDefaultData] = useState([]);
  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  ///zone handle scroll effect for header position

  const styleModal = { marginLeft: '278px' };

  const headerStyles = {
    backgroundColor: 'white',
    borderBottom: '#ddd 1px solid',
    position: 'sticky',
    marginTop: '-20px',
    zIndex: '1',
    top: '-2rem',
    width: '74rem',
    marginLeft: '-20px',
    height: '4rem',
  };
  const titleModal = {
    marginLeft: '1rem',
    marginTop: '1rem',
  };
  const closeModal = {
    marginRight: '2rem',
    marginTop: '1rem',
  };
  ////end zone

  useEffect(() => {
    setDefaultData(defaultDataSelect);
  }, [defaultDataSelect]);

  const loadStoreBankAccount = useCallback(() => {
    setLoading(true);
    getListStoreBankAccount(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(() => {
    open && loadStoreBankAccount();
  }, [loadStoreBankAccount, open]);

  const columns = useMemo(
    () => [
      {
        header: 'Số tài khoản',
        accessor: 'bank_number',
        classNameHeader: 'bw_sticky bw_name_sticky',
        classNameBody: 'bw_sticky bw_name_sticky bw_title_page',
      },
      {
        header: 'Ngân hàng',
        accessor: 'bank_name',
      },
      {
        header: 'Chi nhánh',
        accessor: 'bank_branch',
      },
      {
        header: 'Cửa hàng',
        accessor: 'store_name',
      },
    ],
    [],
  );

  return (
    <Modal
      witdh={'80%'}
      header='Danh sách tài khoản ngân hàng'
      open={open}
      styleModal={styleModal}
      headerStyles={headerStyles}
      titleModal={titleModal}
      closeModal={closeModal}
      onClose={onClose}
      lalbelClose={'Đóng'}
      footer={
        <BWButton
          icon={'fi fi-rr-plus'}
          content={'Chọn'}
          type={'success'}
          onClick={() => handleAddStoreBankAccount?.(defaultData)}
        />
      }>
      <Fragment>
        <FormProvider {...methods}>
          <FilterSearchBar
            title='Tìm kiếm'
            onSubmit={(e) => {
              setParams((prev) => {
                return {
                  ...prev,
                  ...e,
                };
              });
            }}
            onClear={() =>
              setParams({
                is_active: 1,
                page: 1,
                itemsPerPage: 25,
              })
            }
            actions={[
              {
                title: 'Từ khóa',
                component: (
                  <FormInput
                    placeholder={'Nhập số tài khoản '}
                    field='keyword'
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        setParams((prev) => ({
                          ...prev,
                          keyword: e.target.value,
                        }));
                      }
                    }}
                  />
                ),
              },
            ]}
          />
        </FormProvider>
        <DataTable
          loading={loading}
          columns={columns}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          defaultDataSelect={defaultDataSelect}
          fieldCheck={'bank_account_id'}
          totalItems={totalItems}
          onChangeSelect={(data) => {
            setDefaultData(data);
          }}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          hiddenDeleteClick
        />
      </Fragment>
    </Modal>
  );
};

export default ModalStoreBankAccount;
