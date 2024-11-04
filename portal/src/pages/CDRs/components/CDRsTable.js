import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteFunctionList } from 'services/function.service';
import ModalAudio from './ModalAudio';
import { CDRS_PERMISSION, HANGUP_OPTION, IS_MISSED_CALL, IS_MISSED_CALL_OPTIONS, RateOptions } from '../utils/constants';
import { downloadFileUrl } from 'utils/helpers';
import { recallUpdateVoip } from 'services/voip.services';
import styled from 'styled-components';

const directionOptions = {
  outbound: <span class='bw_label bw_label_success'>Gọi đi</span>,
  inbound: <span class='bw_label bw_label_warning'>Gọi đến</span>,
  local: <span class='bw_label bw_label_warning'>Gọi nội bộ</span>,
};

const LabelOpt = styled.li`
    display: flex;
    align-items: center;
    padding: 5px 7px !important;
    line-height: normal !important;
    font-size: 13px;
    background: var(--whiteColor);
    color: ${(props) => (props?.value != IS_MISSED_CALL_OPTIONS.MISSED ? 'var(--blueColor)' : 'var(--ogranceColor)')};
    border: 1px solid ${(props) => (props?.value != IS_MISSED_CALL_OPTIONS.MISSED ? 'var(--blueColor)' : 'var(--ogranceColor)')};
    border-radius: 3px;
`;

const CDRsTable = ({ params, loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh, onChangeParams, missed_counts, tabActive, setTabActive, handleExportExcel }) => {
  const [openRecord, setOpenRecord] = useState(undefined);
  const dispatch = useDispatch();
  const [selectOpt, setSelectOpt] = useState(0);
  const columns = useMemo(
    () => [
      {
        header: 'Nhân viên',
        formatter: (p) => p?.user_ext || p?.user || '',
      },
      {
        header: 'Máy nhánh',
        accessor: 'extension',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Chiều cuộc gọi',
        classNameHeader: 'bw_text_center',
        formatter: (p) => directionOptions[p?.direction],
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Số điện thoại',
        formatter: (p) => (p?.direction === 'outbound' ? <p>{p?.to_number} {p?.customer_full_name ? ' - ' + p.customer_full_name : ''}</p>
          : <p>{p?.from_number} {p?.customer_full_name ? ' - ' + p.customer_full_name : ''}</p>),
      },
      // {
      //   header: 'Trạng thái cuộc gọi',
      //   accessor: 'cause',
      // },
      {
        header: 'Thời gian bắt đầu cuộc gọi',
        accessor: 'time_started',
        classNameHeader: 'bw_text_center',
        formatter: (p) => moment.utc(p?.time_started)?.format('DD/MM/YYYY HH:mm'),
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Thời gian kết thúc cuộc gọi',
        accessor: 'time_ended',
        classNameHeader: 'bw_text_center',
        formatter: (p) => moment.utc(p?.time_ended)?.format('DD/MM/YYYY HH:mm'),
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Thời lượng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => `${p?.duration} s`,
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Đàm thoại',
        classNameHeader: 'bw_text_center',
        formatter: (p) => `${p?.billsec} s`,
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Ngắt máy',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (row) => {
          let msg, bg, classbg;
          if (row.direction == "outbound") {
            switch (row.sip_hangup_disposition) {
              case "send_bye":
                if (row.app == "dial") {
                  msg = 'MOBILE';
                  bg = "bg-info";
                  break;
                } else {
                  msg = 'Agent';
                  bg = "bg-warning";
                  break;
                }
              case "send_refuse":
                if (row.app == "dial") {
                  msg = 'MOBILE';
                  bg = "bg-info";
                  break;
                } else {
                  msg = 'Agent';
                  bg = "bg-warning";
                  break;
                }
              case "recv_cancel":
                if (row.app == "dial") {
                  msg = 'Agent';
                  bg = "bg-warning";
                  break;
                } else {
                  msg = 'MOBILE';
                  bg = "bg-info";
                  break;
                }
              case "recv_bye":
                if (row.app == "autocall" || row.app == "autodialer") {
                  msg = 'MOBILE';
                  bg = "bg-info";
                } else {
                  msg = 'Agent';
                  bg = "bg-warning";
                }
                break;
              default:
                msg = 'MOBILE';
                bg = "bg-info";
                break;
            }
          } else if (row.direction == "local") {
            if (row.status == "answered") {
              switch (row.sip_hangup_disposition) {
                case "send_bye":
                  msg = "Phía B";
                  bg = "bg-warning";
                  break;
                default:
                  msg = "Phía A";
                  bg = "bg-info";
                  break;
              }
            } else {
              switch (row.sip_hangup_disposition) {
                case "recv_bye":
                  msg = "Phía B";
                  bg = "bg-warning";
                  break;
                default:
                  msg = "Phía A";
                  bg = "bg-info";
                  break;
              }
            }
          } else {
            if (row.status == "answered") {
              switch (row.sip_hangup_disposition) {
                case "send_bye":
                  bg = "bg-info";
                  msg = 'Agent';
                  break;
                default:
                  msg = 'MOBILE';
                  bg = "bg-warning";
                  break;
              }
            } else {
              switch (row.sip_hangup_disposition) {
                case "recv_bye":
                  msg = 'MOBILE';
                  bg = "bg-warning";
                  break;
                default:
                  msg = 'Agent';
                  bg = "bg-info";
                  break;
              }
            }
          }

          if (bg === 'bg-warning') {
            classbg = 'bw_label_outline text-center bw_label_outline_warning'
          } else if (bg === 'bg-info') {
            classbg = 'bw_label_outline text-center bw_label_outline_primary'
          }
          return <span className={`${classbg}`}>{msg}</span>
        }
      },
      {
        header: 'Ngày thực hiện',
        accessor: 'function_name',
        classNameHeader: 'bw_text_center',
        formatter: (p) => moment.utc(p?.time_started)?.format('DD/MM/YYYY HH:mm'),
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Đánh giá cuộc gọi',
        accessor: 'rate',
        classNameHeader: 'bw_text_center',
        formatter: (p) => RateOptions[p?.rate],
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Đã liên hệ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => (
          <label
            className='bw_checkbox'
            style={{ marginRight: 0 }}
            onClick={async () => {
              if (!p.is_recall) {
                await recallUpdateVoip(p);
                onRefresh(p);
              }
            }}>
            <input type='checkbox' checked={p?.direction == 'outbound' ? true : p?.is_recall} disabled />
            <span />
          </label>
        ),
      },
      {
        header: 'Trạng thái cuộc gọi',
        accessor: 'status',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <p style={{ textTransform: 'uppercase' }}>{p?.status}</p>,
        classNameBody: 'bw_text_center',
      },
    ],
    [onRefresh],
  );

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-music-file',
        color: 'blue',
        permission: CDRS_PERMISSION.RECORD_LISTEN,
        hidden: (p) => !p?.recording_url,
        onClick: (p) => {
          setOpenRecord(p?.recording_url);
        },
      },
      {
        icon: 'fi fi-rr-cloud-download',
        color: 'blue',
        permission: CDRS_PERMISSION.RECORD_DOWNLOAD,
        hidden: (p) => !p?.recording_url,
        onClick: (p) => {
          downloadFileUrl(p?.recording_url, `${p?.id}.mp3`);
        },
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-out',
        type: 'success',
        outline: true,
        content: 'Export',
        onClick: () => handleExportExcel(),
        permission: 'EXPORT_HISTORY_CALL',
      },
    ];
  }, [params]);

  const title = (
    <ul className='bw_tabs'>
      <LabelOpt value={selectOpt}>
        Số cuộc gọi:
        ({selectOpt == IS_MISSED_CALL_OPTIONS.ALL ? totalItems : (selectOpt == IS_MISSED_CALL_OPTIONS.MISSED ? missed_counts : (totalItems - missed_counts))})
      </LabelOpt>
      {IS_MISSED_CALL.map((o) => {
        return (
          <li
            onClick={() => {
              setTabActive(o.value);
              onChangeParams({ is_missed: o?.value });
              setSelectOpt(o.value);
            }}
            className={tabActive === o.value ? 'bw_active' : ''}>
            <a className='bw_link'>
              {o?.label}
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <DataTable
        title={title}
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
        handleBulkAction={(e) => {
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteFunctionList(e.map((o) => o?.function_id));
                onRefresh();
              },
            ),
          );
        }}
      />
      {openRecord && <ModalAudio fileUrl={openRecord} onClose={() => setOpenRecord(undefined)} />}
    </>
  );
};

export default CDRsTable;
