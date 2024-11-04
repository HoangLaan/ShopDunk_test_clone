import React from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { notification } from 'antd';

import BWAccordion from 'components/shared/BWAccordion/index';
import { downloadAttachment } from 'services/contract.service';

const DivFile = styled.div`
  padding: 15px;
  display: inline-flex;
  // align-items: center;
  background: var(--grayColor);
  color: var(--mainColor);
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
`;

const ContractAttachment = ({ disabled }) => {
  const methods = useFormContext();
  const { watch } = methods;

  const uploadFile = (e) => {
    const files = e.target.files;

    if (files[0].name.match(/\.(jpg|png)$/i)) {
      // URL.createObjectURL(files[0]);

      methods.setValue('attachment', files[0]);
    }
  };

  const handleRemoveFile = (idx) => {
    methods.setValue('attachment', null);
    methods.setValue('attachment_name', null);
  };

  const handleDownloadFile = async () => {
    try {
      await downloadAttachment(methods.watch('contract_id')).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', methods.watch('attachment_name'));
        document.body.appendChild(link);
        link.click();
      });
    } catch (error) {
      notification.error({ message: error.message || 'Lỗi tải tập tin.' });
    }
  };

  return (
    <BWAccordion title='Tập tin đính kèm' id='bw_hs'>
      <div className='bw_mt_1 bw_flex bw_align_items_center'>
        {!(disabled || methods.watch('attachment') || methods.watch('attachment_name')) && (
          <label className='bw_choose_image_banner'>
            <input
              type='file'
              accept='.pdf, image/*, .csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-word, application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              onChange={uploadFile}
            />
            <span className='fi fi-rr-add'></span>
          </label>
        )}

        {(watch('attachment') || methods.watch('attachment_name')) && (
          <div className='bw_card_items'>
            {watch('attachment') instanceof File ? (
              <DivFile>
                <span>{watch('attachment').name}</span>
              </DivFile>
            ) : (
              <DivFile onClick={() => handleDownloadFile()}>
                <span>{watch('attachment_name')}</span>
              </DivFile>
            )}
            {!disabled ? (
              <span className='bw_remove_image' onClick={() => handleRemoveFile()} style={{ cursor: 'pointer' }}>
                <i className='fi fi-rr-cross-small' z></i>
              </span>
            ) : null}
          </div>
        )}
      </div>
    </BWAccordion>
  );
};

export default ContractAttachment;
