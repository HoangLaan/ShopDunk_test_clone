import { getOptionsGlobal } from 'actions/global';
import BWAccordion from 'components/shared/BWAccordion/index';
import BWButton from 'components/shared/BWButton/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import DataTable from 'components/shared/DataTable/index';
import { useEffect, useMemo, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { mapDataOptions } from 'utils/helpers';
import ConfirmReviewModal from './Modal/ConfirmReviewModal';
const BrowsingInformation = ({ disabled, isReview }) => {
  const dispatch = useDispatch();
  const { control } = useFormContext();
  const { userData } = useSelector((state) => state.global);
  const [openModalReview, setOpenModalReview] = useState(false);
  const [item, setItem] = useState({});

  const { fields } = useFieldArray({
    control,
    name: 'list_review',
  });
  console.log(fields);
  useEffect(() => {
    if (!userData) dispatch(getOptionsGlobal('user'));
  }, [dispatch, userData]);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        formatter: (item, index) => index + 1,
      },
      {
        header: 'Tên mức duyệt',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        formatter: (item, index) =>
          fields?.[0]?.isLevelOut ? (
            <FormInput
              validation={{
                required: 'Tên mức duyệt nhập là bắt buộc',
              }}
              className={'bw_inp'}
              field={`list_review.${index}.budget_review_list_name`}></FormInput>
          ) : (
            <span>{item.budget_review_list_name}</span>
          ),
      },
      {
        header: 'Tự động duyệt',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        hidden: fields?.[0]?.isLevelOut ? true : false,
        formatter: (_, index) => (
          <FormInput disabled type='checkbox' field={`list_review.${index}.is_auto_review`}></FormInput>
        ),
      },
      {
        header: 'Người duyệt',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        formatter: (item, index) =>
          item.is_auto_review ? (
            <span>Tự động duyệt</span>
          ) : (
            <FormSelect
              validation={{ required: 'Người duyệt chọn là bắt buộc' }}
              list={
                item?.isLevelOut
                  ? mapDataOptions(userData, {
                      valueName: 'id',
                      labelName: 'name',
                      valueAsString: true,
                    })
                  : mapDataOptions(item?.users, {
                      valueName: 'user_review',
                      labelName: 'full_name',
                      valueAsString: true,
                    })
              }
              field={`list_review.${index}.review_user`}></FormSelect>
          ),
      },
      {
        header: 'Nội dung',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        formatter: (item) => item.review_note || 'Chưa có nội dung',
      },
      {
        header: 'Trạng thái',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        formatter: (item, index) => renderStatus(item),
      },
      {
        header: 'Mức duyệt cuối',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        hidden: fields?.[0]?.isLevelOut ? true : false,
        formatter: (item, index) => (
          <FormInput disabled type='checkbox' field={`list_review.${index}.is_complete`}></FormInput>
        ),
      },
    ],
    [userData, fields],
  );

  const renderStatus = (item) => {
    switch (item.is_review) {
      case 1:
        return 'Đồng ý duyệt';
      case 0:
        return 'Không đồng ý';
      default:
        return (
          <BWButton
            disabled={!isReview || !item.is_show_review}
            content={item.is_show_review ? 'Duyệt' : 'Chờ duyệt'}
            type={'success'}
            onClick={() => {
              setOpenModalReview(true);
              setItem(item);
            }}></BWButton>
        );
    }
  };

  // const actions = useMemo(
  //   () => [
  //     {
  //       icon: 'fi fi-rr-trash',
  //       color: 'red',
  //       hidden: disabled,
  //       onClick: (item, index) => {
  //         remove(index);
  //       },
  //     },
  //   ],
  //   [],
  // );
  return (
    <BWAccordion title='Thông tin duyệt'>
      <DataTable data={fields} columns={columns} noSelect noPaging></DataTable>
      <ConfirmReviewModal
        open={openModalReview}
        item={item}
        onClose={() => setOpenModalReview(false)}></ConfirmReviewModal>
    </BWAccordion>
  );
};
export default BrowsingInformation;
