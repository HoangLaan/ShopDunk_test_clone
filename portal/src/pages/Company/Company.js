import React, { useEffect, useState, useCallback, useMemo } from 'react';

// service
import { getList, deleteCompany } from 'services/company.service';

// components
import CompanyFilter from './components/CompanyFilter';
import DataTable from 'components/shared/DataTable';
import ICON_COMMON from 'utils/icons.common';
import { showConfirmModal } from 'actions/global';
import { useDispatch } from 'react-redux';
import { showToast, defaultParams } from 'utils/helpers';

export default function Company() {
  const [data, setData] = useState({
    items: [],
    totalItems: 0,
  });
  const dispatch = useDispatch();
  const [params, setParams] = useState(defaultParams);

  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({
    keyword: '',
    is_active: 1,
    page: 1,
    pageSize: 25,
  });

  const getData = useCallback(() => {
    setLoading(true);
    try {
      getList(params)
        .then((_data) => {
          setData(_data);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      window._$g.dialogs.alert(window._$g._(error.message));
    } finally {
      setLoading(false);
    }
  }, [params]);
  useEffect(getData, [getData]);

  const handleChangePage = (newPage, sizePage) => {
    let _query = { ...query };
    _query.page = newPage;
    setQuery(_query);
  };

  const handleSubmitFilter = (values) => {
    let _query = { ...query, ...values, page: 1 };
    setQuery(_query);
  };

  const columns = useMemo(
    () => [
      {
        header: 'Mã công ty',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'company_id',
      },
      {
        header: 'Tên công ty',
        classNameHeader: 'bw_text_center',
        accessor: 'company_name',
      },
      {
        header: 'Loại hình công ty',
        classNameHeader: 'bw_text_center',
        accessor: 'company_type_name',
      },
      {
        header: 'Số điện thoại',
        classNameHeader: 'bw_text_center',
        accessor: 'phone_number',
      },
      {
        header: 'Email',
        classNameHeader: 'bw_text_center',
        accessor: 'email',
      },
      {
        header: 'Địa chỉ',
        classNameHeader: 'bw_text_center',
        accessor: 'address_full',
      },
      {
        header: 'Trạng thái',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Thêm mới',
        permission: 'AM_COMPANY_ADD',
        onClick: () => window._$g.rdr('/company/add'),
      },
      {
        icon: ICON_COMMON.edit,
        color: 'blue',
        permission: 'AM_COMPANY_EDIT',
        onClick: (p) => window._$g.rdr(`/company/edit/${p?.company_id}`),
      },
      {
        icon: ICON_COMMON.view,
        color: 'green',
        permission: 'AM_COMPANY_VIEW',
        onClick: (p) => window._$g.rdr(`/company/detail/${p?.company_id}`),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: 'AM_COMPANY_DEL',
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                try {
                  await deleteCompany(p?.company_id);
                  getData();
                } catch (error) {
                  showToast.error(error.message);
                }
              },
            ),
          ),
      },
    ];
  }, []);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp' style={{ paddingBottom: '20px' }}>
        <CompanyFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <DataTable
          data={data?.items}
          totalPages={data?.totalPages}
          itemsPerPage={data?.itemsPerPage}
          page={data?.page}
          totalItems={data?.totalItems}
          columns={columns}
          actions={actions}
          loading={loading}
          fieldCheck='company_id'
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          handleBulkAction={async (values) => {
            dispatch(
              showConfirmModal(
                ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
                async () => {
                  for (let i = 0; i < values.length; i++) {
                    try {
                      await deleteCompany(values[i]?.company_id);
                    } catch (error) {
                      showToast.error(error.message);
                    }
                  }
                  getData();
                  document.getElementById('data-table-select')?.click();
                },
              ),
            );
          }}
        />
      </div>
    </React.Fragment>
  );
}
