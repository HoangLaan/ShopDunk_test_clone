import BWAccordion from 'components/shared/BWAccordion';
import DataTable from 'components/shared/DataTable/index';
import Modal from 'components/shared/Modal/index';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getListBrokenShift } from '../../helpers/call-api';
import BWImage from 'components/shared/BWImage';

function ModalBrokenShift({ open, onClose, keepingBrokenShift }) {
    console.log('keepingBrokenShift',keepingBrokenShift)
    const dataKeepingBrokenShift = useMemo(() => {
      if(keepingBrokenShift && !Array.isArray(keepingBrokenShift)){
        keepingBrokenShift = [keepingBrokenShift]
      }
      return keepingBrokenShift;
    }, [keepingBrokenShift])

    const {
      user_name,
      user_fullname,
      shift_name,
      shift_id,
      shift_date
    } = useMemo(() => dataKeepingBrokenShift[0], [dataKeepingBrokenShift])

  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 5,
    shift_ids: dataKeepingBrokenShift.length === 1 ? shift_id : dataKeepingBrokenShift.map(item => item.shift_id)?.join(","),
    user_name,
    shift_date
  });
  console.log('params',params)
  const [listBrokenShift, setListBrokenShift] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  console.log('listBrokenShift',listBrokenShift)
  const loadListBrokenShift = useCallback(() => {
    getListBrokenShift(params).then(setListBrokenShift)
  }, [params]);

  const { items, itemsPerPage, page, totalItems, totalPages } = listBrokenShift;

  useEffect(() => {
    loadListBrokenShift();
  }, [loadListBrokenShift]);


  const style_img = useMemo(() => ({
    width: '15px',
    height: '15px',
    border: '1px solid black',
    borderRadius: '10px',
  }), [])
  const columns = useMemo(
    () => [
       {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1
      },
      {
        header: 'Chấm công vào',
        classNameHeader: 'bw_text_center',
        accessor: 'time_start',
        formatter: (d) => {
          return (
            <>
              <BWImage style={style_img} src={d.img_checkin} /> {d.time_start}
            </>
          )
        }
      },
      {
        header: 'Chấm công ra giữa giờ',
        classNameHeader: 'bw_text_center',
        accessor: 'time_end',
        formatter: (d) => {
          return (
            <>
              <BWImage style={style_img} src={d.img_checkout_break_time} /> {d.check_out_break_time}
            </>
          )
        }
      },
      {
        header: 'Chấm công vào giữa giờ',
        classNameHeader: 'bw_text_center',
        accessor: 'time_end',
        formatter: (d) => {
          return (
            <>
              <BWImage style={style_img} src={d.img_checkin_break_time} /> {d.check_in_break_time}
            </>
          )
        }
      },
      {
        header: 'Chấm công ra',
        classNameHeader: 'bw_text_center',
        accessor: 'time_end',
        formatter: (d) => {
          return (
            <>
              <BWImage style={style_img} src={d.img_checkout} /> {d.time_end}
            </>
          )
        }
      },
      {
        header: 'Tên cửa hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'store_name',
      },
      {
        header: 'Địa chỉ',
        classNameHeader: 'address',
        formatter: (d, index) => `${d.district_name}, ${d.ward_name}`
      },
      {
        header: 'Khu vực',
        classNameHeader: 'bw_text_center',
        accessor: 'area_name',
      },
    ],
    [],
  );

  return (
    <>
    {dataKeepingBrokenShift.length === 1 ? 
    <Modal
    witdh={'75%'}
    open={open}
    onClose={onClose}
    header='Chi tiết ca gãy'
    >
      <BWAccordion title='Thông tin nhân viên'>
        <div className='bw_row '>
          <div className='bw_col_6 bw_inf_pro'>
            <b>{user_fullname}</b>
          </div>
          <div className='bw_col_6 bw_tex_left'>
            <b>Ca làm việc</b><br/> 
            <span className='bw_ml_2'>{shift_name}</span>
          </div>
        </div>
      </BWAccordion>
      
    <DataTable
      title={'Lịch sử chấm công vào - ra theo cửa hàng'}
      noSelect={true}
      columns={columns}
      data={items}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={(page) => {
        setParams({
          ...params,
          page,
        });
      }}
    />
  </Modal>
  :
  <DataTable
      title={'Lịch sử chấm công vào - ra theo cửa hàng'}
      noSelect={true}
      columns={columns}
      data={items}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={(page) => {
        setParams({
          ...params,
          page,
        });
      }}
    />
    }
    </>
    
  );
}

export default ModalBrokenShift;
