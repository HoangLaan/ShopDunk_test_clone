/* eslint-disable */
import ModalBase from 'pages/FileManager/common/ModalBase';
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import share from 'pages/FileManager/assets/share.svg';
import ShareFileBody from 'pages/FileManager/child-components/modal/share-file/ShareFileBody';

const ModalBaseStyled = styled(ModalBase)`
  .ant-modal-header {
    display: none !important;
  }
`;
const TitleModal = styled.div`
  display: flex;
  align-items: center;
`;

const ShareModal = (
    { 
      visiable, 
      defaultValue, 
      onClose, 
      onRefesh 
    }) => {

  // const loadAllItemsList = useCallback(() => {
  //   if (visible && dataColumn) {
  //     dispatch(fileManager.getAllItems(params || dataColumn?.parentFolder));
  //   }
  // }, [dispatch, params, visible, dataColumn]);
  // useEffect(loadAllItemsList, [loadAllItemsList]);

  const title = (
    <TitleModal>
      <img style={{ marginRight: '5px' }} src={share}></img> Chia sẻ với mọi người
    </TitleModal>
  );

  return (
    <ModalBaseStyled 
      showHeader 
      width="750px" 
      title={title} 
      visible={visiable} 
      onClose={onClose}>
        <ShareFileBody 
            defaultValue={defaultValue} 
            onClose={onClose} 
            onRefesh={onRefesh} 
        />
    </ModalBaseStyled>
  );
};

ShareModal.propTypes = {
  visible: PropTypes.bool,
  defaultValue: PropTypes.object,
  onRefresh: PropTypes.func,
  onClose: PropTypes.func,
};

ShareModal.defaultProps = {
  visible: false,
  defaultValue: {},
  onRefresh: () => {},
  onClose: () => {},
};

export default ShareModal;
