import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ChildSection from 'pages/FileManager/child-components/body/directory/ChildSection';
import fileManager from 'pages/FileManager/actions/file-manager';
import EmptyFile from 'pages/FileManager/child-components/body/quick/EmptyFile';
import EditNameDirectoryModal from 'pages/FileManager/child-components/modal/EditNameDirectory';
import ConfirmDeleteModal from 'pages/FileManager/child-components/modal/ConfirmDeleteModal';
import MoveModal from 'pages/FileManager/child-components/modal/MoveModal';
import UploadFileModal from 'pages/FileManager/child-components/modal/UploadFileModal';
import ShareModal from 'pages/FileManager/child-components/modal/ShareModal';
import TagSelect from 'pages/FileManager/child-components/body/dropdown/TagSelect';
import { EditOutlined, DeleteOutlined, TagsOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { defaultPaging } from 'utils/helpers';
import CreateDocumentModal from 'pages/FileManager/child-components/modal/CreateDocumentModal';
import { PERMISSION_DOCUMENT } from 'pages/FileManager/utils/constants';
import move from 'pages/FileManager/assets/move.svg';
import create from 'pages/FileManager/assets/create.svg';
import trash from 'pages/FileManager/assets/trash.svg';
import userAdd from 'pages/FileManager/assets/user-add.svg';
import uploadFile from 'pages/FileManager/assets/upload-file.svg';
import CheckAccess from 'navigation/CheckAccess';

const Wrapper = styled.div`
  min-width: 25% !important;
  height: 100% !important;
  background-color: white;
`;

const Manipulation = styled.div`
  cursor: pointer;
  width: 100% !important;
  height: 58px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  border-right: 4px solid #f0f1f1;
  border-bottom: ${(props) => (props.hiddenLine ? '0px' : '2px')} solid #f0f1f1;
`;

const LeftIcon = styled.div`
  display: flex;
  align-items: center;
  svg {
    font-size: 19px;
    margin-right: 5px;
  }
`;
const RightIcon = styled.div`
  display: flex;
  align-items: center;
  svg {
    font-size: 25px;
    margin-right: 5px;
    color: #2f80ed !important;
  }
`;

const IconEditDocument = styled(EditOutlined)`
  display: flex;
  align-items: center;
  svg {
    font-size: 20px;
    margin-right: 5px;
    color: #2f80ed !important;
  }
`;

const IconTrashDocument = styled(DeleteOutlined)`
  display: flex;
  align-items: center;
  svg {
    font-size: 20px;
    margin-right: 5px;
    color: #2f80ed !important;
  }
`;

const Icon = styled.img`
  margin-right: 10px;
  height: ${(props) => props?.height ?? '16px'};
  &:last-child {
    margin-right: 0px;
  }
`;

const BodyDirector = styled.div`
  height: calc(100% - 69px);

  /* width */
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 4px;
    height: 6px;
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

const ColumnSection = ({ data, isTypeDocument, indexColumn }) => {
  const dispatch = useDispatch();
  const idSection = 'child-section-file' + indexColumn;
  const getElement = document.getElementById(idSection);
  const [activeChildSection, setActiveChildSection] = useState(undefined);
  const [dataActive, setDataActive] = useState(undefined);
  const [modalEditFolder, setModalEditFolder] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalMove, setModalMove] = useState(false);
  const [modalUpload, setModalUpload] = useState(false);
  const [modalShare, setModalShare] = useState(false);
  const [modalCreate, setModalCreate] = useState(false);
  const [scrollTop, setScrollTop] = useState(undefined);

  const { typeOfDocumentsList, getTypeOfDocumentsLoading, allItemsArrayColumn, informationFileData } = useSelector(
    (state) => state.fileManager,
  );

  const { items } = useMemo(
    () => (isTypeDocument ? typeOfDocumentsList : data) ?? defaultPaging,
    [isTypeDocument, typeOfDocumentsList, data],
  );

  const [addNew, setAddNew] = useState(false);
  const [filter, setFilter] = useState({
    itemsPerPage: 500,
    page: 1,
    document_type_id: null,
    is_managed_document: 1,
  });

  const loadData = useCallback(() => {
    if (isTypeDocument) dispatch(fileManager.getTypeDocuments(filter));
    // setActiveChildSection(undefined);
    // setDataActive(undefined);
  }, [dispatch, isTypeDocument, filter]);
  useEffect(loadData, [loadData]);

  const handleActiveChildSection = (index, data) => {
    setActiveChildSection(index);
    setDataActive(data);
    dispatch(fileManager.selectedFile(data));
  };

  const handleClose = () => {
    setModalEditFolder(false);
    setModalDelete(false);
    setModalMove(false);
    setModalUpload(false);
    setModalShare(false);
    setModalCreate(false);
  };

  const handleOnChangeEditName = (e) => {
    setDataActive((prev) => ({
      ...prev,
      ...e,
    }));
  };

  const handleRefeshWhenMove = async (e) => {
    try {
      const index = allItemsArrayColumn?.findIndex((value) => value?.parentFolder.directory_id === e?.parent_id);
      if (Boolean(allItemsArrayColumn[index])) {
        await dispatch(fileManager.deleteItemColumns(index));
      } else {
        await dispatch(
          fileManager.getAllItemsReplaceColums({
            indexColumn: indexColumn,
            directory_id: data?.parentFolder?.directory_id,
            document_type_id: data?.parentFolder?.document_type_id,
          }),
        );
        await dispatch(
          fileManager.getAllItemsReplaceColums({
            indexColumn: e.indexColumn,
            document_type_id: data?.parentFolder?.document_type_id,
          }),
        );
        await dispatch(fileManager.deleteItemColumns(indexColumn));
      }
      setActiveChildSection(undefined);
      setDataActive(undefined);
    } catch (_) {}
  };

  const jsx_render = () => {
    if (isTypeDocument) {
      return getTypeOfDocumentsLoading ? <Spin /> : jsx_section();
    } else {
      return data?.loading ? <Spin /> : jsx_section();
    }
  };

  const handleRefesh = async (hasDeleteItemColumns) => {
    try {
      await dispatch(
        fileManager.getAllItemsReplaceColums({
          indexColumn: indexColumn,
          directory_id: data?.parentFolder?.directory_id,
          document_type_id: data?.parentFolder?.document_type_id,
        }),
      );
      //   setActiveChildSection(undefined);
      //   setDataActive(undefined);
      if (hasDeleteItemColumns) await dispatch(fileManager.deleteItemColumns(indexColumn));
      getElement.scroll(0, scrollTop);
    } catch (_) {
    } finally {
    }
  };

  const manipulationDirectory = (
    <Manipulation hiddenLine={!Boolean(indexColumn)}>
      <LeftIcon>
        {dataActive && (
          <>
            {Boolean(dataActive?.is_owner) && <Icon src={userAdd} onClick={() => setModalShare(true)} />}
            {Boolean(dataActive?.is_owner) && <Icon src={move} onClick={() => setModalMove(true)} />}
            {Boolean(dataActive?.is_delete) && <Icon onClick={() => setModalDelete(true)} src={trash} />}
            {Boolean(dataActive?.is_edit) && (
              <EditOutlined
                onClick={() => {
                  setModalEditFolder(true);
                }}
              />
            )}
            <TagSelect
              defaultData={dataActive}
              setDataActive={(e) => {
                setDataActive(e);
                dispatch(fileManager.selectedFile(e));
              }}
              hideListTag
              topAbsolute='26px'
              boderStyled='none'
              nodeButton={<TagsOutlined />}
              //   onRefesh={handleRefesh}
            />
          </>
        )}
      </LeftIcon>
      <RightIcon>
        {Boolean(data?.parentFolder?.is_add) && (
          <>
            <Icon
              height={25}
              src={create}
              onClick={() => {
                setAddNew(true);
                setActiveChildSection(items.length + 1);
              }}
            />
            <Icon
              height={35}
              src={uploadFile}
              onClick={() => {
                setModalUpload(true);
              }}
            />
          </>
        )}
      </RightIcon>
    </Manipulation>
  );

  const manipulationDocument = (
    <Manipulation hiddenLine={false}>
      <LeftIcon>
        <span style={{ marginBottom: '0px', fontSize: '17px', fontWeight: '500' }}>Loại tài liệu</span>
      </LeftIcon>

      <RightIcon style={{ display: 'flex' }}>
        {dataActive && (
          <>
            <CheckAccess permission={PERMISSION_DOCUMENT.MD_DOCUMENTTYPE_DEL}>
              <IconTrashDocument onClick={() => setModalDelete(true)} />
            </CheckAccess>
            <CheckAccess permission={PERMISSION_DOCUMENT.MD_DOCUMENTTYPE_EDIT}>
              <IconEditDocument
                onClick={() => {
                  setModalEditFolder(true);
                }}
              />
            </CheckAccess>
          </>
        )}
        <CheckAccess permission={PERMISSION_DOCUMENT.MD_DOCUMENTTYPE_ADD}>
          <Icon
            height={25}
            src={create}
            onClick={() => {
              setModalCreate(true);
            }}
          />
        </CheckAccess>
      </RightIcon>
    </Manipulation>
  );

  useEffect(() => {
    if (getElement) getElement.scroll(0, 0);
  }, [getElement]);

  useEffect(() => {
    if (
      informationFileData &&
      Boolean(dataActive?.is_file) &&
      informationFileData[0]?.file_id === dataActive?.file_id
    ) {
      setDataActive((prev) => ({
        ...prev,
        list_tag: informationFileData[0]?.list_tag,
      }));
    }
  }, [informationFileData, setDataActive]);

  const jsx_section = useCallback(() => {
    return Boolean(items?.length)
      ? items?.map((value, index) => (
          <ChildSection
            dataActive={dataActive}
            onRefresh={handleRefesh}
            data={value}
            key={index}
            indexChildSection={index}
            activeChildSection={Boolean(activeChildSection === index)}
            handleActiveChildSection={handleActiveChildSection}
            parentFolder={data?.parentFolder}
            indexColumn={indexColumn}
            isTypeDocument={isTypeDocument}
            setDataActive={setDataActive}
          />
        ))
      : !addNew && Object.keys(data).length > 0 && <EmptyFile />;
  }, [
    data,
    activeChildSection,
    items,
    addNew,
    setDataActive,
    isTypeDocument,
    indexColumn,
    dataActive,
    handleActiveChildSection,
    handleRefesh,
  ]);
  return (
    <Wrapper>
      {isTypeDocument ? manipulationDocument : manipulationDirectory}
      <BodyDirector onScroll={(e) => setScrollTop(e.target.scrollTop)} id={idSection} isTypeDocument={isTypeDocument}>
        {jsx_render()}
        {addNew && (
          <ChildSection
            activeChildSection={Boolean(activeChildSection === items.length + 1)}
            indexChildSection={items.length + 1}
            isAddFolder
            indexColumn={indexColumn}
            setAddNew={setAddNew}
          />
        )}
      </BodyDirector>
      {modalDelete && (
        <ConfirmDeleteModal
          isTypeDocument={isTypeDocument}
          visible={modalDelete}
          defaultValue={dataActive}
          onRefesh={() => (isTypeDocument ? loadData() : handleRefesh(true))}
          onClose={() => {
            handleClose();
            setActiveChildSection(undefined);
            setDataActive(undefined);
          }}
        />
      )}
      {modalEditFolder && (
        <EditNameDirectoryModal
          isTypeDocument={isTypeDocument}
          visible={modalEditFolder}
          defaultValue={dataActive}
          dataColumn={isTypeDocument ? typeOfDocumentsList : data}
          onRefesh={() => dispatch(fileManager.clearInformationData())}
          onClose={handleClose}
          onChange={handleOnChangeEditName}
        />
      )}

      {modalMove && (
        <MoveModal
          visible={modalMove}
          defaultValue={dataActive}
          dataColumn={isTypeDocument ? typeOfDocumentsList : data}
          onRefesh={handleRefeshWhenMove}
          onClose={handleClose}
        />
      )}
      {modalUpload && (
        <UploadFileModal
          visible={modalUpload}
          dataColumn={isTypeDocument ? typeOfDocumentsList : data}
          onRefesh={handleRefesh}
          onClose={() => {
            handleClose();
            dispatch(
              fileManager.getAllItemsReplaceColums({
                indexColumn: indexColumn,
                directory_id: data?.parentFolder?.directory_id,
                document_type_id: data?.parentFolder?.document_type_id,
              }),
            );
          }}
        />
      )}
      {modalShare && (
        <ShareModal visiable={modalShare} defaultValue={dataActive} onRefesh={handleRefesh} onClose={handleClose} />
      )}
      {modalCreate && (
        <CreateDocumentModal
          visible={modalCreate}
          defaultValue={dataActive}
          onRefesh={loadData}
          onClose={handleClose}
        />
      )}
    </Wrapper>
  );
};

ColumnSection.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      parentFolder: PropTypes.shape({
        document_type_id: PropTypes.string,
        directory_id: PropTypes.string,
      }),
      items: PropTypes.array,
      totalItems: PropTypes.number,
      page: PropTypes.string,
      totalPages: PropTypes.number,
      itemsPerPage: PropTypes.number,
    }),
  ),
  isTypeDocument: PropTypes.func,
  indexColumn: PropTypes.func,
};

ColumnSection.defaultProps = {
  data: [],
};

export default ColumnSection;
