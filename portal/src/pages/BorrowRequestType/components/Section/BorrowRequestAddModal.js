import React, {useCallback, useEffect, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import BWButton from 'components/shared/BWButton/index';
import {getOptionsCompany} from "services/company.service";
import {mapDataOptions4Select, showToast} from "utils/helpers";
import FormSelect from "components/shared/BWFormControl/FormSelect";
import {getOptionsDepartment} from "services/department.service";
import {getOptionsPosition} from "services/position.service";
import {isArray} from "lodash";
import {create} from "services/borrow-request-rl.service";

export default function BorrowRequestAddModal({ listReview,onRefresh, companyId,setShowModalAdd}) {
  const methods = useForm();
  const [companyOptions, setCompanyOptions] = useState([]);
  const [positionOpts, setPositionOpts] = useState([{value: -1, label: "Tất cả chức vụ"}])
  const [departmentOpts, setDepartmentOpts] = useState([{value: -1, label: "Tất cả phòng ban"}])
  const [listReviewLevel, setListReviewLevel] = useState([])
  const [fields, setFields] = useState([])
  const getOptions = useCallback(() => {
    getOptionsCompany().then((res) => {
      setCompanyOptions(mapDataOptions4Select(res));
    });
    setValue("company_id",companyId)
  }, []);
  useEffect(getOptions, [getOptions])

  const getListReview = useCallback(() => {
      const handleData=listReview.reduce((uniqueItems, item) => {
        const indexItem = uniqueItems.findIndex(i => i.borrow_review_level_id === item.borrow_review_level_id);
        if (indexItem === -1) {
          uniqueItems.push(
            {
              "borrow_review_level_id": item.borrow_review_level_id,
              "borrow_review_level_name": item.borrow_review_level_name,
              "company_name": item.company_name,
              "department_name": item.is_apply_all_department ? ["Tất cả phòng ban"] : [item.department_name],
              "position_name": item.is_apply_all_position ? ["Tất cả vị trí"] : [item.position_name]
            }
          );
        } else {
          if(!(uniqueItems[indexItem].department_name || [] ).includes(item.department_name))
            (uniqueItems[indexItem].department_name || []).push(item.department_name)
          if(!(uniqueItems[indexItem].position_name || [] ).includes(item.position_name))
            (uniqueItems[indexItem].position_name || []).push(item.position_name)
        }
        return uniqueItems;
      }, []);
      setListReviewLevel(handleData)
    }, [listReview]
    );

  useEffect(getListReview, [getListReview])


  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    setError,
    formState: {errors},
  } = methods;

  const getDepartment = useCallback(() => {
    getOptionsDepartment({"company_id": companyId}).then((res) =>
      setDepartmentOpts([{value: -1, label: "Tất cả phòng ban"}].concat(mapDataOptions4Select(res)))
    );
    getOptionsPosition({"company_id": companyId}).then((res) =>
      setPositionOpts([{value: -1, label: "Tất cả chức vụ"}].concat(mapDataOptions4Select(res)))
    );
  }, [companyId])

  useEffect(getDepartment, [getDepartment])

  const getListDepartments = useCallback(() => {
    setFields(departmentOpts.filter((obj1) => (watch("departments") || []).some(obj2 => obj2.value === obj1.value)))
  }, [watch("departments")]);

  useEffect(getListDepartments, [getListDepartments])

  const optionRender = (options = [], key) => {
    let _option = [...options]
    // Kiểm tra xem nếu đã chọn tất cả

    if (isArray(watch(key))) {
      const isCheckAll = (watch(key) || []).filter((k) => k.value * 1 === -1).length;
      _option = options.map((_item) => {
        return {
          ..._item,
          disabled: _item?.value > -1 && isCheckAll ? true : false
        }})
    }
    return _option
  }
  const onSubmit = async (formData) => {
    try {
      await create(formData);
      showToast.success('Thêm mới mức duyệt thành công!!!');
      reset({});
      onRefresh();
    } catch (error) {
      showToast.error('Thêm mới mức duyệt thành công!!!');
    }
  };

  useEffect(() => {
    if (errors) window.scrollTo(0, 0);
  }, [errors]);

  return (
    <React.Fragment>
      <div className='bw_modal bw_modal_open' id='bw_add_borrow_type'>
        <div className='bw_modal_container bw_w800 bw_filter'>
          <div className='bw_title_modal'>
            <h3> Thêm mới mức duyệt</h3>
            <span className='bw_close_modal fi fi-rr-cross-small' onClick={() => setShowModalAdd({isOpen: false})}/>
          </div>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='bw_main_modal  '>
                <BWAccordion title='Thông tin mức duyệt' id='bw_info_cus' isRequired={false}>
                  <div className='bw_row'>
                    <div className='bw_col_6'>
                      <FormItem label='Tên mức duyệt' isRequired={true}>
                        <FormInput
                          type='text'
                          field='borrow_review_level_name'
                          placeholder='Nhập tên mức duyệt'
                          validation={{
                            required: 'Tên mức duyệt là bắt buộc',
                          }}
                        />
                      </FormItem>
                    </div>
                    <div className='bw_col_6'>
                      <FormItem label='Thuộc công ty' disabled={true} isRequired>
                        <FormSelect
                          field='company_id'
                          disabled={true}
                          list={companyOptions}
                          validation={{
                            required: 'Công ty là bắt buộc',
                          }}
                        />
                      </FormItem>
                    </div>
                    <div className='bw_col_12'>
                      <FormItem label='Phòng ban duyệt'  isRequired={true}>
                        <FormSelect
                          field='departments'
                          id='departments'
                          list={optionRender(departmentOpts, 'departments')}
                          allowClear={true}
                          mode={'tags'}
                          validation={{
                            required: 'Phòng ban duyệt là bắt buộc.'
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
                        {
                          fields && fields.length ? (
                            fields.map((p, index) => {
                              return (
                                <tr>
                                  <td className='bw_text_center'>{index + 1}</td>
                                  <td>
                                    {p.label}
                                  </td>
                                  <td>
                                    {p.value === -1?
                                      <div>Tất cả vị trí</div>
                                    :
                                      <FormSelect
                                        field={`positions.${index}`}
                                        id={`positions.${index}`}
                                        list={optionRender(positionOpts,`positions.${index}`) }
                                        allowClear={true}
                                        mode={'tags'}
                                        validation={{
                                          required: 'Phòng ban duyệt là bắt buộc.'
                                        }}
                                      />
                                    }

                                  </td>
                                  <td className='bw_text_center'>
                                    <a
                                      className='bw_btn_table bw_delete bw_red'
                                      title='Xoá'
                                      onClick={() => {
                                        setValue('departments', watch("departments").filter(value => value.id !== p.id));
                                      }}
                                    >
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
                    <table className='bw_table bw_col_12'>
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
                      {
                        listReviewLevel && listReviewLevel.length ? (
                          listReviewLevel.map((p, index) => {
                            return (
                              <tr>
                                <td className='bw_text_center'>{index + 1}</td>
                                <td>
                                  {p?.borrow_review_level_name}

                                </td>
                                <td>
                                  {(p?.department_name || []).map((u) =>
                                    <h1>{u}</h1>
                                  )}
                                </td>
                                <td>
                                  {(p?.position_name || []).map((u) =>
                                    <h1>{u}</h1>
                                  )}
                                </td>
                                <td className="bw-truncate">
                                  {p?.company_name}
                                </td>
                                <td>
                                </td>
                                <td className='bw_text_center'>

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
                <BWButton type='' outline content='Đóng' onClick={() => setShowModalAdd({isOpen: false})}></BWButton>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </React.Fragment>
  );
}
