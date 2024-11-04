import React, { useState, useEffect } from 'react';
import { defaultPaging } from 'utils/helpers';
import { getDetailProduct } from 'services/discount-program-product.service';
import { mapDataProduct } from 'pages/InstallmentForm/utils/helper';
import DataTable from 'components/shared/DataTable';
import { useMemo } from 'react';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import { FormProvider, useForm } from 'react-hook-form';
import moment from 'moment';
import FormItem from 'components/shared/BWFormControl/FormItem';
import styled from 'styled-components';
import { formatPrice } from 'utils';

const TableStyled = styled.div`
  .bw_box_card > .bw_row.bw_mt_2.bw_mb_2 {
    margin-bottom: 0px;
    margin-top: 0px;
  }
`;

const AddCategoryModal = ({ onClose, title, item }) => {
  const methods = useForm({
    defaultValues: {
      date_from: moment(`15/${item.month}/${item.year}`, 'DD/MM/YYYY').startOf('month').format('DD/MM/YYYY'),
      date_to: moment(`15/${item.month}/${item.year}`, 'DD/MM/YYYY').endOf('month').format('DD/MM/YYYY'),
    },
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDetailProduct({
      product_id: item.product_id,
      discount_program_id: item.discount_program_id,
      month: item.month,
      year: item.year,
    })
      .then((data) => {
        setData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [item]);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => {
          return index + 1;
        },
      },
      {
        header: 'Mã đơn hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'order_no',
      },
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Khách hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'customer_name',
      },
      {
        header: 'SĐT Khách hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'phone_number',
      },
      {
        header: 'Imei',
        classNameHeader: 'bw_text_center',
        accessor: 'imie_code',
      },
      {
        header: 'Sản phẩm',
        classNameHeader: 'bw_text_center',
        accessor: 'product_name',
      },
      {
        header: 'Giá trị chiết khấu',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        accessor: 'discount_money',
        formatter: (item) => formatPrice(item?.discount_money, false, ','),
      },
      {
        header: 'Cửa hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'store_name',
      },
      {
        header: 'Loại đơn hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'order_type_name',
      },
      {
        header: 'Trạng thái đơn hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'status_name',
      },
      {
        header: 'Chi nhánh',
        classNameHeader: 'bw_text_center',
        accessor: 'business_name',
      },
    ],
    [],
  );

  return (
    <FormProvider {...methods}>
      <div className='bw_modal bw_modal_open' id='bw_addProduct'>
        <div
          class='bw_modal_container bw_w1200 bw_modal_wrapper'
          style={{ maxHeight: '80vh', marginTop: '60px', minHeight: '50vh' }}>
          <div class='bw_title_modal'>
            <h3>{title}</h3>
            <span class='fi fi-rr-cross-small bw_close_modal' onClick={onClose}></span>
          </div>
          <div>
            <div className='bw_row'>
              <div className='bw_col_4'>
                <FormItem label='Ngày tạo đơn hàng' disabled>
                  <FormRangePicker
                    style={{ width: '100%' }}
                    fieldStart='date_from'
                    fieldEnd='date_to'
                    placeholder={['Từ ngày', 'Đến ngày']}
                    format={'DD/MM/YYYY'}
                    allowClear={false}
                  />
                </FormItem>
              </div>
            </div>
            <TableStyled>
              <DataTable noSelect noPaging columns={columns} data={data} actions={[]} loading={loading} />
            </TableStyled>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default AddCategoryModal;
