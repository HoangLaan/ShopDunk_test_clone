import { useDispatch } from 'react-redux';
import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { showConfirmModal } from 'actions/global';
import { msgError } from 'pages/ReviewList/helpers/msgError';
import { getListIMEI } from 'services/stocks-detail.service';
import { getErrorMessage } from 'utils';
import { mapDataOptions4Select, showToast } from 'utils/helpers';

//components
import BWAccordion from 'components/shared/BWAccordion/index';
import DataTable from 'components/shared/DataTable/index';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import MaterialModal from 'pages/ReviewList/components/add/Information/components/MaterialModel/MaterialModal';

const Materials = ({ disabled, title, orderId }) => {
  const dispatch = useDispatch();

  const methods = useFormContext({});
  const { watch, setValue, clearErrors, reset, getValues } = methods;
  const { fields, remove } = useFieldArray({
    control: methods.control,
    name: 'materials',
  });

  const [isShowSelectMaterialModal, setIsShowSelectMaterialModal] = useState(false);

  const materials = watch('materials');
  const gifts = watch('gifts');
  const products = watch('products');
  const store_id = watch('store_id');

  const onChangeMaterials = useCallback(() => {
    const materials = watch('materials');
    if (materials?.length > 0) {
      const selectedImeis = [
        // imei cua cac material
        ...materials.reduce((acc, material) => acc.concat(material?.imei_codes || []), []).map((imei) => imei?.value),
        // imei cua cac gift
        ...gifts.reduce((acc, gift) => acc.concat(gift?.imei_codes || []), []).map((imei) => imei?.value),
        // imei cua cac product
        ...Object.keys(products || {}),
      ];

      // disable cac imei da chon
      const newMaterials = materials.map((material) => {
        const newImeiOptions = material?.imei_code_options?.map((imei) => {
          const isDisabled =
            // đã được chọn
            selectedImeis?.findIndex((item) => item === imei?.value) !== -1 &&
            // và không nằm trong ds imei đã chọn của material hiện tại
            !(material?.imei_codes?.findIndex((item) => item?.value === imei?.value) > -1);

          return {
            ...imei,
            disabled: isDisabled,
          };
        });

        return {
          ...material,
          imei_code_options: newImeiOptions,
        };
      });

      setValue('materials', newMaterials);
    }
  }, [gifts, materials, products, setValue]);

  const fetchImeiOptions = useCallback(
    (search, materialId, index) =>
      getListIMEI({
        search,
        id: materialId,
        store_id,
        table: 'MATERIAL',
      })
        .then((res) => {
          setValue(`materials.${index}.imei_code_options`, mapDataOptions4Select(res || []));
          onChangeMaterials();
        })
        .catch((error) => {
          showToast.error(
            getErrorMessage({
              message: error.message || 'Có lỗi khi lấy IMEI.',
            }),
          );
        }),
    [store_id, setValue, onChangeMaterials],
  );

  const onEnterImei = (e, materialId, index) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      // set lại giá trị trước đó của nó trước khi onChange trigger
      const currentMaterials = watch(`materials[${index}].imei_codes_previous`) || [];
      setValue(`materials[${index}].imei_codes`, currentMaterials);

      getListIMEI({
        search: e.target.value?.replace('Ư', 'W'),
        id: materialId,
        store_id,
        table: 'MATERIAL',
      })
        .then((res) => {
          if (res.length >= 1) {
            const searchImei = res[0];

            if (currentMaterials.every((material) => material.value !== searchImei?.value)) {
              currentMaterials.push(searchImei);
            }
            const materials = getValues('materials') || [];
            materials[index].imei_codes = currentMaterials;
            setValue(`materials`, materials);
            setTimeout(() => {
              const input = document.getElementById('imei_input');
              if (input) {
                input.blur();
                input.click();
                input.focus();
              }
            }, 500);
          }
        })
        .catch((err) => {
          showToast.error(
            getErrorMessage({
              message: err.message || 'Lỗi khi tìm túi, bao bì',
            }),
          );
        });
    }
  };

  const columns = [
    {
      header: 'Mã túi',
      accessor: 'material_code',
      formatter: (item, index) => (
        <Fragment>
          <span>{item.material_code}</span>
        </Fragment>
      ),
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Tên túi',
      accessor: 'material_name',
      formatter: (item, index) => (
        <Fragment>
          <span>{item.material_name}</span>
        </Fragment>
      ),
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Số lượng',
      accessor: 'quantity',
      formatter: (p, idx) => (
        <FormNumber
          bordered
          className='bw_inp'
          disabled={disabled}
          field={`materials.${idx}.quantity`}
          style={{ width: '100%' }}
        />
      ),
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
    },
    {
      header: 'IMEI',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      formatter: (p, idx) => (
        <FormDebouneSelect
          fetchOptions={(search) => fetchImeiOptions(search, p?.material_id, idx)}
          mode='multiple'
          id='imei_input'
          options={watch(`materials[${idx}].imei_code_options`) || []}
          field={`materials[${idx}].imei_codes`}
          disabled={disabled}
          allowClear
          // validation={{
          //   validate: (value, _) => {
          //     if (!value || value?.length === 0) {
          //       return 'IMEI không được để trống';
          //     }

          //     if (value?.length !== +p?.quantity) {
          //       return 'Số lượng IMEI không khớp';
          //     }

          //     return true;
          //   },
          // }}
          onChange={(value) => {
            setValue(`materials[${idx}].imei_codes_previous`, methods.getValues(`materials[${idx}].imei_codes`) || []);
            setValue(`materials[${idx}].imei_codes`, value);

            onChangeMaterials();
          }}
          style={{ minWidth: '125px' }}
          onKeyDown={(e) => {
            onEnterImei(e, p?.material_id, idx);
          }}
        />
      ),
    },
    {
      header: 'Thành tiền',
      accessor: 'total_price',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_right',
      formatter: (p) => <b className='bw_sticky bw_name_sticky'>{0}</b>,
    },
    {
      header: 'Ghi chú',
      accessor: 'note',
      formatter: (p, idx) => (
        <input
          type='text'
          disabled={disabled}
          value={p?.note}
          onChange={({ target: { value } }) => setValue(`materials[${idx}].note`, value)}
          className='bw_inp bw_mw_2'
          placeholder='Ghi chú'
        />
      ),
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
    },
  ];

  const hiddenAddMaterialBtn = useMemo(() => !Boolean(store_id), [store_id]);

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: ['SL_ORDER_ADD', 'SL_ORDER_EDIT'],
        disabled: disabled,
        onClick: (p, index) => Boolean(!disabled) && setIsShowSelectMaterialModal(true),
        hidden: hiddenAddMaterialBtn,
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: ['SL_ORDER_ADD', 'SL_ORDER_EDIT'],
        disabled: disabled,
        onClick: (p, index) =>
          Boolean(!disabled) &&
          dispatch(
            showConfirmModal(msgError['model_error'], async () => {
              remove(index);
              reset(watch());
            }),
          ),
      },
    ];
  }, [disabled, dispatch, remove, reset, watch, hiddenAddMaterialBtn]);

  return (
    <BWAccordion title={title} id='bw_info_cus'>
      <DataTable
        columns={columns}
        data={fields}
        noPaging={true}
        noSelect={disabled}
        actions={actions}
        handleBulkAction={(selected) => {
          dispatch(
            showConfirmModal(msgError['model_error'], async () => {
              for (let i = 0; i < selected.length; i++) {
                const findIndex = fields.findIndex((item) => item?.material_id === selected[i]?.material_id);
                remove(selected[findIndex]);
              }
              reset(watch());
              document.getElementById('data-table-select').click();
            }),
          );
        }}
      />

      {isShowSelectMaterialModal && (
        <MaterialModal
          onClose={() => {
            setIsShowSelectMaterialModal(false);
          }}
          onConfirm={(materials) => {
            setValue(
              'materials',
              materials.map((p) => ({ ...p, quantity: p.quantity || 1 })),
            );
            setIsShowSelectMaterialModal(false);
          }}
        />
      )}
    </BWAccordion>
  );
};

export default Materials;
