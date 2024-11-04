import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from 'components/shared/DataTable/index';
import { convertSecondsToHMS } from '../utils/helpers'

const CDRsTable = ({ params, loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, handleExportExcel, onRefresh }) => {

  const columns = useMemo(() => {
    if (params.type_report === "/v3/report/call/user") {
      return [
        {
          header: 'Tên',
          accessor: 'first_name',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Tên tài khoản',
          accessor: 'username',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Line',
          accessor: 'extension',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Email',
          accessor: 'email',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Khoảng thời gian',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          formatter: (p) => <span>{convertSecondsToHMS(p?.total_duration)}</span>,
        },
        {
          header: 'Đàm thoại',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          formatter: (p) => <span>{convertSecondsToHMS(p?.total_billsec)}</span>,
        },
        {
          header: 'Đã trả lời',
          accessor: 'total_answered',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Không trả lời',
          accessor: 'total_no_answered',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Đường dây bận',
          accessor: 'total_busy_line',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Bận',
          accessor: 'total_busy',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Không có sẵn',
          accessor: 'total_not_available',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Thất bại',
          accessor: 'total_failed',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Phản hồi bằng giọng nói',
          accessor: 'total_ivr',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Huỷ bỏ',
          accessor: 'total_cancel',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Thư thoại',
          accessor: 'total_voicemail',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Số không hợp lệ',
          accessor: 'total_invalid_number',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Chặn cuộc gọi',
          accessor: 'total_phone_block',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Tắt nghẽn',
          accessor: 'total_congestion',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Gọi vào',
          accessor: 'total_inbound',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Gọi ra',
          accessor: 'total_outbound',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Nội bộ',
          accessor: 'total_local',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Tổng cộng',
          accessor: 'total_call',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
      ]
    } else if (params.type_report === "/v3/report/call/extension") {
      return [
        {
          header: 'Tên',
          accessor: 'first_name',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Tên tài khoản',
          accessor: 'username',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Line',
          accessor: 'extension',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Đã trả lời',
          accessor: 'total_answered',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Không trả lời',
          accessor: 'total_no_answered',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Đường dây bận',
          accessor: 'total_busy_line',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Bận',
          accessor: 'total_busy',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Không có sẵn',
          accessor: 'total_not_available',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Thất bại',
          accessor: 'total_failed',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Phản hồi bằng giọng nói',
          accessor: 'total_ivr',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Huỷ bỏ',
          accessor: 'total_cancel',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Thư thoại',
          accessor: 'total_voicemail',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Số không hợp lệ',
          accessor: 'total_invalid_number',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Chặn cuộc gọi',
          accessor: 'total_phone_block',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Tắt nghẽn',
          accessor: 'total_congestion',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Gọi vào',
          accessor: 'total_inbound',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Gọi ra',
          accessor: 'total_outbound',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Nội bộ',
          accessor: 'total_local',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Tổng cộng',
          accessor: 'total_call',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        }
      ]
    } else if (params.type_report === "/v3/report/call/extension/summary") {
      return [
        {
          header: 'Tên',
          accessor: 'first_name',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Tên tài khoản',
          accessor: 'username',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Line',
          accessor: 'extension',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Tổng cộng',
          accessor: 'total_call',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Đã trả lời',
          accessor: 'total_answered',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Không trả lời',
          accessor: 'total_no_answered',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Đường dây bận',
          accessor: 'total_busy_line',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Bận',
          accessor: 'total_busy',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Không có sẵn',
          accessor: 'total_not_available',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Thất bại',
          accessor: 'total_failed',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Phản hồi bằng giọng nói',
          accessor: 'total_ivr',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Huỷ bỏ',
          accessor: 'total_cancel',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Thư thoại',
          accessor: 'total_voicemail',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Số không hợp lệ',
          accessor: 'total_invalid_number',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Chặn cuộc gọi',
          accessor: 'total_phone_block',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Tắt nghẽn',
          accessor: 'total_congestion',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Gọi vào',
          accessor: 'total_inbound',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Gọi ra',
          accessor: 'total_outbound',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Nội bộ',
          accessor: 'total_local',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Phòng',
          accessor: 'departments',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Tên nhóm',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          formatter: (p) => {
            const groupName = Array.isArray(p?.groups) ? p?.groups[0]?.group_name : null;
            return <span>{groupName}</span>;
          }
        },
        {
          header: 'Bộ phận trưởng',
          accessor: 'leaders',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Quản lý',
          accessor: 'managers',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
      ]
    } else if (params.type_report === "/v3/report/call/extension/summary/day") {
      const topColumns = [
        {
          header: 'Tên',
          accessor: 'first_name',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Tên tài khoản',
          accessor: 'username',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Line',
          accessor: 'extension',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Thời gian tạo',
          accessor: 'add_date',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          formatter: (p) => moment(p?.add_date)?.format('DD/MM/YYYY HH:mm'),
        },
        {
          header: 'Tổng số cuộc gọi',
          accessor: 'total_calls',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Phòng ban',
          accessor: 'departments',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Tên nhóm',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          formatter: (p) => {
            const groupName = p?.groups?.length > 0 ? p.groups[0].group_name : null;
            return <span>{groupName}</span>;
          },
        },
        {
          header: 'Trưởng bộ phận',
          accessor: 'leaders',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Quản lý',
          accessor: 'managers',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Đã trả lời',
          accessor: 'total_answered',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Không trả lời',
          accessor: 'total_no_answered',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Đường dây bận',
          accessor: 'total_busy_line',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Bận',
          accessor: 'total_busy',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Không có sẵn',
          accessor: 'total_not_available',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Thất bại',
          accessor: 'total_failed',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Phản hồi bằng giọng nói',
          accessor: 'total_ivr',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Huỷ bỏ',
          accessor: 'total_cancel',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Thư thoại',
          accessor: 'total_voicemail',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Số không hợp lệ',
          accessor: 'total_invalid_number',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Chặn cuộc gọi',
          accessor: 'total_phone_block',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Tắt nghẽn',
          accessor: 'total_congestion',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Gọi vào',
          accessor: 'total_inbound',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Gọi ra',
          accessor: 'total_outbound',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Nội bộ',
          accessor: 'total_local',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Tổng cộng',
          accessor: 'total_call',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        }
      ]
      const allReports = data.flatMap((item) => item.reports || []);
      // Lấy tất cả các ngày từ reports
      const allDates = [...new Set(allReports.map((times) => times.time))];
      // Tạo dynamicColumns dựa trên tất cả các ngày
      const dynamicColumns = allDates.map((date) => {
        debugger
        return {
          header: new Date(date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          formatter: (rowData) => {
            const reportForDate = rowData?.reports?.find((times) => times.time === date);
            const totalCall = reportForDate?.total_call || 0;
            return <span>{totalCall}</span>;
          },
        };
      });
      return [...topColumns, ...dynamicColumns,];
    } else if (params.type_report === "/v3/report/call/agent/detail") {
      return [
        {
          header: 'Thời gian',
          accessor: 'time',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          formatter: (p) => moment(p?.time)?.format('DD/MM/YYYY HH:mm'),
        },
        {
          header: 'Tên',
          accessor: 'first_name',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Tên tài khoản',
          accessor: 'username',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Cuộc gọi đầu tiên',
          accessor: 'first_call',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          formatter: (p) => {
            if (p?.first_call && p.first_call.startsWith('0001-01-01T')) {
              return null;
            } else {
              return moment(p?.first_call)?.format('DD/MM/YYYY HH:mm');
            }
          },
        },
        {
          header: 'Cuộc gọi cuối cùng',
          accessor: 'last_call',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          formatter: (p) => {
            if (p?.last_call && p.last_call.startsWith('0001-01-01T')) {
              return null;
            } else {
              return moment(p?.last_call)?.format('DD/MM/YYYY HH:mm');
            }
          },
        },
        {
          header: 'Billsec',
          accessor: 'total_billsec',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          formatter: (p) => <span>{convertSecondsToHMS(p?.total_billsec)}</span>,
        },
        {
          header: 'Tổng cộng',
          accessor: 'total_call',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Đã trả lời',
          accessor: 'total_answered',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Kết nối khách hàng',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          formatter: (p) => {
            return <span>{(+p?.ratio_connected || 0).toFixed(2)} %</span>
          }
        },
      ]

    } else if (params.type_report === "/v3/report/call/agent/time") {
      return [
        {
          header: 'Tên',
          accessor: 'first_name',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Tên tài khoản',
          accessor: 'username',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Đã gọi',
          accessor: 'email',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Thời gian',
          accessor: 'email',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Nói chuyện',
          accessor: 'total_talk_sec',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Nói chuyện trung bình',
          accessor: 'total_talk_sec',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Bố trí',
          accessor: 'total_dispo_sec',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Bố trí trung bình',
          accessor: 'total_dispo_sec',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
      ]

    } else if (params.type_report === "/v3/report/campaign-type/autodialer") {
      return [
        {
          header: 'Ngày gọi',
          accessor: 'call_date',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          formatter: (p) => moment(p?.call_date)?.format('DD/MM/YYYY HH:mm'),
        },
        {
          header: 'Tổng số cuộc gọi',
          accessor: 'total_call',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Đã trả lời',
          accessor: 'answered',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Đánh giá trả lời',
          accessor: 'answered_rated',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Không có Agent trả lời',
          accessor: 'answered_no_agent',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Không có Agent trả lời đánh giá',
          accessor: 'answered_no_agent_rated',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Bận',
          accessor: 'busy',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Đánh giá bận',
          accessor: 'busy_rated',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Không khả dụng',
          accessor: 'not_available',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Đánh giá không khả dụng',
          accessor: 'not_available_rated',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
      ]

    } else if (params.type_report === "/v3/report/call/agent/performance-with-customer") {
      return [
        {
          header: 'Tên nhóm',
          accessor: 'group_name',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Tên',
          accessor: 'first_name',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Tổng KH đã gọi',
          accessor: 'total_customer_called',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Tổng số cuộc gọi',
          accessor: 'total_call',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Tổng số cuộc gọi kết nối',
          accessor: 'total_call_connected',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '% kết nối',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          formatter: (p) => {
            const formattedRatio = +p?.total_call_connected / p?.total_call * 100
            return <span>{Math.round(formattedRatio) || 0} %</span>
          }
        },
        {
          header: 'Tổng số cuộc gọi kết nối trên khách hàng',
          accessor: 'total_call_answered',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '% Số cuộc gọi kết nối trên KH',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          formatter: (p) => {
            const formattedRatio = +p?.total_call_answered / p?.total_customer_called * 100
            return <span>{Math.round(formattedRatio) || 0} %</span>
          }
        },
        {
          header: 'Thời gian đàm thoại',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          formatter: (p) => <span>{convertSecondsToHMS(p?.total_billsec)}</span>,
        },
        {
          header: 'Thời Gian Đổ Chuông',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          formatter: (p) => <span>{convertSecondsToHMS(p?.total_waitsec)}</span>,
        },
      ]
    } else if (params.type_report === "/v3/report/call/tracking-time/agent") {
      return [
        {
          header: 'Tên',
          accessor: 'username',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '<=07:30',
          accessor: 'talk_time_smaller07h30',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '08:00',
          accessor: 'talk_time08h00',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '08:30',
          accessor: 'talk_time08h30',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '09:00',
          accessor: 'talk_time09h00',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '09:30',
          accessor: 'talk_time09h30',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '10:00',
          accessor: 'talk_time10h00',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '10:30',
          accessor: 'talk_time10h30',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '11:00',
          accessor: 'talk_time11h00',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '11:30',
          accessor: 'talk_time11h30',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '12:00',
          accessor: 'talk_time12h00',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '12:30',
          accessor: 'talk_time12h30',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '13:00',
          accessor: 'talk_time13h00',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '13:30',
          accessor: 'talk_time13h30',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '14:00',
          accessor: 'talk_time14h00',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '14:30',
          accessor: 'talk_time14h30',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '15:00',
          accessor: 'talk_time15h00',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '15:30',
          accessor: 'talk_time15h30',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '16:00',
          accessor: 'talk_time16h00',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '16:30',
          accessor: 'talk_time16h30',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '17:00',
          accessor: 'talk_time17h00',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '17:30',
          accessor: 'talk_time17h30',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '18:00',
          accessor: 'talk_time18h00',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '18:30',
          accessor: 'talk_time18h30',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '19:00',
          accessor: 'talk_time19h00',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: '>19:30',
          accessor: 'talk_time_greater19h30',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
        {
          header: 'Tổng cộng',
          accessor: 'total',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
        },
      ];
    }
    return [];
  }, [params, data]);

  const actions = useMemo(() => {
    if (params.type_report === "/v3/report/call/user") {
      return [
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
    } else if (params.type_report === "/v3/report/call/extension") {
      return [
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
    } else if (params.type_report === "/v3/report/call/extension/summary") {
      return [
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
    } else if (params.type_report === "/v3/report/call/extension/summary/day") {
      return [
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
    } else if (params.type_report === "/v3/report/call/agent/detail") {
      return [
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
    } else if (params.type_report === "/v3/report/call/agent/time") {
      return [
        // {
        //   globalAction: true,
        //   icon: 'fi fi-rr-inbox-out',
        //   type: 'success',
        //   outline: true,
        //   content: 'Export',
        //   onClick: () => handleExportExcel(),
        //   permission: 'EXPORT_HISTORY_CALL',
        // },
      ];
    } else if (params.type_report === "/v3/report/campaign-type/autodialer") {
      return [
        // {
        //   globalAction: true,
        //   icon: 'fi fi-rr-inbox-out',
        //   type: 'success',
        //   outline: true,
        //   content: 'Export',
        //   onClick: () => handleExportExcel(),
        //   permission: 'EXPORT_HISTORY_CALL',
        // },
      ];
    } else if (params.type_report === "/v3/report/call/agent/performance-with-customer") {
      return [
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
    } else if (params.type_report === "/v3/report/call/tracking-time/agent") {
      return [
        // {
        //   globalAction: true,
        //   icon: 'fi fi-rr-inbox-out',
        //   type: 'success',
        //   outline: true,
        //   content: 'Export',
        //   onClick: () => handleExportExcel(),
        //   permission: 'EXPORT_HISTORY_CALL',
        // },
      ];
    }
    return [];
  }, [params, handleExportExcel]);

  return (
    <>
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
      />
    </>
  );
};

export default CDRsTable;
