import React, { useState, useMemo } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, Progress } from 'antd';
import { showToast } from 'utils/helpers';
import { uploadReceiveSlipFile as UploadFile } from 'services/receive-slip.service';
import { onUploadProgress } from 'pages/InstallmentPartner/utils/helper';
import DocumentItem from '../Shared/Document';

const ContractInfo = ({ disabled, title, id }) => {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { control, setValue, getValues } = methods;

  const { remove, append } = useFieldArray({
    control,
    name: 'document_list',
  });

  const uploadImage = async ({ file, onSuccess, onError }, field) => {
    try {
      const response = await UploadFile(file, (event) => {
        onUploadProgress(event, (progress) => {
          setValue(field, { ...getValues(field), progress });
        });
      });
      const document = {
        attachment_name: response.attachment_name,
        attachment_url: response.attachment_path,
      };
      const currentValue = getValues(field) ?? {};
      setValue(field, Object.assign(currentValue, document));
      onSuccess('ok');
    } catch (err) {
      onError(err);
      showToast.error('Có lỗi xảy ra !');
    }
  };

  const columns = [
    {
      header: 'STT',
      formatter: (_, index) => index + 1,
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Tên giấy tờ',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      formatter: (item, index) => {
        return (
          <FormInput
            bordred
            className='bw_inp'
            type='text'
            disabled={disabled}
            placeholder='Nhập tên giấy tờ'
            field={`document_list.${index}.document_name`}
            validation={{
              required: 'Tên giấy tờ là bắt buộc',
            }}
          />
        );
      },
    },
    {
      header: 'Tệp tin',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'parent_name',
      formatter: (item, index) => {
        const field = `document_list.${index}`;
        const document = methods.watch(field);
        const isHaveDocument = document && document.attachment_url;

        return (
          <div>
            <Upload
              disabled={disabled}
              customRequest={(payload) => {
                uploadImage(payload, field);
              }}
              multiple={false}
              fileList={[]}>
              {isHaveDocument ? null : <Button icon={<UploadOutlined />}>Tải lên</Button>}
            </Upload>
            {methods.watch(field)?.progress > 0 ? <Progress percent={methods.watch(field)?.progress} /> : null}
            {isHaveDocument ? (
              <DocumentItem
                disabled={disabled}
                document={document}
                handleRemoveFile={() => {
                  document.attachment_name = null;
                  document.attachment_url = null;
                  setValue(field, document);
                }}
              />
            ) : null}
          </div>
        );
      },
    },
  ];

  const actions = useMemo(
    () => [
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm dòng',
        permission: 'SL_INSTALLMENTPARTNER_ADD',
        onClick: () => {
          append({
            document_name: '',
            attachment_name: '',
            attachment_url: '',
          });
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        disabled: disabled,
        permission: 'SL_INSTALLMENTPARTNER_ADD',
        onClick: (_, index) => {
          if (!disabled) {
            dispatch(
              showConfirmModal(
                ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
                async () => {
                  remove(index);
                },
              ),
            );
          }
        },
      },
    ],
    [],
  );

  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div class='bw_col_12'>
          <DataTable
            noSelect
            noPaging
            actions={actions}
            columns={columns}
            data={methods.watch('document_list') || []}
          />
        </div>
      </div>
    </BWAccordion>
  );
};

export default ContractInfo;
