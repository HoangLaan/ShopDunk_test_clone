import { getOptionsGlobal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import Modal from 'components/shared/Modal/index';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, FormProvider } from 'react-hook-form';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import BWAddress from 'components/shared/BWAddress/index';
import { getList } from 'services/store.service';
import BWButton from 'components/shared/BWButton/index';
import { PERMISSION_VIEW_BUSSINESS } from 'pages/PaymentForm/utils/constants';

const ModalStore = ({ open, onClose, handleAddStore, defaultDataSelect }) => {
  const methods = useForm();
  const dispatch = useDispatch();
  const { businessData, clusterData, storeTypeData } = useSelector((state) => state.global);
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 12,
  });
  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [defaultData, setDefaultData] = useState([]);
  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  useEffect(() => {
    setDefaultData(defaultDataSelect);
  }, [defaultDataSelect]);

  useEffect(() => {
    if (!storeTypeData && open) dispatch(getOptionsGlobal('storeType'));
  }, [storeTypeData, dispatch, open]);

  useEffect(() => {
    if (!businessData && open) dispatch(getOptionsGlobal('business'));
  }, [businessData, dispatch, open]);

  useEffect(() => {
    if (!clusterData && open) dispatch(getOptionsGlobal('cluster'));
  }, [clusterData, dispatch, open]);

  const loadStore = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(() => {
    open && loadStore();
  }, [loadStore, open]);

  ///zone handle scroll effect for header position

  const styleModal = { marginLeft: '300px' };

  const headerStyles = {
    backgroundColor: 'white',
    borderBottom: '#ddd 1px solid',
    marginTop: '-20px',
    zIndex: '1',
    top: '-2rem',
    height: '4rem',
  };
  const titleModal = {
    marginLeft: '2rem',
    marginTop: '1rem',
  };
  const closeModal = {
    marginRight: '2rem',
    marginTop: '1rem',
  };
  ////end zone

  const columns = useMemo(
    () => [
      {
        header: 'Mã cửa hàng',
        accessor: 'store_code',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky bw_title_page',
      },
      {
        header: 'Tên cửa hàng',
        accessor: 'store_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Loại cửa hàng',
        accessor: 'store_type_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Miền',
        accessor: 'business_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Cụm',
        accessor: 'cluster_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Địa chỉ',
        accessor: 'address',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Số điện thoại',
        accessor: 'phone_number',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: [PERMISSION_VIEW_BUSSINESS.VIEW],
        onClick: (p) => window._$g.rdr(`/store/detail/${p?.store_id}`),
      },
    ];
  }, []);
  return (
    <Modal
      witdh={'70%'}
      header='Danh sách cửa hàng'
      styleModal={styleModal}
      headerStyles={headerStyles}
      titleModal={titleModal}
      closeModal={closeModal}
      open={open}
      onClose={onClose}
      lalbelClose={'Đóng'}
      footer={
        <BWButton
          icon={'fi fi-rr-plus'}
          content={'Chọn'}
          type={'success'}
          onClick={() => handleAddStore?.(defaultData)}
        />
      }>
      <Fragment>
        <FormProvider {...methods}>
          <FilterSearchBar
            title='Tìm kiếm'
            onSubmit={(e) => {
              setParams((prev) => {
                return {
                  ...prev,
                  ...e,
                };
              });
            }}
            onClear={() =>
              setParams({
                is_active: 1,
                page: 1,
                itemsPerPage: 25,
              })
            }
            actions={[
              {
                title: 'Từ khóa',
                component: (
                  <FormInput
                    placeholder={'Nhập mã cửa hàng, tên cửa hàng '}
                    field='search'
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        setParams((prev) => ({
                          ...prev,
                          search: e.target.value,
                        }));
                      }
                    }}
                  />
                ),
              },
              {
                title: 'Miền',
                component: (
                  <FormSelect
                    allowClear
                    list={mapDataOptions4SelectCustom(businessData, 'id', 'name')}
                    field='business_id'
                  />
                ),
              },
              {
                title: 'Cụm',
                component: (
                  <FormSelect
                    allowClear
                    list={mapDataOptions4SelectCustom(clusterData, 'id', 'name')}
                    field='cluster_id'
                  />
                ),
              },
              {
                title: 'Loại cửa hàng',
                component: (
                  <FormSelect
                    allowClear
                    list={mapDataOptions4SelectCustom(storeTypeData, 'id', 'name')}
                    field='store_type_id'
                  />
                ),
              },
              {
                title: 'Tỉnh/Thành phố',
                component: <BWAddress type='province' field='province_id' />,
              },
            ]}
          />
        </FormProvider>
        <DataTable
          loading={loading}
          columns={columns}
          data={items}
          actions={actions}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          defaultDataSelect={defaultDataSelect}
          onChangeSelect={(data) => {
            setDefaultData(data);
          }}
          fieldCheck={'store_id'}
          totalItems={totalItems}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          hiddenDeleteClick
        />
      </Fragment>
    </Modal>
  );
};

export default ModalStore;
