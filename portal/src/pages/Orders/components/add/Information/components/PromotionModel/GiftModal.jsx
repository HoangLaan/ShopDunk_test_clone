import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { InputNumber } from 'antd';
import { checkEmptyArray, checkValueByFunction } from 'pages/Orders/helpers/utils';
import DataTable from 'components/shared/DataTable';
import { showToast } from 'utils/helpers';

const InputNumberStyled = styled(InputNumber)`
  .ant-input-number-group-addon {
    border: ${(props) => (props.bordered ? '' : 'none')};
  }
`;

const GiftModal = ({ onClose, onConfirm, giftList, oldSelectedGift }) => {
  const [selectedGift, setSelectedGift] = useState([]);

  const formatterNumber = (val) => {
    if (!val) return '';
    return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  useEffect(() => {
    const resetListGift = []
    const cloneGiftList = structuredClone(giftList);
    const checkGift = checkEmptyArray(cloneGiftList);
    if(checkGift) {
      cloneGiftList?.map((val, index) => {
        const checkValGift = checkValueByFunction(val, 'imei_code_options', checkEmptyArray);
        if(checkValGift) {
          resetListGift.push(val);
        }
      })
    }

    const checkGiftAfterCompare = checkEmptyArray(resetListGift);
    if(!checkGiftAfterCompare) {
      showToast.error('Sản phẩm quà tặng không có trong kho !');
      onClose();
    } else {
      giftList = resetListGift;
    }
  }, [giftList])

  const columns = useMemo(
    () => [
      {
        header: 'Tên quà tặng',
        formatter: (p) => <b>{p?.product_name}</b>,
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Số lượng',
        formatter: (p) => {
          // const disabled = selectedGift.findIndex((item) => item.product_id === p.product_id) === -1;

          return (
            <InputNumberStyled
              style={{
                width: '100%',
              }}
              bordered
              // disabled={disabled}
              disabled
              formatter={formatterNumber}
              placeholder='0'
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              onChange={(value) => {
                const findIndex = selectedGift.findIndex((item) => item.product_id === p.product_id);

                if (findIndex !== -1) {
                  const newSelectedGift = [...selectedGift];

                  newSelectedGift[findIndex] = {
                    ...newSelectedGift[findIndex],
                    quantity: value,
                  };

                  setSelectedGift(newSelectedGift);
                }
              }}
              controls={false}
              min={1}
              value={p.quantity}
            />
          );
        },
        classNameHeader: 'bw_text_center',
      },
    ],
    [selectedGift],
  );

  return (
    <div className='bw_modal bw_modal_open' id='bw_add_customer'>
      <div className='bw_modal_container '>
        <div className='bw_title_modal'>
          <h3>Chọn quà tặng</h3>
          <span className='fi fi-rr-cross-small bw_close_modal' onClick={onClose} />
        </div>
        <div className='bw_main_modal'>
          <DataTable
            columns={columns}
            data={giftList.map((item) => ({ ...item, quantity: 1, note: 'Hàng khuyến mại không thu tiền' }))}
            noPaging
            onChangeSelect={setSelectedGift}
            defaultDataSelect={oldSelectedGift}
            fieldCheck='product_id'
            hiddenDeleteClick
          />
        </div>
        <div className='bw_footer_modal bw_mt_1'>
          <button
            type='button'
            className='bw_btn bw_btn_success'
            onClick={() => {
              onConfirm(selectedGift);
            }}>
            <span className='fi fi-rr-check' /> Chọn quà tặng
          </button>
          <button type='button' className='bw_btn_outline bw_close_modal' onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiftModal;
