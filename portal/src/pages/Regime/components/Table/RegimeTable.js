import React, {Fragment, useMemo} from 'react';
import {useDispatch} from 'react-redux';
import {isArray} from 'lodash';
import DataTable from 'components/shared/DataTable/index';
import ICON_COMMON from 'utils/icons.common';
import {showConfirmModal} from 'actions/global';
import {deleteById} from "services/regime.service";

const COLUMN_ID = 'regime_id';
const RegimeTable = ({loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh}) => {
  const dispatch = useDispatch();

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter:((_,i) => {
          return i+1;
        })
      },
      {
        header: 'Tên dăng ký hưởng chế độ',
        accessor: 'regime_name'
      },
      {
        header: 'Loại chế độ',
        accessor: 'regime_type_name'
      },
      {
        header: 'Nhân viên đăng ký',
        accessor: 'created_user',
      },
      {
        header: 'Bắt đầu',
        accessor: 'from_date',
      },
      {
        header: 'Kết thúc',
        accessor: 'to_date',
      },
      {
        header: 'Trạng thái duyệt',
        formatter: (p) => {
          return isArray(p.review_info) ? p.review_info.map((item) => {
            return <div>
              {item.is_review ? (
              <span class='bw_label_outline bw_label_outline_success bw_mw_2 text-center mt-10'>Đã duyệt</span>
              ) : (
              <span class='bw_label_outline bw_label_outline_danger text-center mt-10'>Chưa duyệt</span>
              )}
              <span>{item?.user_review}</span>
            </div>
          }) : null
        }
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
        permission: "HR_REGIME_ADD",
        onClick: () => window._$g.rdr('/regime/add'),
      },
      {
        icon: ICON_COMMON.edit,
        color: 'blue',
        permission: "HR_REGIME_EDIT",
        onClick: (p) => window._$g.rdr(`/regime/edit/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.view,
        color: 'green',
        permission: "HR_REGIME_VIEW",
        onClick: (p) => window._$g.rdr(`/regime/detail/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: "HR_REGIME_DEL",
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteById([p?.[COLUMN_ID]]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, []);

  return (
    <Fragment>
      <DataTable
        fieldCheck={COLUMN_ID}
        loading={loading}
        columns={columns}
        data={data}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        noSelect={true}
        totalItems={totalItems}
        onChangePage={onChangePage}
      />
    </Fragment>
  );
};

export default RegimeTable;
