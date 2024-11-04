import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Alert } from 'antd';
//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import BWButton from 'components/shared/BWButton/index';
import { getOptionsCompany } from 'services/company.service';
import { mapDataOptions4Select, mapDataOptions4SelectCustom, showToast } from 'utils/helpers';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getOptionsDepartment } from 'services/department.service';
import { getOptionsPosition } from 'services/position.service';
import { isArray } from 'lodash';
import { createBudgetReviewLevel, getListBudgetReviewLv, deleteReviewLv } from 'services/budget-review-lv.service';

export default function BudgetTypeAddModal({ showModalAdd, setShowModalAdd, onRefresh }) {
  const methods = useForm();
  const [companyOptions, setCompanyOptions] = useState([]);
  const [positionOpts, setPositionOpts] = useState([{ value: -1, label: 'Tất cả chức vụ' }]);
  const [departmentOpts, setDepartmentOpts] = useState([{ value: -1, label: 'Tất cả phòng ban' }]);
  const [listReviewLevel, setListReviewLevel] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [fields, setFields] = useState([]);
  const getOptions = useCallback(() => {
    getOptionsCompany().then((res) => {
      setCompanyOptions(mapDataOptions4SelectCustom(res));
    });
  }, []);
  useEffect(getOptions, [getOptions]);

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = methods;

  const getDepartment = useCallback(() => {
    getOptionsDepartment({ company_id: watch('company_id') }).then((res) =>
      setDepartmentOpts([{ value: -1, label: 'Tất cả phòng ban' }].concat(mapDataOptions4Select(res))),
    );
    getOptionsPosition({ company_id: watch('company_id') }).then((res) =>
      setPositionOpts([{ value: -1, label: 'Tất cả chức vụ' }].concat(mapDataOptions4Select(res))),
    );
  }, [watch('company_id')]);

  useEffect(getDepartment, [getDepartment]);

  useEffect(() => {
    if (companyOptions.length > 0) setValue('company_id', 1);
  }, [companyOptions]);

  const getListReview = useCallback(() => {
    getListBudgetReviewLv({ company_id: watch('company_id') }).then((res) => {
      const handleData = res.items.reduce((uniqueItems, item) => {
        const indexItem = uniqueItems.findIndex((i) => i.budget_review_level_id === item.budget_review_level_id);
        if (indexItem === -1) {
          uniqueItems.push({
            budget_review_level_id: item.budget_review_level_id,
            budget_review_level_name: item.budget_review_level_name,
            company_name: item.company_name,
            department_name: item.is_apply_all_department ? ['Tất cả phòng ban'] : [item.department_name],
            position_name: item.is_apply_all_position ? ['Tất cả vị trí'] : [item.position_name],
          });
        } else {
          uniqueItems[indexItem].department_name = (uniqueItems[indexItem].department_name || []).concat(
            item.department_name,
          );
          uniqueItems[indexItem].position_name = (uniqueItems[indexItem].position_name || []).concat(
            item.position_name,
          );
        }
        return uniqueItems;
      }, []);
      setListReviewLevel(handleData);
    });
  }, [watch('company_id')]);

  useEffect(getListReview, [getListReview]);
  const getListDepartments = useCallback(() => {
    setFields(departmentOpts.filter((obj1) => (watch('departments') || []).some((obj2) => obj2.value === obj1.value)));
  }, [watch('departments')]);

  useEffect(getListDepartments, [getListDepartments]);

  const optionRender = (options = [], key) => {
    let _option = [...options];
    // Kiểm tra xem nếu đã chọn tất cả phòng ban

    if (isArray(watch(key))) {
      const isCheckAll = (watch(key) || []).filter((k) => k.value * 1 === -1).length;
      _option = options.map((_item) => {
        return {
          ..._item,
          disabled: _item?.value > -1 && isCheckAll ? true : false,
        };
      });
    }
    return _option;
  };
  const onSubmit = async (formData) => {
    try {
      await createBudgetReviewLevel(formData);
      showToast.success('Thêm mới mức duyệt thành công!!!');
      reset({ is_active: 1, stock_type: 0 });
      setAlerts([]);
      // onRefresh();
    } catch (error) {
      let { errors, statusText, message } = error;
      let msg = [`${statusText || message}`].concat(errors || []).join('<br/>');
      setAlerts([{ type: 'error', msg }]);
    }
  };

  useEffect(() => {
    if (errors) window.scrollTo(0, 0);
  }, [errors]);

  return (
    <React.Fragment>
      <div className='bw_modal bw_modal_open' id='bw_add_budget_type'>
        <div className='bw_modal_container bw_w800 bw_filter'>
          <div className='bw_title_modal'>
            <h3> Thêm mới mức duyệt</h3>
            <span className='bw_close_modal fi fi-rr-cross-small' onClick={() => setShowModalAdd({ isOpen: false })} />
          </div>
          {alerts.map(({ type, msg }, idx) => {
            return <Alert key={`alert-${idx}`} type={type} message={msg} showIcon />;
          })}
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='bw_main_modal  '>
                <BWAccordion title='Thông tin mức duyệt' id='bw_info_cus' isRequired={false}>
                  <div className='bw_row'>
                    <div className='bw_col_6'>
                      <FormItem label='Tên mức duyệt' isRequired={true}>
                        <FormInput
                          type='text'
                          field='budget_review_level_name'
                          placeholder='Nhập tên mức duyệt'
                          validation={{
                            required: 'Tên mức duyệt là bắt buộc',
                          }}
                        />
                      </FormItem>
                    </div>
                    <div className='bw_col_6'>
                      <FormItem className='bw_col_12' label='Thuộc công ty' isRequired>
                        <FormSelect
                          field='company_id'
                          list={companyOptions}
                          validation={{
                            required: 'Công ty là bắt buộc',
                          }}
                        />
                      </FormItem>
                    </div>
                    <div className='bw_col_12'>
                      <FormItem label='Phòng ban duyệt' className='bw_col_12' isRequired={true}>
                        <FormSelect
                          field='departments'
                          id='departments'
                          list={optionRender(departmentOpts, 'departments')}
                          allowClear={true}
                          mode={'tags'}
                          validation={{
                            required: 'Phòng ban duyệt là bắt buộc.',
                          }}
                        />
                      </FormItem>
                    </div>
                    <div className='bw_col_12'>
                      <table className='bw_table bw_col_12'>
                        <thead>
                          <tr>
                            <th className='bw_text_center'>STT</th>
                            <th>Phòng ban duyệt</th>
                            <th>Vị trí duyệt</th>
                            <th className='bw_text_center'>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fields && fields.length ? (
                            fields.map((p, index) => {
                              return (
                                <tr>
                                  <td className='bw_text_center'>{index + 1}</td>
                                  <td>{p.label}</td>
                                  <td>
                                    <FormSelect
                                      field={`positions.${index}`}
                                      id={`positions.${index}`}
                                      list={positionOpts}
                                      allowClear={true}
                                      mode={'tags'}
                                      validation={{
                                        required: 'Phòng ban duyệt là bắt buộc.',
                                      }}
                                    />
                                  </td>
                                  <td className='bw_text_center'>
                                    <a
                                      className='bw_btn_table bw_delete bw_red'
                                      title='Xoá'
                                      onClick={() => {
                                        setValue(
                                          'departments',
                                          watch('departments').filter((value) => value.id !== p.id),
                                        );
                                      }}>
                                      <i className='fi fi-rr-trash'></i>
                                    </a>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={50} className='bw_text_center'>
                                Không có dữ liệu
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      <div className='bw_flex  bw_justify_content_right bw_mb_1'>
                        <a data-href='' className='bw_btn bw_btn_primary bw_add_us' onClick={handleSubmit(onSubmit)}>
                          <span className='fi fi-rr-plus'></span> Thêm
                        </a>
                      </div>
                    </div>
                  </div>
                </BWAccordion>
                <BWAccordion title='Danh sách mức duyệt' id='bw_mores' isRequired={false}>
                  <div className='bw_row'>
                    <table style={{ display: 'block' }} className='bw_table bw_col_12'>
                      <thead>
                        <tr>
                          <th className='bw_text_center'>STT</th>
                          <th>Tên mức duyệt</th>
                          <th>Phòng ban duyệt</th>
                          <th>Vị trí duyệt</th>
                          <th>Công ty</th>
                          <th className='bw_text_center'>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listReviewLevel && listReviewLevel.length ? (
                          listReviewLevel.map((p, index) => {
                            return (
                              <tr>
                                <td className='bw_text_center'>{index + 1}</td>
                                <td>{p?.budget_review_level_name}</td>
                                <td>
                                  {(p?.department_name || []).map((u) => (
                                    <h1>{u}</h1>
                                  ))}
                                </td>
                                <td>
                                  {(p?.position_name || []).map((u) => (
                                    <h1>{u}</h1>
                                  ))}
                                </td>
                                <td className='bw-truncate'>{p?.company_name}</td>
                                <td className='bw_text_center'>
                                  <a
                                    className='bw_btn_table bw_delete bw_red'
                                    onClick={async () => {
                                      await deleteReviewLv(p?.budget_review_level_id);
                                      getListReview();
                                    }}
                                    title='Xoá'>
                                    <i className='fi fi-rr-trash'></i>
                                  </a>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={50} className='bw_text_center'>
                              Không có dữ liệu
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </BWAccordion>
              </div>
              <div className='bw_footer_modal bw_flex bw_justify_content_right bw_align_items_center'>
                <BWButton type='' outline content='Đóng' onClick={() => setShowModalAdd({ isOpen: false })}></BWButton>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </React.Fragment>
  );
}
