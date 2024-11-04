import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
// common
import { useAuth } from '../../../context/AuthProvider';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
//components
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import BWButton from 'components/shared/BWButton/index';
// service
import { getOptionsForUser } from 'services/company.service';

// utils
import { mapDataOptions4Select } from 'utils/helpers';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';

export default function StocksReviewLevelFilter({ handleSubmitFilter }) {
  const { user } = useAuth();
  const methods = useForm();
  const [optionsCompany, setOptionsCompany] = useState(null);
  const [optionsStockType, setOptionsStockType] = useState([
    { label: 'Nhập kho', value: 1 },
    { label: 'Xuất kho', value: 2 },
    { label: 'Kiểm kê kho', value: 3 },
    { label: 'Luân chuyển kho', value: 5 },
  ]);
  const [isShowSearch, setIsShowSearch] = useState(true);

  useEffect(() => {
    methods.register('company_id');
    methods.register('is_active');
  }, [methods.register]);
  const getData = async () => {
    let _company = await getOptionsForUser(user.user_name);
    setOptionsCompany(mapDataOptions4Select(_company));
  };
  useEffect(() => {
    getData();
  }, []);

  const onSubmit = () => {
    const q = {
      keyword: methods.watch('keyword'),
      is_active: methods.watch('is_active'),
      company_id: methods.watch('company_id'),
      stocks_type: methods.watch('stocks_type'),
      start_date: methods.watch('start_date'),
      end_date: methods.watch('end_date'),
    };
    console.log(q);
    handleSubmitFilter(q);
  };

  const onClear = () => {
    methods.reset({
      keyword: '',
      is_active: 1,
      company_id: null,
      stocks_type: null,
      start_date: null,
      end_date: null,
    });
    handleSubmitFilter({
      keyword: '',
      is_active: 1,
      company_id: null,
      stocks_type: null,
      start_date: null,
      end_date: null,
    });
  };

  return (
    <div className='bw_search_box'>
      <h3 className='bw_title_search'>
        Tìm kiếm{' '}
        <span className='bw_close_search' onClick={() => setIsShowSearch(!isShowSearch)}>
          <i className='fi fi-rr-angle-small-down' />
        </span>
      </h3>
      {isShowSearch && (
        <>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className='bw_row bw_mt_1'>
                <FormItem className='bw_col_4' label='Từ khóa'>
                  <FormInput type='text' placeholder='Nhập tên mức duyệt' field='keyword' />
                </FormItem>
                <FormItem className='bw_col_4' label='Ngày tạo'>
                  <FormRangePicker
                    style={{ width: '100%' }}
                    fieldStart={'start_date'}
                    fieldEnd={'end_date'}
                    placeholder={['Từ ngày', 'Đến ngày']}
                    format={'DD/MM/YYYY'}
                    allowClear={true}
                  />
                </FormItem>

                <FormItem className='bw_col_4' label='Công ty'>
                  <FormSelect field='company_id' id='bw_company' list={optionsCompany} />
                </FormItem>
                <FormItem className='bw_col_4' label='Hình thức'>
                  <FormSelect field='stocks_type' list={optionsStockType} />
                </FormItem>
                <FormItem className='bw_col_4' label='Trạng thái'>
                  <FormSelect
                    field='is_active'
                    defaultValue={1}
                    allowClear={false}
                    list={[
                      {
                        value: 2,
                        label: 'Tất cả',
                      },
                      {
                        value: 1,
                        label: 'Kích hoạt',
                      },
                      {
                        value: 0,
                        label: 'Ẩn',
                      },
                    ]}
                  />
                </FormItem>
              </div>
              <div className='bw_row bw_align_items_center'>
                <div className='bw_col_6'></div>
                <div className='bw_col_6 bw_flex bw_justify_content_right bw_btn_group'>
                  <BWButton type='success' submit icon='fi fi-rr-filter' content='Tìm kiếm' onClick={onSubmit} />
                  <BWButton type='' outline content='Làm mới' onClick={onClear} />
                </div>
              </div>
            </form>
          </FormProvider>
        </>
      )}
    </div>
  );
}
