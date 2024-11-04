import React, { useState } from 'react';
import PropTypes from 'prop-types';
import WorkTypeTable from 'pages/Position/components/add/level/table/work-type/WorkTypeTable';
import { useFormContext } from 'react-hook-form';

const WorkTypeSelectModal = ({ field, onClose, handleAddWorkType }) => {
  const methods = useFormContext();
  const [dataSelect, setDataSelect] = useState([]);

  ///zone handle scroll effect for header position

  const styleModal = { marginLeft: '300px' };

  const headerStyles = {
    backgroundColor: 'white',
    borderBottom: '#ddd 1px solid',
    position: 'sticky',
    marginTop: '-20px',
    zIndex: '1',
    top: '-2rem',
    width: '50rem',
    marginLeft: '-20px',
    height: '4rem',
    zIndex: 2,
  };
  const titleModal = {
    marginLeft: '2rem',
    marginTop: '1rem',
  };
  const closeModal = {
    marginRight: '2rem',
    marginTop: '1rem',
  };
  ////end zone

  return (
    <div id='bw_skill' className='bw_modal bw_modal_open'>
      <div className='bw_modal_container bw_w800' style={styleModal}>
        <div className='bw_title_modal' style={headerStyles}>
          <h3 style={titleModal}>Danh sách loại công việc</h3>
          <span onClick={onClose} className='fi fi-rr-cross-small bw_close_modal' style={closeModal}></span>
        </div>

        <div className='bw_main_modal'>
          <WorkTypeTable field={field} onSelect={setDataSelect} handleAddWorkType={handleAddWorkType} />
        </div>
        <div className='bw_footer_modal'>
          <button
            type='button'
            className='bw_btn bw_btn_success'
            onClick={() => {
              methods.setValue(field, { ...dataSelect });
              onClose();
            }}>
            Chọn loại công việc
          </button>
          <button onClick={onClose} className='bw_btn_outline bw_close_modal'>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

WorkTypeSelectModal.propTypes = {
  field: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

WorkTypeSelectModal.defaultProps = {
  disabled: false,
};

export default WorkTypeSelectModal;
