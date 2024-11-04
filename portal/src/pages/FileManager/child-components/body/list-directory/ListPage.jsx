import React, {useState, useCallback, useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Breadcrumb from './Breadcrumb';
import ChildSection from 'pages/FileManager/child-components/body/list-directory/ChildSection';
import {Col, Row} from 'antd';
import DetailFile from '../directory/DetailFile';
import {useDispatch, useSelector} from 'react-redux';
import trash from 'pages/FileManager/assets/trash.svg';
import move from 'pages/FileManager/assets/move.svg';
import share from 'pages/FileManager/assets/share.svg';
import usersmall from 'pages/FileManager/assets/usersmall.svg';
import ConfirmDeleteModal from '../../modal/ConfirmDeleteModal';
import fileManager from 'pages/FileManager/actions/file-manager';
import EditNameDirectoryModal from '../../modal/EditNameDirectory';
import MoveModal from '../../modal/MoveModal';
import {EditOutlined} from '@ant-design/icons';
import ShareModal from '../../modal/ShareModal';

const Wrapper = styled.div`
  width: 100%;
  height: 90%;
  background-color: white;
  margin-right: 5px !important;
`;
const Container = styled(Row)`
  height: 100%;
`;

const BodyDir = styled(Col)`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    border-radius: 3px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const Header = styled.div``;

const Manipulation = styled.div``;

const IndexSearch = styled.div`
  width: 100%;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  border-bottom: ${props => (props.hideLine ? '1px solid #ccc' : '0px')};
`;

const StyledEdit = styled(EditOutlined)`
  margin-top: 5px;
  margin-right: 12px;
`;

const Icon = styled.img`
  font-size: 16px;
  margin-right: 18px;
  cursor: pointer;
`;

const loading = (
  <div class="d-flex justify-content-center">
    <div class="spinner-border" role="status"></div>
  </div>
);

const ListPage = ({handleRefresh, filterSearch}) => {
  const {searchAllList, searchAllLoading, allItemsList, informationFileData} = useSelector(state => state.fileManager);
  const {items: itemsSearchAllList, totalItems: totalSearchAllList} = searchAllList;
  const {items: itemsAllList} = allItemsList;

  const [activeChildSection, setActiveChildSection] = useState(undefined);
  const [dataActive, setDataActive] = useState(undefined);
  const [viewFolder, setViewFolder] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalMove, setModalMove] = useState(false);
  const [modalEditFolder, setModalEditFolder] = useState(false);
  const [modalUpload, setModalUpload] = useState(false);
  const [modalShare, setModalShare] = useState(false);

  useEffect(() => {
    if (searchAllList) {
      setViewFolder(false);
    }
  }, [searchAllList]);

  const items = useMemo(
    () => (viewFolder ? itemsAllList : itemsSearchAllList),
    [viewFolder, itemsAllList, itemsSearchAllList],
  );

  const handleActiveChildSection = (index, data) => {
    setActiveChildSection(index);
    setDataActive(data);
  };

  const handleClose = () => {
    setModalEditFolder(false);
    setModalDelete(false);
    setModalMove(false);
    setModalUpload(false);
    setModalShare(false);
  };

  const getElement = document.getElementById('body-dir-list');
  useEffect(() => {
    if (getElement && !searchAllLoading) getElement.scroll(0, 0);
  }, [getElement, searchAllLoading]);

  return (
    <>
      <Wrapper>
        <Header>
          <IndexSearch hideLine={totalSearchAllList}>
            {!viewFolder && (
              <span style={{fontSize: '16px',marginLeft: "22px"}}>
                <span>Tìm thấy </span>
                <span style={{color: '#3e84ee'}}>{totalSearchAllList ?? '0'}</span>
                <span> kết quả với từ khoá </span>
                <span style={{color: '#3e84ee'}}>"{filterSearch?.key_word}"</span>
              </span>
            )}
            {viewFolder && <Breadcrumb setViewFolder={() => setViewFolder(false)} />}
            <span>
              <Manipulation>
                {informationFileData && (
                  <>
                    {Boolean(informationFileData[0]?.is_edit) && (
                      <StyledEdit
                        onClick={() => {
                          setModalEditFolder(true);
                        }}
                      />
                    )}
                    {Boolean(informationFileData[0]?.is_owner) && (
                      <Icon src={usersmall} onClick={() => setModalShare(true)} />
                    )}
                    {Boolean(informationFileData[0]?.is_owner) && (
                      <Icon src={move} onClick={() => setModalMove(true)} />
                    )}
                    {Boolean(informationFileData[0]?.is_delete) && (
                      <Icon src={trash} onClick={() => setModalDelete(true)} />
                    )}
                  </>
                )}
              </Manipulation>
            </span>
          </IndexSearch>
        </Header>

        <Container>
          <BodyDir id="body-dir-list" span={informationFileData ? 16 : 24}>
            {searchAllLoading
              ? loading
              : items?.map((value, index) => (
                  <ChildSection
                    key={index}
                    indexChildSection={index}
                    data={value}
                    handleActiveChildSection={handleActiveChildSection}
                    activeChildSection={Boolean(activeChildSection === index)}
                    setViewFolder={setViewFolder}
                  />
                ))}
          </BodyDir>

          {informationFileData && (
            <Col span="8">
              <DetailFile height={'69vh'} />
            </Col>
          )}
        </Container>

        {modalDelete && (
          <ConfirmDeleteModal
            visible={modalDelete}
            defaultValue={dataActive}
            onRefesh={handleRefresh}
            onClose={handleClose}
          />
        )}

        {modalEditFolder && (
          <EditNameDirectoryModal
            visible={modalEditFolder}
            defaultValue={dataActive}
            onRefesh={handleRefresh}
            onClose={handleClose}
          />
        )}

        {modalMove && (
          <MoveModal
            visible={modalMove}
            defaultValue={dataActive}
            // dataColumn={isTypeDocument ? typeOfDocumentsList : data}
            onRefesh={handleRefresh}
            onClose={handleClose}
          />
        )}

        {modalShare && (
          <ShareModal visiable={modalShare} defaultValue={dataActive} onRefesh={handleRefresh} onClose={handleClose} />
        )}
      </Wrapper>
    </>
  );
};

ListPage.propTypes = {
  handleRefresh: PropTypes.func,
};

ListPage.defaultProps = {
  handleRefresh: () => {},
};

export default ListPage;
