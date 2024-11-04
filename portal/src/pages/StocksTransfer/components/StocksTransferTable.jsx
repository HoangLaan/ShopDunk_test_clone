import { showConfirmModal } from 'actions/global';
import BWImage from 'components/shared/BWImage/index';
import DataTable from 'components/shared/DataTable/index';
import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import BWLoader from 'components/shared/BWLoader/index';
import { msgError } from '../helpers/msgError';
import ReviewModal from './ReviewModal/ReviewModal';
import { exportPDF } from '../helpers/call-api';
import { cdnPath } from '../../../utils/index';
import { DELIVERY_STATUS } from '../helpers/const';

const StocksTransferTable = ({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  handleDelete,
  handleLoad,
  loading,
}) => {
  const dispatch = useDispatch();

  const [loadingPdf, setLoadingPdf] = useState(false);

  const [isModelReview, setIsModelReview] = useState(false);

  const [stocksTransfer, setStocksTransfer] = useState(undefined);

  const handleExportPDF = (stocks_transfer_id) => {
    setLoadingPdf(true);

    exportPDF(stocks_transfer_id)
      .then((response) => {
        let varUrl = response.path;
        const url = cdnPath(varUrl);
        const pdflink = document.createElement('a');
        pdflink.target = '_blank';
        pdflink.href = url;
        document.body.appendChild(pdflink);
        pdflink.click();
      })
      .finally(() => {
        setLoadingPdf(false);
      });
  };

  const status_review = (_status) => {
    switch (_status) {
      case 'Đã duyệt':
        return 'bw_agree';
      case 'Không duyệt':
        return 'bw_non_agree';
      default:
        return '';
    }
  };

  const columns = useMemo(
    () => [
      {
        style: {
          left: '20px',
        },
        styleHeader: {
          left: '20px',
        },
        header: 'Ngày tạo',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => <b>{p?.created_date}</b>,
      },
      {
        style: {
          left: '115px',
        },
        styleHeader: {
          left: '115px',
        },
        header: 'Số phiếu chuyển',
        accessor: 'stocks_transfer_code',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.stocks_transfer_code}</b>,
      },
      {
        header: 'Hình thức chuyển',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.stocks_transfer_type_name}</span>,
      },
      {
        header: 'Kho chuyển',
        classNameHeader: 'bw_text_center',
        accessor: 'stocks_export_name',
      },
      {
        header: 'Kho nhận',
        classNameHeader: 'bw_text_center',
        accessor: 'stocks_import_name',
      },
      {
        header: 'Người lập phiếu',
        accessor: 'created_user',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.created_user}</span>,
      },
      // {
      //   header: 'Ngày lập phiếu',
      //   accessor: 'created_date',
      //   classNameHeader: 'bw_text_center',
      //   classNameBody: 'bw_text_center',
      // },
      {
        header: 'Tiến độ chuyển hàng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => {
          switch (p.delivery_status) {
            case DELIVERY_STATUS.NOT_YET:
              return <span className='bw_label_outline text-center'>Chưa bắt đầu</span>;
            case DELIVERY_STATUS.COMPLETED_ON_TIME:
              return (
                <span className='bw_label_outline text-center' style={{ color: 'green', borderColor: 'green' }}>
                  Hoàn thành
                </span>
              );
            case DELIVERY_STATUS.LATE:
              return <span className='bw_label_outline bw_label_outline_danger text-center'>Trễ tiến độ</span>;
            case DELIVERY_STATUS.COMPLETED_LATE:
              return (
                <span className='bw_label_outline bw_label_outline_warning text-center'>Hoàn thành trễ tiến độ</span>
              );
            case DELIVERY_STATUS.IN_PROGRESS:
              return (
                <span className='bw_label_outline text-center' style={{ color: 'blue', borderColor: 'blue' }}>
                  Đang tiến hành
                </span>
              );
            default:
              return <span className='bw_label_outline text-center'>Không xác định</span>;
          }
        },
      },
      // {
      //   header: 'Trạng thái',
      //   accessor: 'trans_status',
      //   classNameHeader: 'bw_text_center',
      // },
      {
        styleHeader: {
          right: data.length == 0 ? '' : '195px',
        },
        header: 'Trạng thái duyệt',
        accessor: 'reviewed_status',
        classNameHeader: 'bw_text_center',
        // classNameBody: 'bw_sticky bw_name_sticky_custom_right',
        formatter: (p) => {
          return (
            <div className='text-left'>
              {!p?.transfer_review
                ? 'Tự động duyệt'
                : (p?.transfer_review || '').split(',').map((user, i) => {
                    let _user = user.split('|');
                    return (
                      <ul className='bw_confirm_level'>
                        <li className={status_review(_user[2])}>
                          <img
                            alt=''
                            src={_user[0] ? `${process.env.REACT_APP_CDN}${_user[0]}` : `bw_image/img_cate_default.png`}
                          />
                          {/* <BWImage src={process.env.REACT_APP_CDN + _user[0]} /> */}
                          <span
                            className={
                              _user[2] === 'Đã duyệt'
                                ? 'fi fi-rr-check'
                                : _user[2] === 'Không duyệt'
                                ? 'fi fi-rr-cross'
                                : 'fi fi-rr-minus'
                            }></span>
                          <p>
                            {_user[1]} -{' '}
                            <i
                              className={
                                _user[2] === 'Đã duyệt'
                                  ? 'bw_green'
                                  : _user[2] === 'Không duyệt'
                                  ? 'bw_red'
                                  : 'bw_black'
                              }>
                              {_user[2]}
                            </i>
                          </p>
                        </li>
                      </ul>
                    );
                  })}
            </div>
          );
        },
      },
    ],
    [data],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Lập phiếu chuyển kho',
        permission: 'ST_STOCKSTRANSFER_ADD',
        onClick: () => window._$g.rdr(`/stocks-transfer/add`),
      },
      {
        icon: 'fi fi-rr-print',
        permission: 'ST_STOCKSTRANSFER_PRINT',
        onClick: (p) => {
          handleExportPDF(p?.stocks_transfer_id);
        },
      },
      {
        icon: 'fi fi-rr-check',
        color: 'red',
        permission: 'ST_STOCKSTRANSFER_REVIEW',
        disabled: (p) => !p?.is_can_review,
        hidden: (p) => !p?.is_can_review,
        onClick: (p) => {
          if (p?.is_can_review) {
            setIsModelReview(true);
            setStocksTransfer(p);
          }
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'ST_STOCKSTRANSFER_VIEW',
        onClick: (p) => window._$g.rdr(`/stocks-transfer/detail/${p?.stocks_transfer_id}`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'ST_STOCKSTRANSFER_EDIT',
        disabled: (p) => (p?.is_reviewed === 2 ? false : true),
        onClick: (p) =>
          p?.is_reviewed === 2 ? window._$g.rdr(`/stocks-transfer/edit/${p?.stocks_transfer_id}`) : null,
        hidden: (p) => p?.is_reviewed !== 2,
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'ST_STOCKSTRANSFER_DEL',
        disabled: (p) => (p?.is_reviewed === 2 ? false : true),
        onClick: (p) =>
          p?.is_reviewed === 2
            ? dispatch(
                showConfirmModal(msgError['model_error'], async () => {
                  handleDelete(p);
                }),
              )
            : null,
        hidden: (p) => p?.is_reviewed !== 2,
      },
    ];
  }, []);

  return (
    <React.Fragment>
      <DataTable
        columns={columns}
        data={data}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
        loading={loading}
        hiddenRowSelect={(p) => p?.is_reviewed !== 2}
      />

      {/* Model duyệt phiếu chuyển kho */}
      <ReviewModal
        open={isModelReview}
        onClose={() => {
          handleLoad();
          setIsModelReview(false);
        }}
        stocksTransfer={stocksTransfer}
      />
      {loadingPdf && <BWLoader isPage={false} />}
    </React.Fragment>
  );
};

export default StocksTransferTable;
