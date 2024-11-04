import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { create, getOptionsPriceReview, read, update } from 'pages/OutputType/helpers/call-api';
import { getErrorMessage } from 'utils/index';
import { mapDataOptions4Select, mapDataOptions4SelectCustom } from 'utils/helpers';
import { getOptionsDepartment } from 'services/department.service';
import OutputTypeInfor from 'pages/OutputType/components/add/OutputTypeInfor';
import OutputTypeReview from 'pages/OutputType/components/add/OutputTypeReview';
import OutputTypeStatus from 'pages/OutputType/components/add/OutputTypeStatus';
import FormSection from 'components/shared/FormSection';
//compnents

dayjs.extend(customParseFormat);

const OutputTypeAdd = ({ outputTypeId = null, isEdit = true }) => {
  const methods = useForm({
    defaultValues: { is_active: 1, company_id: 1 },
  });

  const [optionsReviewLevel, setOptionsReviewLevel] = useState([]);
  const [departmentOpts, setDepartmentOpts] = useState([]);

  const loadOptionsReviewLevel = async () => {
    try {
      let options = await getOptionsPriceReview();

      setOptionsReviewLevel(mapDataOptions4SelectCustom(options, 'id', 'name'));
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };
  useEffect(() => {
    loadOptionsReviewLevel();
  }, []);

  const company_id = methods.watch('company_id');

  const getDepartmentOpts = useCallback(async () => {
    if (company_id) {
      const _departMentOpts = await getOptionsDepartment({ parent_id: company_id });
      setDepartmentOpts(mapDataOptions4Select(_departMentOpts));
    }
  }, [company_id]);

  useEffect(() => {
    getDepartmentOpts();
  }, [getDepartmentOpts]);

  const onSubmit = async (values) => {
    let formData = { ...values };

    try {
      formData.is_vat = values?.is_vat ? 1 : 0;

      formData.area_id = values?.area_id.map((_area) => _area.id).join('|');

      //formData.product_categorie_ids = values?.product_cate_list.map((_cate) => _cate.id).join('|')

      formData.price_review_lv_users = values?.reviews ? values?.reviews : [];

      if (outputTypeId) {
        await update(outputTypeId, formData);
        showToast.success(`Cập nhật thành công.`, {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      } else {
        await create(formData);
        showToast.success(`Thêm thành công.`, {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });

        methods.reset({});
      }
    } catch (error) {
      showToast.error(error.message ? error.message : 'Có lỗi xảy ra!', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  const loadOutputTypeDetail = useCallback(async () => {
    if (outputTypeId) {
      const detail = await read(outputTypeId);
      methods.reset({
        ...detail,
      });
    }
  }, [outputTypeId, methods]);

  useEffect(() => {
    loadOutputTypeDetail();
  }, [loadOutputTypeDetail]);

  const detailForm = [
    {
      id: 'information',
      title: 'Thông tin hình thức xuất bán',
      component: OutputTypeInfor,
      fieldActive: ['output_type_name', 'company_id', 'area_id', 'order_types'],
    },
    {
      id: 'review_list',
      title: 'Thông tin mức duyệt',
      component: OutputTypeReview,
      fieldActive: ['reviews'],
      optionsReviewLevel: optionsReviewLevel,
      departmentOpts: departmentOpts,
    },
    { id: 'status', title: 'Trạng thái', component: OutputTypeStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={!isEdit} />
    </FormProvider>
  );
};

export default OutputTypeAdd;
