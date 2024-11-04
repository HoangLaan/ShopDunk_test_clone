import React, {useEffect, useState} from 'react';
import {useFormContext} from 'react-hook-form';
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
  i.mr-2{
    margin-right: 10px;
  }
`;

const RegimeAttachment = ({disabled, title}) => {
  const methods = useFormContext();
  const {
    watch,
    setValue,
    setError,
    formState: {errors},
  } = methods;

  const [dataFile, setDataFile] = useState([]);

  function splitStringNew(str, n, useWordBoundary = true) {
    if (str.length <= n) {
      return str;
    } else {
      const subString = str.substr(0, n - 1);
      return subString + '...';
    }
  }

  const handleSelectFileUpload = (e) => {
    const target = e.target || e.srcElement;
    let attached_files = watch('attached_files') || [];

    if (target.value.length > 0) {
      const data_file = [...dataFile];
      const file_upload = [...attached_files];
      for (let i = 0; i < e.target.files.length; i++) {
        data_file.push({
          file: e.target.files[i],
          attachment_name: e.target.files[i].name,
        });
        file_upload.push(e.target.files[i]);
      }

      setDataFile(data_file);
      setValue('attached_files', file_upload);
      e.target.value = null;
    }
  };

  const handleDeleteFile = (index, item) => {
    let save_fileattachment = watch('save_fileattachment') || [];
    let attached_files = watch('attached_files') || [];

    const save_att_file = [...save_fileattachment];
    const att_file = [...attached_files];
    const data_file = [...dataFile];
    data_file.splice(index, 1);
    setDataFile(data_file);
    att_file.splice(index, 1);
    setValue('attached_files', att_file);
    if (save_att_file.length > 0) {
      const index_att = save_att_file.findIndex((item_att) => item_att.attachment_id == item.attachment_id);
      save_att_file.splice(index_att, 1);
      setValue('save_fileattachment', save_att_file);
    }
  };


  return (
    <BWAccordion title={title} id='bw_info' isRequired={true}>
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
            <label htmlFor='actual-btn_file' className='mail_file'>
              <i className='fa fa-paperclip 'style={{marginRight:'10px'}}/>
              File đính kèm
            </label>
          </div>

        )}

        <div className='bw_col_12 bw_mb_2'>
          <div
            style={{
              marginTop: 4,
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {dataFile.map((item, index) => {
              return (
                <FileAttachStyle key={index + ''}>
                  <div className='content-attach'>
                    <i className='fa fa-file' aria-hidden='true'></i>
                    <div className='file_name'>
                      <span>{splitStringNew(item.attachment_name, 20)}</span>
                    </div>
                    <i
                      onClick={() => handleDeleteFile(index, item)}
                      className='fa fa-trash trash_attchment'
                      aria-hidden='true'></i>
                  </div>
                </FileAttachStyle>
              );
            })}
          </div>
        </div>

      </div>
      {errors['attached_files'] && <ErrorMessage message={errors['attached_files']?.message}/>}
    </BWAccordion>
  );
};

export default RegimeAttachment;
