import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Select, Alert, notification } from 'antd';
// Compnents
import BWAccordion from 'components/shared/BWAccordion/index';
// Services
import { upload } from 'services/users.service';
import { getOptionsDocumentType } from 'services/document-type.service';
// Utils
import { mapDataOptions4Select } from 'utils/helpers';
import FormInput from 'components/shared/BWFormControl/FormInput';
import CheckAccess from 'navigation/CheckAccess';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

export default function Document({ title, disabled = true }) {
  const methods = useFormContext();
  const {
    watch,
    register,
    formState: { errors },
    setValue,
  } = methods;
  const [optionsDocumentType, setOptionsDocumentType] = useState([]);
  const [errorUpload, setErrorUpload] = useState(null);
  const statusDocumentList = useMemo(
    () => [
      { value: 1, label: 'Đã đạt yêu cầu' },
      { value: 0, label: 'Chưa đạt yêu cầu' },
    ],
    [],
  );

  useEffect(() => {
    getOptionsDocumentType({is_managed_document: 0})
      .then((options) => setOptionsDocumentType(mapDataOptions4Select(options)))
      .catch((error) => notification.error({ message: window._$g._(error.message) }));
  }, []);

  const handleAddDocument = () => {
    let documents = methods.getValues('documents') ?? [];
    if (documents.length && documents.filter((x) => !x.document_type_id).length) return;
    documents.push({
      document_type_id: '',
      description: '',
      attachment_name: '',
      attachment_path: '',
    });
    methods.setValue('documents', documents);
  };

  const handleUploadFile = (e, idx) => {
    let msg = null;
    const file = e.target.files[0];
    if (!file) {
      msg = 'Vui lòng chọn tập tin để tài lên.';
    }
    if (!file?.name || !file?.name.match(/\.(doc|docx|pdf|xlsx|xls|jpg|png)$/i)) {
      msg = `Tập tin ${file?.name} tải lên không đúng định dạng.`;
    }
    if (!msg) {
      upload(file)
        .then((response) => {
          let documents = watch('documents');
          documents[idx] = { ...documents[idx], ...response };
          methods.setValue('documents', documents);
        })
        .catch((apiData) => {
          let { errors, statusText, message } = apiData;
          msg = [`<b>${statusText || message || ''}</b>`].concat(errors || []).join('.');
        });
    }
    setErrorUpload(msg);
  };

  const documents = useMemo(() => watch('documents') ?? [], [watch('documents')]);
  const checkedIsEnough = useCallback(() => {
    if (optionsDocumentType.length > 0 && documents.length > 0) {
      const documentRequired = optionsDocumentType.filter((item) => item.is_required).map((item) => item.id);
      const documentExpected = documents.filter(
        (item) => documentRequired.includes(item.document_type_id) && item.is_expected === 1,
      );
      if (documents.length >= documentRequired.length && documentExpected.length >= documentRequired.length) {
        setValue('is_enough', 1);
      } else {
        setValue('is_enough', 0);
      }
    }
  }, [documents]);

  return (
    <BWAccordion title={title} id='bw_hs'>
      <div style={{ marginBottom: '5px' }} className='bw_row'>
        <div className='bw_col_10'></div>
        <div className='bw_col_2'>
          <label className='bw_checkbox'>
            <CheckAccess permission={'SYS_USER_ENOUGH'}>
              <FormInput type='checkbox' field='is_enough' />
            </CheckAccess>
            <span />
            Đã đủ hồ sơ
          </label>
        </div>
      </div>

      {errorUpload && <Alert type='error' message={errorUpload} className='bw_mb_2' />}
      {errors['documents'] && <Alert type='error' message={errors['documents']?.message} className='bw_mb_2' />}
      <div className='bw_table_responsive'>
        <table className='bw_table'>
          <thead>
            <tr>
              <th className='bw_text_center'>STT</th>
              <th className='bw_text_center'>Loại hồ sơ</th>
              <th className='bw_text_center'>Tên tập tin</th>
              <th className='bw_text_center'>Ghi chú</th>
              <th className='bw_text_center'>Trạng thái</th>
              {!disabled && <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {documents ? (
              documents.map((doc, i) => (
                <tr key={i}>
                  <td className='bw_sticky bw_check_sticky bw_text_center'>{i + 1}</td>
                  <td>
                    <FormSelect
                      field={`documents.${i}.document_type_id`}
                      list={optionsDocumentType}
                      placeholder='-- Chọn --'
                      disabled={disabled}
                    />
                  </td>
                  <td>
                    {!disabled && (
                      <label className='bw_choose_image_table'>
                        <input onChange={(e) => handleUploadFile(e, i)} type='file' />
                        <span className='fi fi-rr-picture'></span>
                      </label>
                    )}
                    {doc?.attachment_name && (
                      <a target={'_blank'} href={doc?.attachment_path} style={{ marginLeft: 5 }}>
                        <small>{doc.attachment_name}</small>
                      </a>
                    )}
                  </td>
                  <td>
                    <textarea disabled={disabled} className='bw_inp' {...register(`documents.${i}.description`)} />
                  </td>
                  <td>
                    <CheckAccess permission={'MD_DOCUMENTTYPE_STATUS'}>
                      <FormSelect
                        field={`documents.${i}.is_expected`}
                        list={statusDocumentList}
                        onChange={(value) => {
                          setValue(`documents.${i}.is_expected`, value);
                          checkedIsEnough();
                        }}
                      />
                    </CheckAccess>
                  </td>
                  {!disabled && (
                    <td className='bw_sticky bw_action_table bw_text_center'>
                      <a
                        onClick={() => {
                          new Promise((resolve) => {
                            methods.reset({
                              ...methods.getValues(),
                              documents: documents.filter((_, idx) => idx !== i),
                            });
                            resolve(true);
                          }).then(() => checkedIsEnough());
                        }}
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
        <a onClick={handleAddDocument} className='bw_btn_outline bw_btn_outline_success bw_add_us'>
          <span className='fi fi-rr-plus'></span> Thêm hồ sơ
        </a>
      )}
    </BWAccordion>
  );
}
