import DataTable from 'components/shared/DataTable/index';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useDispatch } from 'react-redux';
import { msgError } from '../helpers/msgError';
import { showConfirmModal } from 'actions/global';
import CheckAccess from 'navigation/CheckAccess';
import { useFormContext } from 'react-hook-form';

dayjs.extend(customParseFormat);

const UsersTable = ({ data, handleDelete, isResetListUser }) => {
  const itemsPerPage = 6;
  const [page, setPage] = useState(1);
  const [dataList, setDataList] = useState([]);
  const { watch, setValue } = useFormContext();

  useEffect(() => {
    if (data.length > 0 && page === 1) {
      setDataList(data.slice(0, itemsPerPage));
    }
  }, [page, data]);

  useEffect(() => {
    if (isResetListUser) {
      setDataList([]);
    }
  }, [isResetListUser]);

  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_sticky bw_check_sticky bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p, idx) => <b className='bw_sticky bw_name_sticky'>{idx + 1}</b>,
      },
      {
        header: 'Nhân viên',
        formatter: (p) => (
          <p>
            {p?.user_name} - {p?.full_name}
          </p>
        ),
      },
      {
        header: 'Phòng ban',
        formatter: (p) => <b>{p?.department_name}</b>,
      },
      {
        header: 'Chức vụ',
        formatter: (p) => <b>{p?.position_name}</b>,
      },
    ],
    [],
  );

  const renderData = useCallback(
    (valueRender, keyRender) => (
      <tr>
        {columns?.map((column, key) => {
          if (column.formatter) {
            return (
              <td className={column?.classNameBody} key={`${keyRender}${key}`}>
                {column?.formatter(valueRender, keyRender)}
              </td>
            );
          } else if (column.accessor) {
            return (
              <td className={column?.classNameBody} key={`${keyRender}${key}`}>
                {valueRender[column.accessor]}
              </td>
            );
          } else {
            return <td className={column?.classNameBody} key={`${keyRender}${key}`}></td>;
          }
        })}

        <td className='bw_sticky bw_action_table bw_text_center'>
          <CheckAccess permission={'HR_USER_SCHEDULE_EDIT'}>
            <a
              onClick={() =>
                dispatch(
                  showConfirmModal(msgError['model_error'], async () => {
                    handleDelete('user', valueRender?.user_name);
                  }),
                )
              }
              style={{
                marginRight: '2px',
              }}
              className={`bw_btn_table bw_red`}>
              <i className={`fi fi-rr-trash`}></i>
            </a>
          </CheckAccess>
        </td>
      </tr>
    ),
    [columns],
  );

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'HR_USER_SCHEDULE_DELETE',
        onClick: (p, index) => {
          const users = { ...(watch('user') ?? {}) };
          delete users[p.user_name];
          setValue('user', users);
        },
      },
    ];
  }, []);

  return (
    <div className='bw_table_responsive'>
      {/* <table className='bw_table'>
        <thead>
          {columns?.map((p, idx) => (
            <th key={idx} className={p?.classNameHeader}>
              {p?.header}
            </th>
          ))}
          <th className='bw_sticky bw_action_table bw_text_center' style={{ width: '10%' }}>
            Thao tác
          </th>
        </thead>

        <tbody>
          {data.length ? (
            data?.map((value, key) => {
              return renderData(value, key);
            })
          ) : (
            <tr>
              <td colSpan={4} className='bw_text_center'>
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table> */}

      <DataTable
        actions={actions}
        noSelect={true}
        data={dataList}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={data.length}
        totalPages={Math.ceil(data.length / itemsPerPage)}
        columns={columns}
        onChangePage={(page) => {
          setPage(page);
          setDataList(data.slice((page - 1) * itemsPerPage, page * itemsPerPage));
        }}
      />
    </div>
  );
};

export default UsersTable;
