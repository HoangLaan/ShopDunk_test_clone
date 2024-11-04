import React, { useState, useEffect } from "react";
import { createNoteVoip, getListNoteVoip } from 'services/voip.services';
import { Empty } from 'antd';
import { useSelector } from "react-redux";
import { showToast } from "utils/helpers";

const HistoryNote = () => {
  const { phone_number } = useSelector((state) => state.voidIp)
  const [note, setNote] = useState('')
  const [mess, setMess] = useState('')

  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 5
  });

  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const { items, page, totalPages, totalItems } = dataList;


  useEffect(() => {
    getListNoteVoip({ ...params, phone_number })
      .then(setDataList)
      .finally(() => {
      });
  }, [params, phone_number]);

  const onSubmit = async () => {
    try {
      const data = {
        note: note,
        phone_number: phone_number
      }
      if(!data?.note?.trim()){
        return setMess('Không được để trống!');
      } else setMess('')
      await createNoteVoip(data).then(() => {
        showToast.success('Thêm mới thành công')
      })
      .catch((err) => {
        showToast.error(err?.message)
      })
      getListNoteVoip({ ...params, phone_number }).then(setDataList);
      setNote('')
    } catch (error) {

    }
  }

  return <>
    <div className="bw_add_note">
      <h3 className="bw_mb_2">Ghi chú</h3>
      <textarea className="bw_inp" value={note} required onChange={(e) => {
        setNote(e?.target.value)
      }}></textarea>
      <span style={{color: 'red', fontSize: '12px'}}>{mess}</span>
      <div style={{textAlign: "right", marginTop: '5px'}}>
        <button onClick={() => {
          onSubmit()
        }} className="bw_btn_save_note">Lưu</button>
      </div>
    </div>
    <ul style={{border: '0.5px, solid, silver', padding: '10px'}}>
      {items.length > 0 ? (items ?? [])?.map((e, index) => {
        return <li className='bw_history__note' key={index}>
          <div>
            <span style={{color: '#0D93EC'}}>{e?.created_user} </span>
            <span> [{e?.created_date}]</span>
          </div>
          <div>{e?.note}</div>
        </li>
      }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </ul>
    <div style={{
      display: 'flex',
      justifyContent: 'end'
      // margin: '0 auto'
    }} className="bw_col_12">
      <div className="bw_nav_table">
        <span>{page} / {totalPages}</span>
        <button
          disabled={page === 1}
          onClick={(_) => {
            if (params !== 1) {
              setParams((prev) => ({
                ...prev,
                page: parseInt(page) - 1
              }))
            }
          }}
          className={page > 1 ? "bw_active" : ""}
        ><span className="fi fi-rr-angle-small-left">
          </span>
        </button>
        <button
          className={params?.page === totalPages ? '' : "bw_active"}
          onClick={(e) => {
            if (params?.page !== totalPages) {
              setParams((prev) => ({
                ...prev,
                page: parseInt(page) + 1
              }))
            }
          }}><span className="fi fi-rr-angle-small-right"></span></button>
      </div>
    </div >
  </>
}

export default HistoryNote