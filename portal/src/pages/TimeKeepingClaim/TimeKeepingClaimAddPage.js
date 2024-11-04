import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm,  } from 'react-hook-form';
import { createTimeKeepingClaim, getDetailTimeKeepingClaim, updateTimeKeepingClaim, updateReview } from 'services/time-keeping-claim.service';
import { useLocation, useParams } from 'react-router-dom';
import FormSection from 'components/shared/FormSection';
import TimeKeepingClaimInformation from './components/TimeKeepingClaimInformation';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import { showToast } from 'utils/helpers';
import ReviewLevelTable from './components/ReviewLevel/ReviewLevelTable';
import ModalReview from './components/ReviewLevel/ModalReview';
import { useAuth } from 'context/AuthProvider';
import { updateTimeKeeping } from 'pages/TimeKeeping/helpers/call-api';
import { getDetailTimeKeepingClaimType } from 'services/time-keeping-claim-type.service';

const TimeKeepingClaimAddPage = (props) => {
  const defaultValues = useMemo(() => ({
    is_active: 1,
    is_system: 0,
  }), [])
  const methods = useForm({defaultValues});
  const {setValue, watch, reset, getValues} = methods;
  const { pathname } = useLocation();
  const { id } = useParams();

  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const isAdd = useMemo(() => pathname.includes('/add'), [pathname]);
  const [isShowModalReview, setIsShowModalReview] = useState(false);
  const [indexReviewLevel, setIndexReviewLevel] = useState(0);
  const {user} = useAuth();

  const onSubmit = async (payload) => {
    const label = id ? 'Chỉnh sửa' : 'Thêm mới';
    try {
      await (id ? updateTimeKeepingClaim(payload) : createTimeKeepingClaim(payload));
      if(!id) methods.reset(defaultValues);
      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error.message ?? `${label} thất bại`);
    }
  };
  const loadTimeKeepingClaimDetailById = useCallback(() => {
    if (id) {
      getDetailTimeKeepingClaim(id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } 
  }, [id]);
  useEffect((intdex, payload) => {
    loadTimeKeepingClaimDetailById();
  }, [loadTimeKeepingClaimDetailById]);

  const detailForm = [
    {
      title: 'Thông tin giải trình',
      id: 'information',
      disabled,
      component: TimeKeepingClaimInformation,
      fieldActive: ['time_keeping_claim_name'],
    },
    {
      title: 'Mức duyệt',
      id: 'information',
      disabled,
      component: ReviewLevelTable,
      fieldActive: ['time_keeping_claim_name'],
      setIsShowModalReview,
      setIndexReviewLevel,
    },
    { id: 'status', title: 'Trạng thái', component: (props) => FormStatus({...props, hiddenSystem: true})},
  ];
  const [indexUserReviewed ,setIndexUserReviewed]= useState(null);
  const pending = 1;

  const is_reviewed = indexUserReviewed === null ? 
  watch('review_levels_of_time_keeping_claim')?.find(u => String(u.reviewed_username) === user.user_name)?.is_reviewed === 1 : 
  watch('review_levels_of_time_keeping_claim')?.find(u => String(u.reviewed_username) === user.user_name)?.is_reviewed === 0
  //cal popup duyet => cần gọi service để update trạng thái duyệt.
  const onSubmitReview = useCallback(async (payload) => {
    try {
      //const indexUserCurrentReviewed = watch('review_levels_of_time_keeping_claim')?.findIndex(u => String(u.reviewed_username) === user.user_name);
      setIndexUserReviewed(indexReviewLevel);
      // if(indexUserCurrentReviewed > -1){
        try {
            // Update lại chỗ nút duyệt ở table
            await (updateReview({
              time_keeping_claim_review_level_id: watch(`review_levels_of_time_keeping_claim.${indexReviewLevel}.time_keeping_claim_review_level_id`),
              time_keeping_claim_id: watch('time_keeping_claim_id'),
              ...payload
            }));
            
            const resDetailTimeKeepingDetail = await getDetailTimeKeepingClaim(id)
            methods.reset({
              ...resDetailTimeKeepingDetail,
            });
            
            //Update confirm date
            if (resDetailTimeKeepingDetail?.review_levels_of_time_keeping_claim?.every(item => item.is_reviewed === 1)) {
              const value = methods.getValues();
              let dataSubmit = {
                  shift_date: value?.shift_date,
                  shift_id: value?.shift_id,
                  user_name: value?.user_name,
                  time_keeping_id: value?.time_keeping_id,
                  is_over_time: value?.is_over_time,
                  shift_name: value?.shift_name,
              };

              if (value?.is_late === 0 || value?.is_late === 2) {
                dataSubmit.time_start = value?.time_keeping_start
                dataSubmit.time_end = value?.time_end
              } else if (value?.is_late === 1) {
                dataSubmit.time_start = value?.time_start
                dataSubmit.time_end = value?.time_keeping_end === '--:--' ? '' :  value?.time_keeping_end
              } else if (value?.is_late === 3) {
                dataSubmit.time_start = value?.time_start
                dataSubmit.time_end = value?.time_end
              }

              const response = await updateTimeKeeping(dataSubmit);

              if (response) {
                if(value?.is_late === 0 || value?.is_late === 2) {
                  setValue('confirm_time_start', value?.time_keeping_start)
                  setValue('confirm_time_end', value?.time_end)
                } else if (value?.is_late === 1) {
                  setValue('confirm_time_start', value?.time_start)
                  setValue('confirm_time_end', value?.time_keeping_end)
                } else if (value?.is_late === 3) {
                  setValue('confirm_time_start', value?.time_start)
                  setValue('confirm_time_end', value?.time_end)
                }
              }

            }
            //Reset data review_levels in table 
            getDetailTimeKeepingClaimType(watch('time_keeping_claim_type_id')).then(data => {
              setValue('review_levels', data.review_levels?.map(d => {
                const reviewLevelPrev = watch('review_levels_of_time_keeping_claim')?.find(rl => rl.review_level_id === d.review_level_id);
                if(reviewLevelPrev) return {...reviewLevelPrev, ...d}
                return d
              }))
            })
            setValue(`review_levels.${indexReviewLevel}.is_reviewed`, payload.is_reviewed)
            setValue(`review_levels.${indexReviewLevel}.note`, payload.note)
            setValue(`review_levels.${indexReviewLevel}.reviewed_username`, user.user_name || '');
            setValue(`review_levels.${indexReviewLevel}.full_name`, user.full_name || '');

            if(!id) methods.reset(defaultValues);
            showToast.success('Duyệt thành công');
          } catch (error) {
            showToast.error(error.message ?? `Cập nhật duyệt thất bại`);
          }
        // }
      setIsShowModalReview(false);
    } catch (error) {
      showToast.error(error.message ?? `Cập nhật duyệt thất bại`);
    }
  }, [indexReviewLevel]);

  const actions = useMemo(() => [
    {
      className: 'bw_btn bw_btn_success',
      icon: 'fi fi-rr-check',
      content: 'Duyệt',
      hidden: true,
      onClick: () => setIsShowModalReview(true),
    },
    {
      globalAction: true,
      className: 'bw_btn bw_btn_success',
      icon: 'fi fi-rr-check',
      type: 'success',
      content: disabled ? 'Chỉnh sửa' : (id ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới'),
      onClick: () => {
        if (disabled) return window._$g.rdr(`/time-keeping-claim/edit/${id}`);
        
        methods.handleSubmit(onSubmit)();
      },
    },
  ], [is_reviewed, indexUserReviewed]) 

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <FormSection actions={actions} disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
      </FormProvider>

      {isShowModalReview && (
          <ModalReview onSubmit={onSubmitReview} onClose={() => setIsShowModalReview(false)} isShowModalReview={isShowModalReview} />
        )}
    </React.Fragment>
  );
};

export default TimeKeepingClaimAddPage;
