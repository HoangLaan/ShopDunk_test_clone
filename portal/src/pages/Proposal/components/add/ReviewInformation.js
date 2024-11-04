import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import DataTable from 'components/shared/DataTable/index';
import { useMemo, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import ModalReview from '../Modal/ModalReview';

const ReviewInformation = ({ title, disabled, isReview, onRefresh }) => {
  const { control } = useFormContext();
  const { fields } = useFieldArray({
    control,
    name: 'list_review',
  });
  const [idReview, setIdReview] = useState(null);
  const [openModaReview, setOpenModalReview] = useState(false);
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
        accessor: 'proposal_review_level_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Người duyệt',
        accessor: 'review_user',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (item, index) =>
          item.is_auto_review ? (
            <span>Tự động duyệt</span>
          ) : (
            <FormSelect
              disabled={disabled}
              validation={{
                required: 'Người duyệt chọn là bắt buộc',
              }}
              className={'bw_inp'}
              list={mapDataOptions4SelectCustom(item?.list_user, 'review_user', 'full_name')}
              field={`list_review.${index}.review_user`}
            />
          ),
      },
      {
        header: 'Tự động duyệt',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => (
          <label className='bw_checkbox'>
            <FormInput disabled type='checkbox' field={`list_review.${index}.is_auto_review`} />
            <span></span>
          </label>
        ),
      },
      {
        header: 'Mức duyệt cuối',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => (
          <label className='bw_checkbox'>
            <FormInput disabled type='checkbox' field={`list_review.${index}.is_complete`} />
            <span></span>
          </label>
        ),
      },
    ],
    [disabled],
  );

  const handleOpenModal = (p) => {
    setOpenModalReview(true);
    setIdReview(p.proposal_review_list_id);
  };

  const handleCloseModal = (e, isRefresh) => {
    if (isRefresh) {
      onRefresh?.();
    }
    setOpenModalReview(false);
  };
  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-check',
        color: 'green',
        permission: 'HR_PROPOSAL_REVIEW',
        hidden: (p) => p?.is_show_review === 0,
        onClick: (p) => handleOpenModal(p),
      },
    ];
  }, []);
  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <DataTable actions={isReview ? actions : null} columns={columns} data={fields} noSelect noPaging />
      </div>
      <ModalReview id={idReview} open={openModaReview} onClose={handleCloseModal} />
    </BWAccordion>
  );
};

export default ReviewInformation;
