import DataTable from 'components/shared/DataTable/index';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import Modal from 'components/shared/Modal/index';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BWButton from 'components/shared/BWButton/index';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { statusTypesOption } from 'utils/helpers';
import { getListStore } from '../../helpers/call-api';

function StoreModal({ open, onClose, onApply, defaultDataSelect }) {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { watch, setValue } = methods;
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 10,
  });
  const [listStore, setListStore] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const companyOptions = useGetOptions(optionType.company);
  const businessOptions = useGetOptions(optionType.business, { params: { parent_id: watch('company_id') } });
  const clusterOptions = useGetOptions(optionType.cluster, { params: { parent_id: watch('business_id') } });

  const loadListUser = useCallback(() => {
    getListStore(params).then(setListStore);
  }, [params]);

  const { items, itemsPerPage, page, totalItems, totalPages } = listStore;

  useEffect(() => {
    loadListUser();
  }, [loadListUser]);

  const onSubmit = useCallback(
    (value) =>
      setParams((prev) => ({
        ...prev,
        ...value,
        page: 1,
      })),
    [],
  );

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Mã cửa hàng',
        accessor: 'store_code',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tên cửa hàng',
        accessor: 'store_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Địa chỉ',
        accessor: 'address',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Miền',
        classNameHeader: 'bw_text_center',
        accessor: 'business_name',
      },
      {
        header: 'Cụm',
        classNameHeader: 'bw_text_center',
        accessor: 'cluster_name',
      },
      {
        header: 'Số điện thoại',
        classNameHeader: 'bw_text_center',
        accessor: 'phone_number',
      },
    ],
    [],
  );

  const listStoreRef = useRef([]);
  const fetchListStore = useCallback(async (page) => {
    const data = await getListStore({
      ...params,
      itemsPerPage: 250,
      page,
    });
    if (!data || data.items?.length === 0 || parseInt(data.page) > data.totalPages) return;
    listStoreRef.current = [...listStoreRef.current, ...data.items];
    return await fetchListStore(parseInt(data.page) + 1);
  }, []);

  const handleCheckAllStores = useCallback(async (e) => {
    if (e.target.checked) {
      await fetchListStore(1);
    } else {
      listStoreRef.current = [];
    }
  }, []);

  return (
    <Modal
      witdh={'60%'}
      open={open}
      onClose={onClose}
      header='Chọn cửa hàng'
      footer={
        <BWButton
          type='success'
          outline
          content={'Cập nhật'}
          onClick={() => {
            onApply(listStoreRef.current);
            onClose();
          }}
        />
      }>
      <FormProvider {...methods}>
        <FilterSearchBar
          title='Tìm kiếm'
          onSubmit={onSubmit}
          onClear={() =>
            setParams((prev) => ({
              ...prev,
              is_active: 1,
              search: undefined,
              company_id: undefined,
              business_id: undefined,
              cluster_id: undefined,
            }))
          }
          actions={[
            {
              title: 'Từ khóa',
              component: (
                <FormInput
                  placeholder='Nhập tên cửa hàng, mã cửa hàng'
                  field='search'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      methods.handleSubmit(onSubmit)();
                    }
                  }}
                />
              ),
            },
            {
              title: 'Trực thuộc công ty',
              component: <FormSelect field='company_id' list={companyOptions} />,
            },
            {
              title: 'Miền',
              component: <FormSelect field='business_id' list={businessOptions} />,
            },
            {
              title: 'Cụm',
              component: <FormSelect field='cluster_id' list={clusterOptions} />,
            },
            {
              title: 'Kích hoạt',
              component: <FormSelect field='is_active' id='is_active' list={statusTypesOption} />,
            },
          ]}
        />
        <DataTable
          title={
            <label className='bw_checkbox'>
              <FormInput
                field={'is_check_all'}
                type='checkbox'
                onChange={(e) => {
                  setValue('is_check_all', e.target.checked);
                  handleCheckAllStores(e);
                }}
              />
              <span />
              Chọn tất cả
            </label>
          }
          hiddenDeleteClick
          fieldCheck={'store_id'}
          defaultDataSelect={defaultDataSelect}
          columns={columns}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          onChangeSelect={(d) => {
            listStoreRef.current = d;
          }}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
        />
      </FormProvider>
    </Modal>
  );
}

export default StoreModal;
