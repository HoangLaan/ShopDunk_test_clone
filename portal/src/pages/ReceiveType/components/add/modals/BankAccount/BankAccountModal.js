import React, { useState, useCallback, useEffect } from 'react';

import BankAccountModalTable from './BankAccountModalTable';
import { getBankAccountList } from 'services/receive-type.service';
import BankAccountModalAdd from './BankAccountModalAdd';

import { useFormContext } from 'react-hook-form';

const BankAccountModal = ({ onClose }) => {
  const methods = useFormContext();
  const [loading, setLoading] = useState(false);
  const [selectChoose, setSelectChoose] = useState(methods.watch('bank_account_list') ?? []);
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 10,
  });
  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  ///zone handle scroll effect for header position

  const styleModal = { marginLeft: '300px' };

  const headerStyles = {
    backgroundColor: 'white',
    borderBottom: '#ddd 1px solid',
    position: 'sticky',
    marginTop: '-20px',
    zIndex: '1',
    top: '-2rem',
    width: '50rem',
    marginLeft: '-20px',
    height: '4rem',
  };
  const titleModal = {
    marginLeft: '2rem',
    marginTop: '1rem',
  };
  const closeModal = {
    marginRight: '2rem',
    marginTop: '1rem',
  };
  ////end zone

  const loadBankAccount = useCallback(
    (otherParams = {}) => {
      setLoading(true);
      getBankAccountList({ ...params, ...otherParams })
        .then(setDataList)
        .catch((_) => {})
        .finally(() => {
          setLoading(false);
        });
    },
    [params],
  );

  useEffect(loadBankAccount, [loadBankAccount]);

  return (
    <div className='bw_modal bw_modal_open' id='bw_skill'>
      <div className='bw_modal_container bw_w800' style={styleModal}>
        <div className='bw_title_modal' style={headerStyles}>
          <h3 style={titleModal}>Thêm tài khoản ngân hàng</h3>
          <span onClick={onClose} className='fi fi-rr-cross-small bw_close_modal' style={closeModal}></span>
        </div>

        <div className='bw_main_modal'>
          <BankAccountModalAdd loadBankAccount={loadBankAccount} setParams={setParams} />
          <BankAccountModalTable
            loading={loading}
            data={items}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            page={page}
            totalItems={totalItems}
            onChangePage={(page) => {
              setParams({
                ...params,
                page,
              });
            }}
            selectChoose={selectChoose}
            setSelectChoose={setSelectChoose}
            onRefresh={loadBankAccount}
            onClose={onClose}
          />
        </div>
        <div className='bw_footer_modal bw_flex bw_justify_content_right'>
          <button
            onClick={() => {
              methods.setValue('bank_account_list', selectChoose);
              document.getElementById('trigger-delete')?.click();
              onClose();
            }}
            className='bw_btn bw_btn_success'>
            Chọn tài khoản
          </button>
          <button onClick={onClose} className='bw_btn_outline bw_close_modal'>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankAccountModal;
