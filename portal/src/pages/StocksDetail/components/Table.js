import { showConfirmModal } from 'actions/global';
import BWButton from 'components/shared/BWButton';
import DataTable from 'components/shared/DataTable/index';
import CheckAccess from 'navigation/CheckAccess';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { deleteUnit } from 'services/unit.service';
import styled from 'styled-components';
import { formatMoney } from 'utils';

const StocksDetailTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  onChangeParams,
  handleExportExcel,
}) => {
  const queryPatch = new URLSearchParams(useLocation().search);
  const search = queryPatch.get('search');
  const dispatch = useDispatch();
  const StyleInventory = styled.div`
    color: ${(props) => (props.statusInventory === 2 ? '#EC2D41' : props.statusInventory === 1 ? '#F2994A' : '')};
  `;
  const columns = useMemo(
    () => [
      {
        header: 'Kho hàng',
        accessor: 'stocks_name',
        classNameHeader: 'bw_sticky bw_check_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_check_sticky bw_text_left',
        formatter: (p) => <StyleInventory statusInventory={p?.status_inventory}>{p.stocks_name}</StyleInventory>,
      },
      {
        header: 'Cửa hàng',
        accessor: 'store_name',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <StyleInventory statusInventory={p?.status_inventory}>{p.store_name}</StyleInventory>,
      },
      {
        header: 'Mã sản phẩm',
        accessor: 'product_code',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <StyleInventory statusInventory={p?.status_inventory}>{p.product_code}</StyleInventory>,
      },
      {
        header: 'Tên sản phẩm',
        accessor: 'product_name',
        classNameHeader: 'bw_text_center',

        formatter: (p) => <StyleInventory statusInventory={p?.status_inventory}>{p.product_name}</StyleInventory>,
      },
      {
        header: 'Tổng nhập',
        classNameHeader: 'bw_text_center',
        accessor: 'total_in',
        formatter: (p) => (
          <StyleInventory statusInventory={p?.status_inventory}>{p?.total_in ? p.total_in : 0}</StyleInventory>
        ),
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Tổng xuất',
        classNameHeader: 'bw_text_center',
        accessor: 'total_out',
        formatter: (p) => (
          <StyleInventory statusInventory={p?.status_inventory}>{p?.total_out ? p.total_out : 0}</StyleInventory>
        ),
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Tổng tồn',
        classNameHeader: 'bw_text_center',
        accessor: 'total_inventory',
        formatter: (p) => (
          <StyleInventory statusInventory={p?.status_inventory}>
            {p?.total_inventory ? p.total_inventory : 0}
          </StyleInventory>
        ),
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Đơn giá xuất kho',
        classNameHeader: 'bw_text_center',
        accessor: 'cogs_price',
        formatter: (p) => {
          return (
            <CheckAccess permission={'ST_PRICEIMEICODE_VIEW'}>
              {formatMoney(p?.cogs_price) || 0}
            </CheckAccess>
          )
        },
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Đơn vị tính',
        classNameHeader: 'bw_text_center',

        accessor: 'unit_name',
        classNameBody: 'bw_text_center',
        formatter: (p) => <StyleInventory statusInventory={p?.status_inventory}>{p.unit_name}</StyleInventory>,
      },
      {
        header: 'Ngành hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'category_name',
        //classNameBody: "bw_text_center",
        formatter: (p) => <StyleInventory statusInventory={p?.status_inventory}>{p.category_name}</StyleInventory>,
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'ST_STOCKSDETAIL_VIEW',
        onClick: (p) => {
          let productId = 0;
          let materialId = 0;
          if (p.is_material) {
            materialId = p.product_id;
          } else {
            productId = p.product_id;
          }
          window._$g.rdr(`/stocks-detail/detail/${p?.stocks_id}/${productId}/${materialId}`);
        },
      },
      {
        icon: 'fi-rr-angle-double-right',
        color: 'green',
        permission: 'ST_STOCKSDETAIL_VIEW',
        hidden: search ? false : true,
        onClick: (p) => {
          window._$g.rdr(`/stocks-detail/history/${search}`);
        },
      },
    ];
  }, [search]);

  const handleDelete = async (id) => {
    await deleteUnit(id);
    onRefresh();
  };

  const handleBulkAction = (items, action) => {
    if (action === 'delete') {
      if (Array.isArray(items)) {
        (items || []).forEach((item) => {
          handleDelete(item.unit_id);
        });
      }
    }
  };

  return (
    <React.Fragment>
      <div className='bw_row bw_mb_1 bw_mt_1 bw_align_items_center' style={{ marginBottom: '-30px' }}>
        <div className='bw_col_6'>
          <p>
            *Chú ý:{' '}
            <span
              className='bw_badge'
              onClick={() => {
                onChangeParams({ inventory_status: 1 });
              }}
              style={{ backgroundColor: '#ffeccf', color: 'orange', marginRight: '5px' }}>
              Dưới định mức tồn tối thiểu
            </span>
            <span
              className='bw_badge bw_badge_danger'
              onClick={() => {
                onChangeParams({ inventory_status: 2 });
              }}>
              Vượt định mức tồn tối đa
            </span>
          </p>
        </div>
        <div className='bw_col_6 bw_flex bw_justify_content_right bw_align_items_center bw_btn_group'>
          <CheckAccess permission='ST_STOCKSDETAIL_EXPORT'>
            <BWButton
              type='success'
              submit
              icon='fi fi-rr-inbox-out'
              content='Xuất Excel'
              onClick={() => handleExportExcel()}
            />
          </CheckAccess>
        </div>
      </div>
      <DataTable
        noSelect
        loading={loading}
        columns={columns}
        data={data}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
        handleBulkAction={handleBulkAction}
      />
    </React.Fragment>
  );
};

export default StocksDetailTable;
