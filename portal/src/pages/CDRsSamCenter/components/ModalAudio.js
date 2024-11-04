/* eslint-disable react/style-prop-object */
import React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

function ModalAudio({ onClose, fileUrl }) {
  return (
    <div className='bw_modal bw_modal_open' id='bw_modal_review'>
      <div className='bw_modal_container bw_w500'>
        <div className='bw_title_modal'>
          <h3>Nghe file ghi âm</h3>
          <span className='fi fi-rr-cross-small bw_close_modal' onClick={onClose}>
          </span>
        </div>
        <AudioPlayer
          autoPlay
          src={fileUrl}
        // other props here
        />
      </div>
    </div>
  );
}

export default ModalAudio;
