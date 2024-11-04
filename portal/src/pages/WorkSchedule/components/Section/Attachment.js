import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import BWAccordion from 'components/shared/BWAccordion/index';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';

const FileAttachStyle = styled.div`
  margin-top: 4px;
  display: flex;
  flex-flow: row wrap;

  .content-attach {
    align-items: center;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 3px 3px 6px #888;
    display: flex;
    flex-direction: row;
    padding: 4px 8px;
    margin-right: 10px;
  }
  i.mr-2 {
    margin-right: 10px;
  }
`;

const RegimeAttachment = ({ disabled, title }) => {
  const methods = useFormContext();
  const {
    setValue,
    getValues,
    formState: { errors },
  } = methods;

  const handleSelectFileUpload = (e) => {
    const fileList = Array.from(e.target.files ?? []);
    let attached_files = getValues('attached_files') || [];
    const newFileList = fileList.map((file) => ({
      file: file,
      attachment_name: file.name,
    }));
    setValue('attached_files', attached_files.concat(newFileList));
  };

  const handleDeleteFile = (index) => {
    let attachmentList = getValues('attached_files') || [];
    attachmentList.splice(index, 1);
    setValue('attached_files', attachmentList);
  };

  const handleViewFile = (url) => {
    window.open(url, '_blank').focus();
  };

  return (
    <BWAccordion title={title} id='bw_info'>
      <div class='bw_mt_1 bw_flex bw_align_items_center'>
        {!disabled && (
          <div className='bw_col_12 bw_mb_2'>
            <input
              multiple={true}
              onChange={(e) => handleSelectFileUpload(e)}
              id='actual-btn_file'
              accept='.png,.jpg,.jpeg,.pdf,.xls,.xlsx,.doc,.docx'
              type='file'
              hidden></input>
            <label htmlFor='actual-btn_file' className='mail_file' style={{ cursor: 'pointer' }}>
              <i className='fa fa-paperclip ' style={{ marginRight: '10px' }} />
              Tải tệp lên
            </label>
          </div>
        )}

        <div className='bw_col_12 bw_mb_2'>
          <div>
            {getValues('attached_files')?.map((item, index) => {
              return (
                <FileAttachStyle key={index + ''} style={{ marginBottom: '6px' }}>
                  <div className='content-attach'>
                    <i className='fa fa-file' aria-hidden='true'></i>
                    <div className='file_name' style={{ margin: '0px 6px' }}>
                      <span>{item?.attachment_name}</span>
                    </div>
                    <i
                      onClick={() => handleDeleteFile(index)}
                      className='fa fa-trash trash_attchment'
                      aria-hidden='true'></i>
                    <i
                      onClick={() => handleViewFile(item?.attachment_path)}
                      className='fa fa-eye trash_attchment'
                      style={{ paddingLeft: '7px' }}
                      aria-hidden='true'></i>
                  </div>
                </FileAttachStyle>
              );
            })}
          </div>
        </div>
      </div>
      {errors['attached_files'] && <ErrorMessage message={errors['attached_files']?.message} />}
    </BWAccordion>
  );
};

export default RegimeAttachment;
