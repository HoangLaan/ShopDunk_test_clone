import BWAccordion from 'components/shared/BWAccordion';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { generateRandomString } from 'pages/Coupon/helpers';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { showToast } from 'utils/helpers';

function CouponConfig({ loading, title, disabled }) {
  const methods = useFormContext();
  const { watch, setValue } = methods;

  const is_letter_n_number = watch('is_letter_n_number');
  const is_letter = watch('is_letter');
  const is_number = watch('is_number');
  const total_letter = watch('total_letter') || 6;
  const prefixes = watch('prefixes');
  const suffixes = watch('suffixes');

  const generatePreviewCode = () => {
    let code = '';
    const prefixesLength = prefixes?.length || 0;
    const suffixesLength = suffixes?.length || 0;
    const randomStringLength =
      total_letter - prefixesLength - suffixesLength >= 0 ? total_letter - prefixesLength - suffixesLength : 0;
    if (is_letter_n_number) {
      const _string = generateRandomString(1, randomStringLength);
      code = (prefixes || '') + _string + (suffixes || '');
    } else if (is_letter) {
      const _string = generateRandomString(2, randomStringLength);
      code = (prefixes || '') + _string + (suffixes || '');
    } else if (is_number) {
      const _string = generateRandomString(3, randomStringLength);
      code = (prefixes || '') + _string + (suffixes || '');
    }
    if (code?.length > total_letter) {
      code = code.slice(0, total_letter);
    }

    setValue('preview_code', code);
  };

  const clearPrefixAndSuffixes = useCallback(() => {
    setValue('prefixes', null);
    setValue('suffixes', null);
  }, []);

  useEffect(generatePreviewCode, [is_letter_n_number, is_letter, is_number, total_letter, prefixes, suffixes]);
  return (
    <React.Fragment>
      <BWAccordion title={title} isRequired>
        <div className='bw_col_12'>
          <div className='bw_row'>
            <div className='bw_col_8'>
              <div className='bw_row'>
                <div className='bw_col_4'>
                  <label class='bw_radio bw_col_12'>
                    <FormInput
                      disabled={disabled}
                      type='checkbox'
                      field='is_letter_n_number'
                      onChange={() => {
                        setValue('is_letter_n_number', 1);
                        setValue('is_letter', 0);
                        setValue('is_number', 0);
                        clearPrefixAndSuffixes();
                      }}
                    />
                    <span />
                    Cả chữ và số
                  </label>
                </div>
                <div className='bw_col_4'>
                  <label class='bw_radio bw_col_12'>
                    <FormInput
                      disabled={disabled}
                      type='checkbox'
                      field='is_letter'
                      onChange={() => {
                        setValue('is_letter', 1);
                        setValue('is_letter_n_number', 0);
                        setValue('is_number', 0);
                        clearPrefixAndSuffixes();
                      }}
                    />
                    <span />
                    Chỉ chữ
                  </label>
                </div>
                <div className='bw_col_4'>
                  <label class='bw_radio bw_col_12'>
                    <FormInput
                      disabled={disabled}
                      type='checkbox'
                      field='is_number'
                      onChange={() => {
                        setValue('is_number', 1);
                        setValue('is_letter_n_number', 0);
                        setValue('is_letter', 0);
                        clearPrefixAndSuffixes();
                      }}
                    />
                    <span />
                    Chỉ số
                  </label>
                </div>
              </div>
            </div>
            <div className='bw_col_4'>
              <FormItem disabled={disabled} label='Xem trước mã'>
                <FormInput disabled={true} type='text' field='preview_code' placeholder='XXXXXX' />
                <p style={{ fontStyle: 'italic' }}>X là các ký tự ngẫu nhiên</p>
              </FormItem>
            </div>
            <div className='bw_col_4'>
              <FormItem disabled={disabled} label='Số lượng ký tự'>
                <FormInput
                  disabled={disabled}
                  min={1}
                  type='number'
                  field='total_letter'
                  placeholder='VD: 6'
                  onChange={(ev) => {
                    if (ev?.target?.value > 20) {
                      showToast.warning('Nhập tối đa 20 ký tự');
                      return;
                    }
                    setValue('total_letter', ev?.target?.value);
                  }}
                />
                <p style={{ fontStyle: 'italic' }}>Nhập tối đa 20 ký tự</p>
              </FormItem>
            </div>
            <div className='bw_col_4'>
              <FormItem disabled={disabled} label='Tiền tố'>
                <FormInput
                  disabled={disabled}
                  type='text'
                  field='prefixes'
                  placeholder='VD: KM'
                  validation={{
                    validate: (p) => {
                      if (p?.length > (methods.watch('total_letter') || 20)) {
                        return 'Số lượng ký tự theo quy định';
                      }
                    },
                  }}
                  onChange={(ev) => {
                    const inputValue = ev?.target?.value;
                    if (!inputValue) return setValue('prefixes', null);
                    if (ev?.target?.value.length > 20) {
                      showToast.warning('Nhập tối đa 20 ký tự');
                      return;
                    }
                    const is_letter = watch('is_letter');
                    const is_number = watch('is_number');
                    if (is_letter && !/^[a-zA-Z]+$/.test(inputValue)) {
                      showToast.warning('Nhập ký tự là chữ');
                      return;
                    }

                    if (is_number && !/^\d+$/.test(inputValue)) {
                      showToast.warning('Nhập ký tự là số');
                      return;
                    }
                    setValue('prefixes', ev?.target?.value);
                  }}
                />
                <p style={{ fontStyle: 'italic' }}>Nhập tối đa 20 ký tự</p>
              </FormItem>
            </div>
            <div className='bw_col_4'>
              <FormItem disabled={disabled} label='Hậu tố'>
                <FormInput
                  disabled={disabled}
                  type='text'
                  field='suffixes'
                  placeholder='VD: HN'
                  validation={{
                    validate: (p) => {
                      if (p?.length > (methods.watch('total_letter') || 20)) {
                        return 'Số lượng ký tự theo quy định';
                      }
                    },
                  }}
                  onChange={(ev) => {
                    const inputValue = ev?.target?.value;
                    if (!inputValue) return setValue('suffixes', null);
                    if (ev?.target?.value.length > 20) {
                      showToast.warning('Nhập tối đa 20 ký tự');
                      return;
                    }
                    if (is_letter && !/^[a-zA-Z]+$/.test(inputValue)) {
                      showToast.warning('Nhập ký tự là chữ');
                      return;
                    }

                    if (is_number && !/^\d+$/.test(inputValue)) {
                      showToast.warning('Nhập ký tự là số');
                      return;
                    }
                    setValue('suffixes', ev?.target?.value);
                  }}
                />
                <p style={{ fontStyle: 'italic' }}>Nhập tối đa 20 ký tự</p>
              </FormItem>
            </div>
          </div>
          <p style={{ fontStyle: 'italic' }}>Mã của bạn sẽ có định dạng KMXXHN (với X là các ký tự ngẫu nhiên)</p>
        </div>
      </BWAccordion>
    </React.Fragment>
  );
}

export default CouponConfig;
