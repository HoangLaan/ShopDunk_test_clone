import Modal from 'components/shared/Modal/index';
import { FormProvider, useForm } from 'react-hook-form';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from 'components/shared/DataTable/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';
import { Fragment } from 'react';
import { getList } from 'services/business.service';
import BWButton from 'components/shared/BWButton/index';
import { PERMISSION_VIEW_BUSSINESS } from 'pages/PaymentForm/utils/constants';

const ModalBusiness = ({ open, onClose, handleAddBusiness, defaultDataSelect }) => {
  const methods = useForm();
  const dispatch = useDispatch();
  const { businessTypeData, areaData } = useSelector((state) => state.global);
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
    if (!businessTypeData && open) dispatch(getOptionsGlobal('businessType'));
  }, [businessTypeData, dispatch, open]);

  useEffect(() => {
    if (!areaData && open) dispatch(getOptionsGlobal('area'));
  }, [areaData, dispatch, open]);

  const loadBusiness = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(() => {
    open && loadBusiness();
  }, [loadBusiness, open]);

  const columns = useMemo(
    () => [
      {
        header: 'Mã miền',
        accessor: 'business_code',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky bw_title_page',
      },
      {
        header: 'Tên miền',
        classNameHeader: 'bw_text_center',
        accessor: 'business_name',
      },
      {
        header: 'Khu vực',
        classNameHeader: 'bw_text_center',
        accessor: 'area_name',
      },
    ],
    [],
  );

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

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: [PERMISSION_VIEW_BUSSINESS.VIEW],
        onClick: (p) => window._$g.rdr(`/business/detail/${p?.business_id}`),
      },
    ];
  }, []);
  return (
    <Modal
      styleModal={styleModal}
      headerStyles={headerStyles}
      titleModal={titleModal}
      closeModal={closeModal}
      witdh={'70%'}
      header='Danh sách miền'
      open={open}
      onClose={onClose}
      lalbelClose={'Đóng'}
      footer={
        <BWButton
          icon={'fi fi-rr-plus'}
          content={'Chọn'}
          type={'success'}
          onClick={() => handleAddBusiness?.(defaultData)}
        />
      }>
      <Fragment>
        <FormProvider {...methods}>
          <FilterSearchBar
            title='Tìm kiếm'
            colSize={4}
            onSubmit={(e) => {
              setParams((prev) => {
                return {
                  ...prev,
                  ...e,
                  business_type_ids: e?.list_business?.length > 0 ? e.list_business.map((x) => x.id).join(',') : null,
                  area_ids: e?.list_area?.length > 0 ? e.list_area.map((x) => x.id).join(',') : null,
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
                    placeholder={'Nhập mã miền, tên miền'}
                    field='keyword'
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        setParams((prev) => ({
                          ...prev,
                          keyword: e.target.value,
                        }));
                      }
                    }}
                  />
                ),
              },
              {
                title: 'Loại miền',
                component: (
                  <FormSelect
                    mode='multiple'
                    allowClear
                    list={mapDataOptions4SelectCustom(businessTypeData, 'id', 'name')}
                    field='list_business'
                  />
                ),
              },
              {
                title: 'Khu vực',
                component: (
                  <FormSelect
                    mode='multiple'
                    allowClear
                    list={mapDataOptions4SelectCustom(areaData, 'id', 'name')}
                    field='list_area'
                  />
                ),
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
          fieldCheck={'business_id'}
          totalItems={totalItems}
          onChangeSelect={(data) => {
            setDefaultData(data);
          }}
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

export default ModalBusiness;
