import { showConfirmModal } from 'actions/global';
import i__callGen from 'assets/bw_image/i__callGen.svg';
import DataTable from 'components/shared/DataTable/index';
import { useAuth } from 'context/AuthProvider';
import { PERMISSION } from 'pages/Customer/utils/constants';
import { useCustomerContext } from 'pages/Customer/utils/context';
import ModalZalo from 'pages/CustomerCare/components/Modals/ModalZalo';
import { callPhone } from 'pages/VoidIp/utils/helpers';
import { Fragment, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteCustomer, deleteListCustomer, getListCustomerOptimal } from 'services/customer.service';
import CareActions from '../common/CareActions';
import ModalImport from '../modals/ModalImport';
import ModalSelectAll from '../modals/ModalSelectAll';
import ModalSendMail from '../modals/ModalSendMail';
import ModalSendSMS from '../modals/ModalSendSMS';

let isStopLoadedData = false;

const style = {
  display: 'flex',
  width: 'max-content',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
};

const CustomerTable = ({
  loading,
  data,
  params,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChange,
  onRefresh,
  exportExcel,
}) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { openModalImport, isOpenModalImport } = useCustomerContext();
  const [openModal, setOpenModal] = useState(false);
  const [openModalSMS, setOpenModalSMS] = useState(false);
  const [isOpenModalZalo, setIsOpenModalZalo] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [openModalSelectAll, setOpenModalSelectAll] = useState(false);
  const [tableKey, setTableKey] = useState(0);
  const [loadedData, setLoadedData] = useState([]);
  isStopLoadedData = !openModalSelectAll;

  const onChangePage = (page) => onChange({ page });
  const onChangeStatus = (task_status) => onChange({ task_status });

  const importExcel = () => {
    openModalImport(true);
  };
  const columns = useMemo(
    () => [
      {
        header: 'Mã khách hàng',
        accessor: 'customer_code',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.customer_code ?? 'Chưa cập nhật'}</b>,
      },
      {
        header: 'Tên khách hàng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b>{p?.full_name}</b>,
      },
      {
        header: 'Hạng khách hàng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b>{p?.customer_type_name}</b>,
      },
      {
        header: 'Giới tính',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <p>{p?.gender ? (p?.gender === 1 ? 'Nam' : 'Nữ') : 'N/A'}</p>,
      },
      {
        header: 'Ngày sinh',
        classNameHeader: 'bw_text_center',
        accessor: 'birth_day',
      },
      {
        header: 'Số điện thoại',
        classNameHeader: 'bw_text_center',
        accessor: 'phone_number',
        formatter: (p) =>
          p.phone_number && (
            <div style={style}>
              <p>{p?.phone_number} </p>
              {user.isAdministrator || (!user.isAdministrator && user.voip_ext) ? (
                <img
                  onClick={() => callPhone(p?.phone_number)}
                  src={i__callGen}
                  style={{ width: '30px', cursor: 'pointer' }}
                  alt=''
                />
              ) : (
                ''
              )}
            </div>
          ),
      },
      {
        header: 'Nguồn khách hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'source_name',
      },
      {
        header: 'Địa chỉ',
        classNameHeader: 'bw_text_center',
        accessor: 'address_full',
      },
      {
        header: 'Trạng thái CSKH',
        accessor: 'current_wflow_name',
      },
      // {
      //   header: 'Trạng thái',
      //   classNameHeader: 'bw_text_center',
      //   classNameBody: 'bw_text_center',
      //   formatter: (p) =>
      //     p?.is_active ? (
      //       <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
      //     ) : (
      //       <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
      //     ),
      // },
    ],
    [],
  );
  console.log('loaddata', loadedData);
  const actions = [
    {
      globalAction: true,
      icon: 'fi fi-rr-inbox-out mr-2',
      type: 'success',
      outline: true,
      content: 'Xuất excel',
      permission: PERMISSION.EXPORT,
      onClick: () => exportExcel(),
    },
    {
      globalAction: true,
      icon: 'fi fi-rr-inbox-in mr-2',
      type: 'outline',
      className: 'bw_btn_outline_success',
      content: 'Nhập excel',
      permission: PERMISSION.EXPORT,
      onClick: () => importExcel(),
    },
    {
      globalAction: true,
      icon: 'fa fa-street-view',
      type: 'success',
      outline: true,
      content: 'Chọn tất cả',
      onClick: async () => {
        try {
          setOpenModalSelectAll(true);
          const result = [];
          const updateResult = (newArray = []) => {
            for (let i = 0; i < newArray.length; i++) {
              // const indexMemberId = result.findIndex((x) => x?.phone_number === newArray[i]?.phone_number);
              // if (indexMemberId === -1) {
              // }
              result.push(newArray[i]);
            }
            setLoadedData([...result]);
            setTableKey((prev) => ++prev);
          };
          const firstRes = await getListCustomerOptimal({ ...params, is_active: 1, page: 1, itemsPerPage: 250 });
          updateResult(firstRes.items);

          for (let page = 2; page <= firstRes.totalPages; page++) {
            if (isStopLoadedData) {
              continue;
            }
            const pageRes = await getListCustomerOptimal({ ...params, is_active: 1, page, itemsPerPage: 250 });
            updateResult(pageRes?.items || []);
          }
        } catch (error) {
        } finally {
        }
      },
    },
    {
      globalAction: true,
      icon: 'fi fi-rr-plus',
      type: 'success',
      content: 'Thêm mới',
      permission: PERMISSION.ADD,
      onClick: () => window._$g.rdr(`/customer/add?tab_active=information`),
    },
  ];

  const actionsTable = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: PERMISSION.EDIT,
        onClick: (p) => window._$g.rdr(`/customer/edit/${p?.member_id}?tab_active=information`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: PERMISSION.VIEW,
        onClick: (p) => window._$g.rdr(`/customer/detail/${p?.member_id}?tab_active=information`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: PERMISSION.DEL,
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteCustomer(p?.member_id);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, []);
  return (
    <Fragment>
      <CareActions
        openModalSendMail={() => setOpenModal(true)}
        openModalSendSMS={() => setOpenModalSMS(true)}
        setIsOpenModalZalo={setIsOpenModalZalo}
        selectedCustomer={selectedCustomer}
        params={params}
        actions={actions}
        onChangeStatus={onChangeStatus}
        totalItems={totalItems}
      />
      <DataTable
        loading={loading}
        columns={columns}
        data={data}
        actions={actionsTable}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
        key={tableKey}
        defaultDataSelect={selectedCustomer}
        onChangeSelect={setSelectedCustomer}
        handleBulkAction={async (e) => {
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteListCustomer(e.map((o) => o.member_id));
                onRefresh();
              },
            ),
          );
        }}
      />
      {openModal && (
        <ModalSendMail
          selectedCustomer={selectedCustomer}
          onClose={() => {
            setOpenModal(false);
          }}
        />
      )}
      {openModalSMS && <ModalSendSMS selectedCustomer={selectedCustomer} onClose={() => setOpenModalSMS(false)} />}
      {isOpenModalImport && <ModalImport onRefresh={onRefresh} />}
      {isOpenModalZalo && (
        <ModalZalo selectedCustomer={selectedCustomer} onClose={() => setIsOpenModalZalo(false)} customer={{}} />
      )}
      {openModalSelectAll && (
        <ModalSelectAll
          loadedData={loadedData}
          totalItems={totalItems}
          onClose={() => {
            setOpenModalSelectAll(false);
            setLoadedData([]);
          }}
          onConfirm={() => {
            setSelectedCustomer(loadedData);
            setLoadedData([]);
            setTableKey((prev) => ++prev);
            setOpenModalSelectAll(false);
            isStopLoadedData = true;
          }}
        />
      )}
    </Fragment>
  );
};

export default CustomerTable;
