import { FormProvider, useForm } from 'react-hook-form';
import Panel from 'components/shared/Panel/index';
import CalculatePricingOutStocks from './CalculatePricingOutStocks';
import CalculateSettings from './CalculateSetting';
import { showToast } from 'utils/helpers';
import { calculateOutStocks, createOrUpdateCogsSettings } from 'services/stocks-detail.service';
import { useState } from 'react';
import useQueryString from 'hooks/use-query-string';
import useGetOptions, { optionType } from 'hooks/useGetOptions';

const defaultValues = {
  is_active: 1,
  category_type: 1,
  pictures: [],
};

export default function PanelCalculate({ setShowModal }) {
  const [loading, setLoading] = useState(false);
  const methods = useForm({
    defaultValues,
  });
  const { reset, watch, handleSubmit } = methods;
  const [query, setQuery] = useQueryString();
  const isSetting = query?.tab_active === 'settings_cal';

  const onSubmit = async (values) => {
    try {
      // Tính giá xuất kho
      if (!isSetting) {
        if (!watch('stocks_type_list') || watch('stocks_type_list')?.length === 0) {
          showToast.warning('Vui lòng chọn loại kho');
          return;
        }

        if (!watch('calculate_date')) {
          showToast.warning('Vui lòng chọn thời gian');
          return;
        }

        if (!watch('calculate_according_stocks') && !watch('calculate_not_according_stocks')) {
          showToast.warning('Vui lòng chọn hình thức tính');
          return;
        }
        if (watch('choose_calculate_goods') && (watch('selected_product')?.length || -1) < 0) {
          showToast.warning('Vui lòng chọn sản phẩm cần tính');
          return;
        }

        setLoading(true);
        return await calculateOutStocks(values).then(() => {
          setShowModal(false);
          showToast.success('Quá trình tính giá xuất kho đã hoàn thành');
          window._$g.rdr(`/stocks-detail`);
        });
      }

      // Cấu hình tự động cho service
      if (!watch('stocks_type_list_settings') || watch('stocks_type_list_settings')?.length === 0) {
        showToast.warning('Vui lòng chọn loại kho');
        return;
      }

      if (!watch('calculate_date_settings')) {
        showToast.warning('Vui lòng chọn thời gian');
        return;
      }

      if (!watch('calculate_according_stocks') && !watch('calculate_not_according_stocks')) {
        showToast.warning('Vui lòng chọn hình thức tính');
        return;
      }
      if (watch('choose_calculate_goods') && (watch('selected_product')?.length || -1) < 0) {
        showToast.warning('Vui lòng chọn sản phẩm cần tính');
        return;
      }

      setLoading(true);
      await createOrUpdateCogsSettings({
        ...values,
        need_calculate_goods: values.need_calculate_goods ? 1 : values.choose_calculate_goods ? 2 : 0,
        selected_product: values.selected_product?.map((item) => item.product_id ?? item),
        type_calculating: values.calculate_according_stocks ? 1 : values.calculate_not_according_stocks ? 2 : 0,
        type_run_service: values.all_days ? 1 : values.last_days_of_month ? 2 : 0,
      }).then(() => {
        showToast.success('Cấu hình tự động thành công');
      });
    } catch (error) {
      showToast.error(error?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const stocksTypeOpts = useGetOptions(optionType.stocksType);
  const panels = [
    {
      key: 'cal',
      label: 'Tính giá',
      component: CalculatePricingOutStocks,
      setShowModal,
      loading,
      stocksTypeOpts,
    },
    {
      key: 'settings_cal',
      label: 'Cài đặt',
      component: CalculateSettings,
      stocksTypeOpts,
      isSetting,
    },
  ];

  return (
    <FormProvider {...methods}>
      <div className='bw_main_wrapp'>
        <div className='bw_modal bw_modal_open' id='bw_calculate_modal'>
          <div className='bw_modal_container bw_w900' style={{ background: 'var(--grayColor)' }}>
            <div className='bw_title_modal'>
              <h3>TÍNH GIÁ XUẤT KHO</h3>
              <span className='bw_close_modal fi fi-rr-cross-small' onClick={() => setShowModal(false)} />
            </div>
            <Panel panes={panels} loading={true} />

            <div className='bw_footer_modal bw_flex bw_justify_content_right bw_align_items_center'>
              <button type='button' className='bw_btn bw_btn_danger' onClick={() => setShowModal(false)}>
                <span className='fi fi-rr-check' /> Hủy
              </button>
              <button type='button' className='bw_btn  bw_btn_success' onClick={handleSubmit(onSubmit)}>
                <span className='fi fi-rr-check' /> Thực hiện
              </button>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
