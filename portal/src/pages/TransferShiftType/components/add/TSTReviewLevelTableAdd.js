import DataTable from 'components/shared/DataTable/index';
import React, { useEffect, useMemo, useState } from 'react';
import { getUserOptions } from 'services/transfer-shift-type.service';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useFormContext } from 'react-hook-form';
import FormInput from 'components/shared/BWFormControl/FormInput';
import ReviewLevelModal from './modal/ReviewLevelModal';
import { mapDataOptions4Select } from 'utils/helpers';

const TransferShiftTypeTableAdd = ({ loading, disabled }) => {
  const [isOpenReviewLevelModal, setIsOpenReviewLevelModal] = useState(false);

  const [userOptions, setUserOptions] = useState([]);
  const { setValue, watch, unregister, resetField } = useFormContext();

  const listReviewLevelAdd = useMemo(() => {
    const listReviewLevel = watch('review_levels') ?? [];
    return listReviewLevel.map((item) => ({ ...item, user_review: userOptions }));
  }, [watch('review_levels'), userOptions]);

  useEffect(() => {
    getUserOptions().then(({ items: user }) => setUserOptions(mapDataOptions4Select(user, 'id', 'name')));
  }, []);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_sticky bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (d, index) => index + 1,
      },
      {
        header: 'Tên mức duyệt',
        accessor: 'transfer_shift_review_level_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Tự động duyệt',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (d, index) => {
          return (
            <FormInput
              disabled={disabled || watch(`review_levels.${index}.is_complete`)}
              type='checkbox'
              field={`review_levels.${index}.is_auto_review`}
            />
          );
        },
      },
      {
        header: 'Phòng ban',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
        formatter: (d, index) => {
          return d.departments?.map((de) => {
            return <p>{de.name}</p>;
          });
        },
      },
      {
        header: 'Người duyệt',
        style: { minWidth: '12.5em' },
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (d, index) => {
          return (
            <FormSelect
              disabled={disabled || watch(`review_levels.${index}.is_auto_review`)}
              allowClear={true}
              field={`review_levels.${index}.user_name`}
              list={d.user_review}
              validation={{
                required: 'Người duyệt là bắt buộc',
              }}
            />
          );
        },
      },

      {
        header: 'Mức duyệt cuối',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (d, index) => {
          return (
            <FormInput
              disabled={disabled || watch(`review_levels.${index}.is_auto_review`)}
              type='checkbox'
              field={`review_levels.${index}.is_complete`}
            />
          );
        },
      },
    ],
    [disabled],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới mức duyệt',
        permission: 'HR_TRANSFERSHIFT_TYPE_ADD',
        onClick: () => setIsOpenReviewLevelModal(true),
      },
      {
        hidden: disabled,
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'HR_TRANSFERSHIFT_TYPE_DEL',
        onClick: (d, i) => {
          unregister(`review_levels.${i}.user_name`);
          setValue(
            'review_levels',
            watch('review_levels').filter((i) => i.transfer_shift_review_level_id !== d.transfer_shift_review_level_id),
          );
        },
      },
    ];
  }, [disabled]);

  return (
    <>
      <DataTable
        actions={actions}
        noSelect={true}
        noPaging={true}
        loading={loading}
        columns={columns}
        data={listReviewLevelAdd}
      />

      {isOpenReviewLevelModal && (
        <ReviewLevelModal
          open={isOpenReviewLevelModal}
          onClose={() => {
            setIsOpenReviewLevelModal(false);
            setValue('departments', []);
          }}
          onApply={(d) => setValue('review_levels', d)}
          defaultDataSelect={[]}
        />
      )}
    </>
  );
};

export default TransferShiftTypeTableAdd;
