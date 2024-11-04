import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable/index';
import { getUserReview } from 'services/request-purchase-order.service';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { PERMISSION } from '../../helpers/constants';

const ReviewLevelTable = ({ disabled, loading, title, isEdit }) => {
  const methods = useFormContext();
  const { setValue, watch, unregister } = methods;
  const departmentOptions = useGetOptions(optionType.department);

  const getUserOptions = useCallback((department_id, index) => {
    getUserReview({ department_id }).then((res) => {
      setValue(`review_level.${index}.user_review_list`, mapDataOptions4SelectCustom(res, 'user_name', 'full_name'));
    });
  }, []);

  useEffect(() => {
    if (isEdit) {
      const reviewLevel = watch(`review_level`);
      for (const index in reviewLevel) {
        getUserOptions(reviewLevel[index].department_id, index);
      }
    }
  }, [watch(`review_level`)]);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Phòng ban',
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => {
          return (
            <FormSelect
              field={`review_level.${index}.department_id`}
              list={departmentOptions}
              onChange={(e) => {
                getUserOptions(e, index);
                setValue(`review_level.${index}.department_id`, e);
                setValue(`review_level.${index}.user_name`, null);
              }}
              validation={{
                required: 'Phòng ban là bắt buộc',
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
              disabled={watch(`review_level.${index}.is_auto_review`)}
              field={`review_level.${index}.user_name`}
              list={watch(`review_level.${index}.user_review_list`)}
            />
          );
        },
      },
      // {
      //   header: 'Mức duyệt cuối',
      //   classNameHeader: 'bw_text_center',
      //   classNameBody: 'bw_text_center',
      //   formatter: (_, index) => {
      //     return (
      //       <label className='bw_checkbox' style={{ margin: 0 }}>
      //         <FormInput
      //           className={'bw_checkbox'}
      //           disabled={disabled || watch(`review_level.${index}.is_auto_review`)}
      //           type='checkbox'
      //           field={`review_level.${index}.is_complete`}
      //         />
      //         <span></span>
      //       </label>
      //     );
      //   },
      // },
      // {
      //   header: 'Tự động duyệt',
      //   classNameHeader: 'bw_text_center',
      //   classNameBody: 'bw_text_center',
      //   formatter: (_, index) => {
      //     return (
      //       <label className='bw_checkbox' style={{ margin: 0 }}>
      //         <FormInput
      //           className={'bw_checkbox'}
      //           disabled={disabled || watch(`review_level.${index}.is_complete`) }
      //           type='checkbox'
      //           field={`review_level.${index}.is_auto_review`}
      //         />
      //         <span></span>
      //       </label>
      //     );
      //   },
      // },
    ],
    [disabled, departmentOptions],
  );

  const actions = useMemo(
    () => [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mức duyệt',
        permission: PERMISSION.ADD_REVIEW,
        hidden: disabled,
        onClick: () => {
          setValue(`review_level`, [...(watch(`review_level`) ?? []), {}]);
        },
      },
      {
        hidden: disabled,
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: PERMISSION.DEL_REVIEW,
        onClick: (d, index) => {
          unregister(`review_level.${index}`);
          setValue(
            'review_level',
            watch('review_level')?.filter((item, i) => i !== index),
          );
        },
      },
    ],
    [],
  );

  return (
    <BWAccordion title={title}>
      <DataTable
        actions={actions}
        hiddenActionRow
        noPaging
        noSelect
        data={watch(`review_level`)}
        columns={columns}
        loading={loading}
      />
    </BWAccordion>
  );
};

export default ReviewLevelTable;
