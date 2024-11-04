import { Alert, notification } from 'antd';
import BWAccordion from 'components/shared/BWAccordion';
import BWButton from 'components/shared/BWButton';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import BWImage from 'components/shared/BWImage';
import Modal from 'components/shared/Modal';
import { msgError } from 'pages/TimeKeeping/helpers/msgError';
import { ModalAddStyled } from 'pages/TimeKeeping/helpers/style';
import DepartmentModel from 'pages/UserSchedule/components/DepartmentModel/DepartmentModel';
import DepartmentTable from 'pages/UserSchedule/components/DepartmentTable';
import ShiftModel from 'pages/UserSchedule/components/ShiftModel/ShiftModel';
import ShiftTable from 'pages/UserSchedule/components/ShiftTable';
import { getCompanyOpts, getStoreOpts, getBusinessOpts, create } from 'pages/UserSchedule/helpers/call-api';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { mapDataOptions4Select } from 'utils/helpers';

const ModalAddUserSchedule = ({ open, selected, onClose, onRefresh }) => {
  const methods = useForm({
    defaultValues: {
      shift: null,
      user: null,
    },
  });
  const {
    formState: { isValid },
  } = methods;
  const [companyOpts, setCompanyOpts] = useState([]);
  const [businessOpts, setBusinessOpts] = useState([]);
  const [storeOpts, setStoreOpts] = useState([]);
  const [isModelShift, setIsModelShift] = useState(false);
  const [isModelDepartment, setIsModelDepartment] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (companyOpts?.length === 1) {
      handleGetBusiness(companyOpts[0].id);
    }
  }, [companyOpts]);

  const getInitData = useCallback(async () => {
    try {
      // lấy danh sách công ty
      const companyOpts = await getCompanyOpts();
      methods.setValue('company_id', companyOpts[0]?.id);
      setCompanyOpts(mapDataOptions4Select(companyOpts));
    } catch (error) {
      notification.error({
        message: 'Đã xảy ra lỗi vui lòng thử lại',
      });
    }
  }, [methods]);

  useEffect(() => {
    getInitData();
  }, [getInitData]);

  // const handleGetBusiness = async (value) => {
  //   methods.setValue('company_id', value);
  //   methods.setValue('business', []);
  //   console.log('company_id: ', value);
  //   if (value || methods.watch('company_id')) {
  //     console.log('call apigetBusinessOpts');
  //     // lấy danh sách chi nhanh làm việc
  //     const businessOpts = await getBusinessOpts(value);
  //     setBusinessOpts(mapDataOptions4Select(businessOpts));
  //   }
  // };

  const handleGetBusiness = useCallback(async (com_Id) => {
    try {
      methods.setValue('business', []);
      // lấy danh sách chi nhanh làm việc
      const businessOpts = await getBusinessOpts(com_Id);
      setBusinessOpts(mapDataOptions4Select(businessOpts));
    } catch (error) {
      notification.error({
        message: 'Đã xảy ra lỗi vui lòng thử lại',
      });
    }
  }, [methods]);

  const com_Id = methods.watch('company_id')
  useEffect(() => {
    if (com_Id) {
      handleGetBusiness(com_Id);
    }
  }, [handleGetBusiness, com_Id]);

  const handleGetStore = async () => {
    if (methods.watch('business') && methods.watch('business').length) {
      // lấy danh sách chi nhanh làm việc
      const businessOpts = await getStoreOpts({ business: methods.watch('business') });

      setStoreOpts(mapDataOptions4Select(businessOpts));
    } else {
      setStoreOpts([]);
    }
  };

  const handleSelect = (key, values = {}) => {
    methods.setValue(`${key}`, values);
    setIsModelShift(false);
    setIsModelDepartment(false);
  };

  const handleDeleteModel = (key = '', keyValue = '') => {
    let _ojectValue = methods.watch(`${key}`);

    if (_ojectValue[`${keyValue}`]) {
      delete _ojectValue[`${keyValue}`];
    }
    methods.setValue(`${key}`, _ojectValue);
  };

  const onSubmit = async () => {
    let values = methods.getValues();
    //validate data
    setAlerts([]);
    if (Object.keys(values.shift || {}).length <= 0) {
      setAlerts([{ type: 'warning', msg: 'Vui lòng chọn ca làm việc' }]);
      return;
    }
    if (
      !methods.watch('is_select_all') &&
      // Object.keys(methods.watch('department') || {}).length <= 0 &&
      Object.values([selected.user] || []).length <= 0
    ) {
      setAlerts([{ type: 'warning', msg: 'Vui lòng chọn phân ca' }]);
      return;
    }

    let formData = {
      ...values,
      is_pick_date: 1,
      pickDate: {
        day: `${selected.day}`,
      },
      shift: Object.values(methods.watch('shift') || []),
      department: Object.values(methods.watch('department') || []),
      user: Object.values([selected.user] || []),
    };
    try {
      await create(formData);
      notification.success({
        message: 'Thêm mới ca làm việc thành công',
      });
      methods.reset({ shift: null });
      setAlerts([]);
      onRefresh();
      onClose()
    } catch (error) {
      notification.error({
        message: error?.message || 'Đã xảy ra lỗi vui lòng thử lại',
      });
    }
  };

  return (
    <Modal
      open={open}
      witdh={'50%'}
      footer={<BWButton content={'Thêm ca'} onClick={() => methods.handleSubmit(onSubmit)()}></BWButton>}
      onClose={onClose}
      header={'Thêm mới ca làm việc'}>
      <FormProvider {...methods}>
        <ModalAddStyled>
          {alerts.map(({ type, msg }, idx) => {
            return <Alert key={`alert-${idx}`} type={type} message={msg} showIcon />;
          })}
          <BWAccordion title='Thông tin nhân viên'>
            <div className='bw_row '>
              <div className='bw_col_6 bw_inf_pro'>
                <BWImage src={selected?.user?.user_picture_url} />
                <b>{selected?.user?.user_fullname}</b>
              </div>
              <div className='bw_col_6'>
                <b className='bw_ml_2'>Phòng ban: </b>
                <span> {selected?.user?.department_name}</span>
              </div>
            </div>
          </BWAccordion>
          <BWAccordion title='Miền áp dụng' id='bw_info_cus' isRequired={true}>
            <div className='bw_row'>
              <FormItem label='Công ty' className='bw_col_6' isRequired={true}>
                <FormSelect
                  field='company_id'
                  id='company_id'
                  value={methods.watch('company_id')}
                  list={companyOpts}
                  validation={msgError['company_id']}
                  onChange={(value) => methods.setValue('company_id', value)}
                />
              </FormItem>

              <FormItem label='Miền' className='bw_col_6' isRequired={true}>
                <FormSelect
                  field='business'
                  id='business'
                  list={businessOpts}
                  mode='multiple'
                  validation={msgError['business']}
                  onChange={(value) => {
                    methods.clearErrors('business');
                    if (Array.isArray(value)) {
                      methods.setValue(
                        'business',
                        (value || []).map((_) => {
                          return { id: _, value: _ };
                        }),
                      );
                    }
                    handleGetStore();
                    methods.setValue('store', []);
                  }}
                />
              </FormItem>
              <FormItem label='Cửa hàng' className='bw_col_6' isRequired={true}>
                <FormSelect field='store' id='store' list={storeOpts} mode='multiple' validation={msgError['store']} />
              </FormItem>
            </div>
          </BWAccordion>
          <BWAccordion title='Thời gian' id='bw_cc' isRequired={true}>
            <div className='bw_table_responsive'>
              <ShiftTable data={Object.values(methods.watch('shift') || {})} handleDelete={handleDeleteModel} />
            </div>
            <a onClick={() => setIsModelShift(true)} className='bw_btn_outline bw_btn_outline_success bw_add_us'>
              <span className='fi fi-rr-plus'></span>
              Chọn ca làm việc
            </a>
          </BWAccordion>

          {/* Comment lại phân ca */}
          {/* <BWAccordion title='Phân ca' id='bw_info_cus' isRequired={true}>
            <label className='bw_checkbox'>
              <FormInput type='checkbox' field='is_select_all' />
              <span></span>
              Chọn tất cả
            </label>

            <p className='bw_mt_2'>
              <b>Phòng ban</b>
            </p>

            <DepartmentTable data={Object.values(methods.watch('department') || {})} handleDelete={handleDeleteModel} />
            {!methods.watch('is_select_all') ? (
              <a
                data-href=''
                className='bw_btn_outline bw_btn_outline_success bw_add_us'
                onClick={() => setIsModelDepartment(true)}>
                <span className='fi fi-rr-plus'></span>
                Chọn phòng ban
              </a>
            ) : null}
          </BWAccordion> */}
        </ModalAddStyled>
        <ShiftModel
          open={isModelShift}
          onConfirm={handleSelect}
          onClose={() => setIsModelShift(false)}
          header={'Chọn ca làm việc'}
          footer={'Xác nhận'}
          selected={methods.watch('shift') || {}}
          store_ids={methods.watch('store') || {}}
          user_id={selected?.user?.user_id}
        />
        <DepartmentModel
          open={isModelDepartment}
          onConfirm={handleSelect}
          onClose={() => setIsModelDepartment(false)}
          header={'Chọn ca làm việc'}
          footer={'Xác nhận'}
          selected={methods.watch('department') || {}}
        />
      </FormProvider>
    </Modal>
  );
};

export default ModalAddUserSchedule;
