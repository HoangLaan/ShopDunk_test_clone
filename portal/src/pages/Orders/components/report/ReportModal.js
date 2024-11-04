import DataTable from 'components/shared/DataTable/index';
import Modal from 'components/shared/Modal/index';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getProductListReport, getReportChart } from 'pages/Orders/helpers/call-api';
import ProductListChart from './ProductListChart';
import styled from 'styled-components';
import ReportFilter from './ReportFilter';
import { defaultParams } from './constants';
import BWButton from 'components/shared/BWButton';
import { LeftOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import usePagination from 'hooks/usePagination';
import { useHistory } from 'react-router-dom';
import CheckAccess from 'navigation/CheckAccess';
import { useFormContext } from 'react-hook-form';

const ProductListChartStyled = styled.div`
  .bw_debit_chart {
    width: 476px;
  }
`;

const TableStyled = styled.div`
  .bw_box_card > .bw_row.bw_mt_2.bw_mb_2 {
    margin-bottom: 0px;
    margin-top: 0px;
  }
`;

function ReportModal({ open, onClose, dataReportSearch }) {
  const order_type_opts = dataReportSearch?.order_type_opts;
  const preOrderTypeIds = order_type_opts?.filter(_ => _?.label?.toLowerCase()?.includes('preorder'))?.map(_=>_.value).join(',');

  const [params, setParams] = useState({ ...defaultParams, order_type_ids: preOrderTypeIds });
  const [paramsChart, setParamsChart] = useState({ order_type_ids: preOrderTypeIds });
  const [chartLevel, setChartLevel] = useState(1);
  const history = useHistory();

  const [data, setData] = useState([]);
  const [stores, setStores] = useState([]);
  const [orders, setOrders] = useState([]);
  const [chartData, setChartData] = useState([]);

  const {
    items = [],
    itemsPerPage,
    page,
    totalItems,
    totalPages,
    onChangePage,
  } = usePagination({ data: data, itemsPerPage: 10 });

  const filterdStore = useMemo(() => {
    const storesHaveProduct = items.reduce((acc, item) => {
      item.stores.forEach((store) => {
        if (store.quantity > 0 && !acc.find((_) => _.store_id === store.store_id)) {
          acc.push({
            store_id: store.store_id,
            store_name: store.store_name,
          });
        }
      });

      return acc;
    }, []);

    return storesHaveProduct;
  }, [items]);

  const loadData = useCallback(() => {
    getProductListReport(params).then((data) => {
      setData(data.data);
      setStores(data.stores);
      setOrders(data.orders);
    });
  }, [params]);

  const loadDataChart = useCallback(() => {
    getReportChart(paramsChart).then(setChartData);
  }, [paramsChart]);

  useEffect(loadData, [loadData]);
  useEffect(loadDataChart, [loadDataChart]);

  const columns = useMemo(
    () => [
      {
        styleHeader: {
          left: '0px',
          minWidth: '45px',
          maxWidth: '45px',
        },
        style: {
          left: '0px',
          minWidth: '45px',
          maxWidth: '45px',
        },
        header: 'STT',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        styleHeader: {
          left: '45px',
          minWidth: '140px',
          maxWidth: '140px',
        },
        style: {
          left: '45px',
          minWidth: '140px',
          maxWidth: '140px',
        },
        header: 'Mã sản phẩm',
        accessor: 'product_code',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky bw_text_center',
      },
      {
        header: 'Tên sản phẩm',
        accessor: 'product_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Đơn vị tính',
        accessor: 'unit_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (item) => (item.unit_name ? item.unit_name : 'Chiếc'),
      },
      {
        header: 'Số lượng',
        accessor: 'quantity',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (item) => (item.quantity ? item.quantity : 0),
      },
      ...filterdStore.map((store) => ({
        header: store.store_name || 'Đơn hàng không thuộc store',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (item) => {
          const storeItem = item.stores?.find((_) => _.store_id === store.store_id);
          return storeItem?.quantity || 0;
        },
      })),
    ],
    [filterdStore],
  );

  const footer = () => {
    if (params.company_id && params.area_id && params.business_id) {
      return (
        <CheckAccess permission={'SL_ORDER_DIVISION'} >
          <BWButton
          type='success'
          icon='fi fi-rr-database'
          content={'Chia hàng'}
          onClick={() => {
            const business_ids = params.business_id.map(item => item.id);
            history.push('/purchase-order-division/add?division_type=2', {
              company_id: params.company_id,
              area_id: params.area_id,
              // business_id: params.businessOption.filter(item => business_ids.includes(item.id)).map(d => ({value: d.id, label: d.name})),
              business_id: params.business_id,
              data: data,
              stores: stores,
              orders: orders
            });
          }}></BWButton>
        </CheckAccess>
      );
    }
    return null;
  };

  const onChangeParmas = useCallback((params) => {
    setParamsChart((prev) => ({ ...prev, ...params }));
  }, []);

  const handleFilterChart = useCallback((params) => {
    setParams((prev) => ({ ...prev, ...params }));
    setParamsChart((prev) => ({ ...prev, ...params }));
  }, [])

  return (
    <Modal witdh={'65%'} open={open} footer={footer()} onClose={onClose} header='Bảng báo cáo sản phẩm theo đơn'>
      <div className='bw_row'>
        <div className='bw_col_5' style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '15px', top: '30px' }}>
            {chartLevel === 2 ? (
              <Tooltip title='Quay lại'>
                <Button
                  type='text'
                  onClick={() => {
                    setParamsChart((prev) => ({ ...prev, model_id: null }));
                    setChartLevel(1);
                  }}
                  icon={<LeftOutlined />}
                />
              </Tooltip>
            ) : null}
          </div>
          <ProductListChartStyled>
            <div className='bw_mt_1 bw_box_list_card'>
              <div className='bw_debit_chart'>
                <ProductListChart
                  setChartLevel={setChartLevel}
                  chartLevel={chartLevel}
                  onChange={onChangeParmas}
                  data={chartData}
                />
              </div>
            </div>
          </ProductListChartStyled>
        </div>
        <div className='bw_col_7'>
          <div className='bw_row'>
            <div className='bw_col_12'>
              <ReportFilter
                onChange={handleFilterChart}
              />
            </div>
            <div className='bw_col_12'>
              <TableStyled>
                <DataTable
                  noAction
                  noSelect
                  hiddenDeleteClick
                  columns={columns}
                  data={items}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  page={page}
                  totalItems={totalItems}
                  onChangePage={onChangePage}
                />
              </TableStyled>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ReportModal;
