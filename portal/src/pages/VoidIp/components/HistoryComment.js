import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import BWAccordion from 'components/shared/BWAccordion/index';
import { createCareComment,  getCareProductList, getProductOptions } from 'services/task.service';
import { defaultPaging, showToast, getBase64 } from 'utils/helpers';
import BWImage from 'components/shared/BWImage/index';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import styled from 'styled-components';
import { useTaskContext } from 'pages/Task/utils/context';
import CommentTable from './Modal/CommentTable';


const RemoveImageSpan = styled.span`
  .fi::before {
    display: flex;
  }
`;

function HistoryComments({ setLoading, taskDetailId, dataLeadsId, memberId, currWFlow, loadData }) {
  const methods = useForm();
  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 7,
  });
  const [dataList, setDataList] = useState(defaultPaging);
  const { refreshCustomerCare } = useTaskContext();
  const { items, page, totalPages, totalItems, itemsPerPage } = dataList;
  const {
    watch,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = methods;

  //fetch user options
  const fetchProductOptions = useCallback((search) => getProductOptions({ search }), []);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);

      payload.task_detail_id = taskDetailId;
      payload.data_leads_id = dataLeadsId;
      payload.member_id = memberId;
      payload.workflow_id = currWFlow;

      // handle submit
      const res = await createCareComment(payload);

      if (res?.data?.dataResponse) {
        loadData()
        refreshCustomerCare()
      }

      methods.reset({});
      loadDataComment();

      showToast.success('Thêm mới thành công');
    } catch (error) {
      showToast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDataComment = useCallback(() => {
    if (taskDetailId && (dataLeadsId || memberId) && currWFlow) {
      setLoading(true);

      params.task_detail_id = taskDetailId;
      params.member_id = memberId;
      params.data_leads_id = dataLeadsId;
      params.workflow_id = currWFlow;

      getCareProductList(params)
        .then(setDataList)
        .catch((error) => showToast.error(error?.message))
        .finally(() => setLoading(false));
    } else {
      setDataList([]);
    }
  }, [taskDetailId, memberId, dataLeadsId, currWFlow, params, setDataList, setLoading]);


  const handleChangeImages = async (e) => {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const { size, name } = files[i];

      if (size / 1000 > 500) {
        setError('images', { type: 'custom', message: `Dung lượng ảnh vượt quá 500kb ()${name}` });
        return;
      }

      clearErrors('images');
      const base64 = await getBase64(files[i]);
      setValue('images', [...(Array.isArray(watch('images')) ? watch('images') : []), base64]);
    }
  };

  useEffect(loadDataComment, [loadDataComment]);

  return (
    <React.Fragment>
      <CommentTable items={items} page={page} totalPages={totalPages} setParams={setParams} totalItems={totalItems} params={params} itemsPerPage={itemsPerPage}/>
      {/* <BWAccordion
        title='Comments'
        componentCustom={}> */}
        {/* <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <FormItem className='bw_col_12' label='Nội dung tin nhắn'>
              <FormTextArea
                field='content_comment'
                rows={3}
                placeholder='Nội dung tin nhắn là bắt buộc'
                validation={{
                  required: 'Nội dung comment là bắt buộc',
                }}
              />
            </FormItem>
            <FormItem className='bw_col_12' label='Sản phẩm quan tâm'>
              <FormDebouneSelect
                placeholder='--Chọn--'
                field='care_product_list'
                fetchOptions={(keyword) => fetchProductOptions(keyword)}
                mode='multiple'
              />
            </FormItem>

            <BWAccordion title='Images' isRequired={false}>
              <div className='bw_mt_1 bw_flex bw_align_items_center'>
                <label className='bw_choose_image_banner'>
                  <input
                    type='file'
                    multiple={true}
                    field='images'
                    name='images'
                    accept='image/*'
                    onChange={(_) => handleChangeImages(_, 'images')}
                  />
                  <span className='fi fi-rr-add'></span>
                </label>

                {Boolean(watch('images')?.length) &&
                  watch('images').map((item, index) => (
                    <div className='bw_image_view_banner'>
                      <BWImage src={item.picture_url ? item.picture_url : item} />
                      <RemoveImageSpan
                        className='bw_remove_image'
                        onClick={() => {
                          setValue(
                            'images',
                            watch('images').filter((_, i) => i !== index),
                          );
                        }}>
                        <i className='fi fi-rr-cross-small'></i>
                      </RemoveImageSpan>
                    </div>
                  ))}
              </div>
              {errors['images'] && <ErrorMessage message={errors['images']?.message} />}
            </BWAccordion>

            <div className='bw_mt_1'>
              <button className='bw_btn bw_btn_success' type='submit'>
                Gửi
              </button>
              <button
                className='bw_btn_outline'
                style={{ marginLeft: '5px' }}
                onClick={(e) => {
                  e.preventDefault();
                  methods.reset();
                }}>
                Làm lại
              </button>
            </div>
          </form>
        </FormProvider> */}
      {/* </BWAccordion> */}
    </React.Fragment>
  );
}

export default HistoryComments;
