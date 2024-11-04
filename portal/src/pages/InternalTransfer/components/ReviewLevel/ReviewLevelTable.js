import DataTable from 'components/shared/DataTable/index';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getReviewLevelListInternalTransferType, updateReviewLevel } from 'services/internal-transfer.service';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import BWAccordion from 'components/shared/BWAccordion';
import BWButton from 'components/shared/BWButton';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { REVIEW_STATUS } from 'pages/InternalTransfer/helpers/const';
import { useAuth } from 'context/AuthProvider';

const ReviewLevelTable = ({ disabled, title, onRefresh }) => {
  const { setValue, watch, control } = useFormContext();
  const internal_transfer_type_id = watch('internal_transfer_type_id');
  const internal_transfer_id = watch('internal_transfer_id');
  const [reviewLevelList, setReviewLevelList] = useState([]);
  const { user } = useAuth();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'review_level_list',
  });

  useEffect(() => {
    if (reviewLevelList.length > 0) {
      setValue('review_level_list', reviewLevelList);
    }
  }, [reviewLevelList]);

  const handleReview = useCallback(async (payload) => {
    updateReviewLevel(payload)
      .then(() => {
        onRefresh();
        showToast.success('Duyệt thành công');
      })
      .catch(() => showToast.error('Duyệt thất bại'));
  }, []);

  useEffect(() => {
    if (!internal_transfer_type_id) return () => {};
    getReviewLevelListInternalTransferType({ internal_transfer_type_id })
      .then((data) => {
        if (!internal_transfer_id) return data;
        const result = [];
        for (const item of data) {
          for (const rl of watch('review_level_list') ?? []) {
            if (item.user_name_review === rl.user_name_review) {
              result.push({ ...item, ...rl });
            }
          }
        }
        return result;
      })
      .then((data) => setReviewLevelList(data));
  }, [internal_transfer_id, internal_transfer_type_id]);

  const getReviewStatus = useCallback(
    (label, fieldGet = 'value') => REVIEW_STATUS.find((item) => item.label === label)[fieldGet],
    [],
  );

  const PENDING = getReviewStatus('Chờ duyệt');
  const CONFIRMED = getReviewStatus('Đã duyệt');
  const REJECTED = getReviewStatus('Không duyệt');

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_sticky bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (d, index) => index + 1,
      },
      {
        header: 'Người duyệt',
        classNameHeader: 'bw_text_center',
        formatter: (d, index) => `${d.user_name_review} - ${d.full_name_review}`,
      },
      {
        header: 'Phòng ban',
        accessor: 'department_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Vị trí',
        accessor: 'position_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Ghi chú',
        accessor: 'note',
        classNameHeader: 'bw_text_center',
        hidden: !internal_transfer_id,
        formatter: (p, index) => {
          return (
            <FormItem>
              <FormTextArea field={`review_level_list.${index}.note`} placeholder='Nhập ghi chú' />
            </FormItem>
          );
        },
      },
      {
        header: 'Tình trạng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        hidden: !internal_transfer_id,
        formatter: (p, index) => {
          const { review_status, review_level_id, user_name_review: user_review } = p;
          if (review_status === PENDING) {
            // user trước duyệt mới đến user kế tiếp được duyệt
            const isValidIndexReview = index === 0 ? true : watch('review_level_list')[index - 1]?.review_status !== 0;
            const isValidReview =
              user.user_name === p.user_name_review && watch('review_status') !== 3 ? isValidIndexReview : false;
            return (
              <>
                {isValidReview ? (
                  <div style={{ columnGap: 5 }} className='bw_flex bw_justify_content_center'>
                    <BWButton
                      onClick={() => {
                        const note = (watch(`review_level_list.${index}.note`) ?? '')?.trim();
                        if (!note) return showToast.error('Ghi chú duyệt là bắt buộc');
                        handleReview({
                          review_level_id,
                          user_review,
                          note: watch(`review_level_list.${index}.note`),
                          is_review: CONFIRMED,
                        });
                      }}
                      content={'Duyệt'}
                    />
                    <BWButton
                      onClick={() => {
                        const note = (watch(`review_level_list.${index}.note`) ?? '')?.trim();
                        if (!note) return showToast.error('Ghi chú duyệt là bắt buộc');
                        handleReview({
                          review_level_id,
                          user_review,
                          note: watch(`review_level_list.${index}.note`),
                          is_review: REJECTED,
                        });
                      }}
                      content={'Không duyệt'}
                      type={'danger'}
                    />
                  </div>
                ) : (
                  <span className={`bw_label_outline text-center`}>Chờ duyệt</span>
                )}
              </>
            );
          }

          const instanceReview = REVIEW_STATUS.find((item) => item.value === parseInt(review_status));
          if (!instanceReview) return;

          return (
            <span className={`bw_label_outline bw_label_outline_${instanceReview.color} text-center`}>
              {instanceReview.label}
            </span>
          );
        },
      },
    ],
    [internal_transfer_id, disabled, user],
  );

  const actions = useMemo(
    () => [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: 'SL_INTERNALTRANSFER_REVIEWLIST_ADD',
        hidden:
          watch('review_level_list')?.length === reviewLevelList.length ||
          !watch('internal_transfer_type_id') ||
          disabled,
        onClick: () => {
          for (const item of fields) {
            if (Object.values(item).some((value) => !value && value !== 0)) {
              return showToast.error('Vui lòng nhập đầy đủ thông tin, trước khi thêm dòng mới !');
            }
          }
          append(
            reviewLevelList?.find((item) => !fields.map((rl) => rl.user_name_review).includes(item.user_name_review)),
          );
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        hidden: disabled,
        permission: 'SL_INTERNALTRANSFER_REVIEWLIST_DEL',
        onClick: (_, index) => remove(index),
      },
    ],
    [fields, reviewLevelList, disabled],
  );

  return (
    <>
      <BWAccordion title={title} isRequired>
        <DataTable noSelect={true} noPaging={true} columns={columns} actions={actions} data={fields} />
      </BWAccordion>
    </>
  );
};

export default ReviewLevelTable;
