/* eslint-disable */
import ModalBase from 'pages/FileManager/common/ModalBase';
import arrowMove from 'pages/FileManager/assets/arrow-move.png';
import arrowColor from 'pages/FileManager/assets/arrowcolor.svg';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import fileManager from 'pages/FileManager/actions/file-manager';
import MoveBody from './move-file/MoveBody';
import { useDispatch, useSelector } from 'react-redux';

const ModalBaseStyled = styled(ModalBase)`
  .ant-modal-header {
    display: none !important;
  }
`;
const TitleModal = styled.div`
  display: flex;
  align-items: center;
`;
const MoveModal = ({ visible, defaultValue, dataColumn, onClose, onRefesh }) => {
  const dispatch = useDispatch();
  const { allItemsList } = useSelector(state => state.fileManager);
  const [params, setParams] = useState(undefined);
  const [parentParams, setParentParams] = useState(undefined);

  useEffect(() => {
    dispatch(
      fileManager.getAllItems({
        ...params,
        is_move: true,
        document_type_id: defaultValue?.document_type_id,
      },true),
    );
  }, [dispatch, defaultValue, params]);

  const title = (
    <TitleModal>
      <img onClick={() => {
        if (params?.directory_id) {
          setParams({
            document_type_id: allItemsList?.parentFolder?.document_type_id,
            directory_id: allItemsList?.pathArray?.parent_id,
          });
        }
        }} style={{ marginRight: '5px' }} src={params?.directory_id ? arrowColor : arrowMove}></img>{' '}
      {allItemsList?.parentFolder?.directory_name}
    </TitleModal>
  );

  return (
    <ModalBaseStyled showHeader title={title} visible={visible} onClose={onClose}>
      <MoveBody
        defaultValue={defaultValue}
        dataColumn={dataColumn}
        setParams={setParams}
        setParentParams={setParentParams}
        onClose={onClose}
        onRefesh={onRefesh}
      />
    </ModalBaseStyled>
  );
};

MoveModal.propTypes = {
  visible: PropTypes.bool,
  defaultValue: PropTypes.object,
  onRefresh: PropTypes.func,
  onClose: PropTypes.func,
};

MoveModal.defaultProps = {
  visible: false,
  defaultValue: {},
  onRefresh: () => {},
  onClose: () => {},
};

export default MoveModal;
