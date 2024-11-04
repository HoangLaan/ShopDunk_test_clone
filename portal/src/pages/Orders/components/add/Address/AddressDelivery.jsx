import DataTable from 'components/shared/DataTable/index';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { formatPrice } from 'utils/index';
import { getListAddressBook, getListBusinessAddress } from 'pages/Orders/helpers/call-api';
import AddressBookModel from './AddressBookModel/AddressBookModel';

dayjs.extend(customParseFormat);

const AddressDelivery = ({ disabled, orderId }) => {
  const methods = useFormContext({});

  const [isModelAddressBook, setIsModelAddressBook] = useState(false);

  const [loading, setLoading] = useState(false);

  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 25,
  });

  const [addressBook, setAddresBook] = useState([]);
  const isOrderFromStocksTransfer = methods.watch('order_type') === 11;

  const getInitAddress = useCallback(() => {
    if (methods.watch('member_id')) {
      setLoading(false);
      getListAddressBook(methods.watch('member_id').replace('KH', ''), params)
        .then((res) => {
          setAddresBook(res);

          // Kiểm tra nếu chưa có chọn địa chỉ giao ==> lấy địa chỉ mặc định
          if (!methods.watch('address_id') && !orderId) {
            const addressDefault = (res || []).find((_address) => _address.is_default);

            if (addressDefault) {
              methods.setValue('address_id', addressDefault?.address_id);
            }
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }

    if (isOrderFromStocksTransfer) {
      setLoading(false);
      getListBusinessAddress({ order_id: methods.watch('order_id') })
        .then((res) => {
          const business_receive = res.business_receive;
          setAddresBook([
            {
              address_full: business_receive.business_address_full,
              full_name: business_receive.business_name,
              phone_number: business_receive.business_phone_number,
              is_default: 1,
            },
          ]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [methods.watch('member_id'), isOrderFromStocksTransfer]);

  useEffect(() => {
    getInitAddress();
  }, [getInitAddress]);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_w1 bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p, idx) => <span>{idx + 1}</span>,
      },
      {
        header: 'Họ và tên',
        accessor: 'full_name',
      },
      {
        header: 'Số điện thoại',
        accessor: 'phone_number',
      },
      {
        header: 'Email',
        accessor: 'email',
      },
      {
        header: 'Địa chỉ',
        accessor: 'address_full',
      },
      {
        header: 'Mặc định',
        classNameHeader: 'bw_w1 bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'order_status_name',
        formatter: (p) => (p?.is_default == 1 ? <i className='fi fi-rr-check' /> : null),
      },
      {
        header: 'Chọn',
        classNameHeader: 'bw_sticky bw_check_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_check_sticky bw_text_center',
        accessor: 'order_status_name',
        formatter: (p) => (
          <label className='bw_checkbox'>
            <input
              type='checkbox'
              checked={p?.address_id == methods.watch('address_id')}
              onChange={() => methods.setValue('address_id', p?.address_id)}
              disabled={disabled}
            />
            <span></span>
          </label>
        ),
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        content: 'Thêm mới địa chỉ KH',
        icon: 'fi fi-rr-plus',
        type: 'success',
        hidden: disabled ? disabled : !methods.watch('member_id'),
        permission: 'CRM_ADDRESSBOOK_ADD',
        onClick: (p) => {
          setIsModelAddressBook(true);
        },
      },
    ];
  }, [methods, disabled]);

  return (
    <React.Fragment>
      <DataTable
        columns={columns}
        data={addressBook}
        actions={actions}
        loading={loading}
        noPaging={true}
        noSelect={true}
      />

      {isModelAddressBook ? (
        <AddressBookModel
          onClose={() => setIsModelAddressBook(false)}
          getInitAddress={getInitAddress}
          customerId={methods.watch('member_id')}
        />
      ) : null}
    </React.Fragment>
  );
};

export default AddressDelivery;
