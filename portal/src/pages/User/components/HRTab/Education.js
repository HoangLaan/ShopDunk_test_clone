import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Select, notification, Alert } from 'antd';
import { useDispatch } from 'react-redux';
// Compnents
import BWAccordion from 'components/shared/BWAccordion/index';
// Services
import { getOptionsEducationLevel } from 'services/education-level.service';
// Utils
import { showConfirmModal } from 'actions/global';
import { mapDataOptions4Select } from 'utils/helpers';

export default function Education({ title, disabled = true }) {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const {
    watch,
    register,
    formState: { errors },
  } = methods;
  const [optionsEducationLevel, setOptionsEducationLevel] = useState(null);

  useEffect(() => {
    getOptionsEducationLevel()
      .then((options) => setOptionsEducationLevel(mapDataOptions4Select(options)))
      .catch((error) => notification.error({ message: window._$g._(error.message) }));
  }, []);

  const handleAddEducationLevel = () => {
    let educations = methods.getValues('educations') ?? [];
    if (educations.length && educations.filter((x) => !x.education_level_id).length) return;
    educations.push({
      education_level_id: '',
      training_center: '',
      specialized: '',
      graduation_year: '',
    });
    methods.setValue('educations', educations);
  };

  return (
    <BWAccordion title={title} id='bw_level'>
      {/* {errors['educations'] && <Alert type='error' message={errors['educations']?.message} className='bw_mb_2' />} */}
      <div className='bw_table_responsive'>
        <table className='bw_table'>
          <thead>
            <tr>
              <th className='bw_sticky bw_check_sticky bw_text_center'>STT</th>
              <th className='bw_text_center'>Trình độ</th>
              <th className='bw_text_center'>Đơn vị đào tạo</th>
              <th className='bw_text_center'>Chuyên ngành</th>
              <th className='bw_text_center'>Năm tốt nghiệp</th>
              {!disabled && <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {watch('educations') ? (
              watch('educations').map((bk, i) => (
                <tr key={i}>
                  <td className='bw_sticky bw_check_sticky bw_text_center'>{i + 1}</td>
                  <td style={{ width: 300 }}>
                    <Select
                      size='middle'
                      defaultValue={watch(`educations.${i}.education_level_id`) || undefined}
                      onChange={(value) => methods.setValue(`educations.${i}.education_level_id`, value)}
                      options={optionsEducationLevel}
                      disabled={disabled}
                      style={{ width: '100%' }}
                      placeholder='Chọn trình độ'
                    />
                  </td>
                  <td style={{ width: 300 }}>
                    <input
                      disabled={disabled}
                      type='text'
                      placeholder='Đơn vị đào tạo'
                      className='bw_inp bw_mw_3'
                      {...register(`educations.${i}.training_center`)}
                    />
                  </td>
                  <td>
                    <input
                      disabled={disabled}
                      type='text'
                      placeholder='Chuyên ngành'
                      className='bw_inp bw_mw_3'
                      {...register(`educations.${i}.specialized`)}
                    />
                  </td>
                  <td className='bw_text_center'>
                    <input
                      disabled={disabled}
                      type='text'
                      placeholder='Năm tốt nghiệp'
                      className='bw_inp bw_mw_1'
                      {...register(`educations.${i}.graduation_year`)}
                    />
                  </td>
                  {!disabled && (
                    <td className='bw_sticky bw_action_table bw_text_center'>
                      <a
                        onClick={() =>
                          dispatch(
                            showConfirmModal(
                              ['Bạn thực sự muốn xoá'],
                              () => {
                                methods.setValue(
                                  'educations',
                                  watch('educations').filter((_, idx) => idx != i),
                                );
                              },
                              'Đồng ý',
                            ),
                          )
                        }
                        className='bw_btn_table bw_delete bw_red'>
                        <i className='fi fi-rr-trash'></i>
                      </a>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={!disabled ? 6 : 5} className='bw_text_center'>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!disabled && (
        <a onClick={handleAddEducationLevel} className='bw_btn_outline bw_btn_outline_success bw_add_us'>
          <span className='fi fi-rr-plus'></span> Thêm trình độ
        </a>
      )}
    </BWAccordion>
  );
}
