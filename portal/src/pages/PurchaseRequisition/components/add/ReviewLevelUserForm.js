import React, { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

const ReviewLevelUserForm = ({ disabled, loading, title }) => {
  const methods = useFormContext();
  const { setValue, watch } = methods;

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Tên mức duyệt',
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => {
          return (
            <FormInput
              className={'bw_inp bw_mw_2'}
              style={{
                maxWidth: '100%',
              }}
              disabled={true}
              type='text'
              field={`review_level_user_list.${index}.review_level_name`}
              validation={{
                required: 'Tên mức duyệt là bắt buộc',
              }}
            />
          );
        },
      },
      {
        header: 'Người duyệt',
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => {
          return (
            <FormSelect
              bordered
              disabled={true}
              type='text'
              field={`review_level_user_list.${index}.full_name`}
              list={methods.watch(`review_level_user_list.${index}.list_review`)}
            />
          );
        },
      },
      {
        header: 'Mức duyệt cuối',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => {
          return (
            <label className='bw_checkbox' style={{ margin: 0 }}>
              <FormInput
                className={'bw_checkbox'}
                disabled={true}
                type='checkbox'
                field={`review_level_user_list.${index}.is_complete`}
                onChange={(e) => {
                  setValue(
                    `review_level_user_list`,
                    [...watch('review_level_user_list')].map((o) => {
                      return { ...o, is_complete: 0 };
                    }),
                  );
                  setValue(`review_level_user_list.${index}.is_complete`, 1);
                }}
              />
              <span></span>
            </label>
          );
        },
      },
      // {
      //   header: 'Tự động duyệt',
      //   classNameHeader: 'bw_text_center',
      //   classNameBody: 'bw_text_center',
      //   formatter: (_, index) => {
      //     return (
      //       <label className='bw_checkbox' style={{ margin: 0 }}>
      //         <FormInput
      //           className={'bw_checkbox'}
      //           disabled={true}
      //           type='checkbox'
      //           field={`review_level_user_list.${index}.is_auto_review`}
      //           onChange={(e) => {
      //             methods.clearErrors(`review_level_user_list.${index}.is_auto_review`);
      //             methods.clearErrors(`review_level_user_list.${index}.user_review`);
      //             methods.setValue(`review_level_user_list.${index}.is_auto_review`, e.target.checked ? 1 : 0);
      //           }}
      //         />
      //         <span></span>
      //       </label>
      //     );
      //   },
      // },
    ],
    [disabled, setValue, watch, methods],
  );

  const review_level_user_list = useMemo(() => {
    return methods.watch('review_level_user_list');
  }, [methods]);

  useEffect(() => { }, []);

  return (
    <BWAccordion title={title}>
      <DataTable
        style={{
          marginTop: '0px',
        }}
        hiddenActionRow
        noPaging
        noSelect
        data={review_level_user_list}
        columns={columns}
        loading={loading}
      />
    </BWAccordion>
  );
};

export default ReviewLevelUserForm;
