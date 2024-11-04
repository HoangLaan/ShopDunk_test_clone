import React from 'react';
import { useFormContext } from 'react-hook-form';
import { notification } from 'antd';
import styled from 'styled-components';

import { downloadJdFile } from 'services/position.service';

import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';

const DivFile = styled.div`
  padding: 15px;
  display: inline-flex;
  align-items: center;
  background: var(--grayColor);
  color: var(--mainColor);
  font-weight: 600;
  cursor: pointer;
`;

const PositionJdFile = ({ field, disabled }) => {
  const methods = useFormContext();
  const { watch } = methods;
  const { error } = methods.getFieldState(`${field}.jd_file`, methods.formState);

  const handleChooseFile = (e) => {
    const file = e.target.files?.[0];

    if (!file?.name || !file?.name.match(/\.(doc|docx|pdf|xlsx|xls|jpg|png)$/i)) {
      notification.error({ message: `Tập tin ${file?.name} tải lên không đúng định dạng.` });
      return;
    }

    methods.setValue(`${field}.jd_file`, file);
  };

  const handleRemoveFile = () => {
    methods.setValue(`${field}.jd_file`, '');
  };

  const handleDownloadFile = async () => {
    try {
      await downloadJdFile(methods.watch(`${field}.position_level_id`)).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', watch(`${field}.jd_file`));
        document.body.appendChild(link);
        link.click();
      });
    } catch (error) {
      notification.error({ message: error.message || 'Lỗi tải tập tin.' });
    }
  };

  React.useEffect(() => {
    methods.register(`${field}.jd_file`, { required: 'File JD là bắt buộc.' });
  }, [methods, field]);

  return (
    <React.Fragment>
      <div class='bw_col_12 bw_mt_2 bw_mb_2'>
        <label>
          File JD <span class='bw_red'>*</span>
        </label>
      </div>

      <div className='bw_mt_1 bw_flex bw_align_items_center'>
        {!disabled && !watch(`${field}.jd_file`) && (
          <label className='bw_choose_image_banner'>
            <input
              type='file'
              multiple
              accept='.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              onChange={handleChooseFile}
              onClick={(event) => {
                event.target.value = null; // fix bug: choose same file
              }}
            />
            <span className='fi fi-rr-add'></span>
          </label>
        )}

        {watch(`${field}.jd_file`) && (
          <div className='bw_card_items'>
            {watch(`${field}.jd_file`) instanceof File ? (
              <span>{watch(`${field}.jd_file`).name}</span>
            ) : (
              <DivFile onClick={() => handleDownloadFile()}>
                <span>{watch(`${field}.jd_file`)}</span>
              </DivFile>
            )}
            {!disabled ? (
              <span className='bw_remove_image' onClick={() => handleRemoveFile()}>
                <i className='fi fi-rr-cross-small'></i>
              </span>
            ) : null}
          </div>
        )}
      </div>

      {error && <ErrorMessage message={error?.message} />}
    </React.Fragment>
  );
};

export default PositionJdFile;
