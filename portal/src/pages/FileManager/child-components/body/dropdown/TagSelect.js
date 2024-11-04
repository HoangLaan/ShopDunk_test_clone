/* eslint-disable */
import React, {useState, useEffect, useRef, useCallback} from 'react';
import styled from 'styled-components';
import {Tag} from 'antd';
import fileManager from 'pages/FileManager/actions/file-manager';
import {useDispatch, useSelector} from 'react-redux';
import useOutsideClick from 'hooks/use-outside-picker';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  .section {
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  .select-header {
    display: flex;
    align-items: center;
    justify-content: left;
    cursor: pointer;
    position: relative;
    .left-header {
      display: flex;
      align-items: center;
      flex-flow: wrap;
    }
    .select-list {
      position: absolute;
      top: ${props => props.topAbsolute ?? '-75px'};
      right: -2px;
      background-color: white;
      padding: 10px;
      box-shadow: 0px 0px 1px 0px;
      &:hover {
      }
      z-index: 10000;
    }
  }
`;

const Circle = styled.span`
  width: 17px;
  height: 17px;
  border-radius: 50%;
  /* border: 1px solid #ccc; */
  background: ${props => props.backgroundColor ?? 'black'};
`;

const TagSitePlus = styled(Tag)`
  position: relative;
  background: #fff;
  border-style: ${props => props.boderStyled ?? 'dashed'};
  padding: 0px;
  margin-right: 0px;
`;

const TagStyle = styled(Tag)`
  display: inline-flex;
  font-size: 15px;
  align-items: center;
  .name-tag {
    margin-left: 3px;
  }
  svg {
    font-size: 10px;
  }
`;

const TagSelect = ({
  // default data directory
  defaultData,
  //
  topAbsolute,
  nodeButton,
  boderStyled,
  hideListTag,
  setDataActive,
  onRefesh,
}) => {
  const ref = useRef(null);
  const dispatch = useDispatch();
  const [activeSelect, setActiveSelect] = useState(false);
  const {tagList, informationFileData, selectedFile} = useSelector(state => state.fileManager);
  const {items} = tagList;

  useEffect(() => {
    dispatch(
      fileManager.getTags({
        itemsPerPage: 200,
        page: 1,
      }),
    );
  }, [dispatch]);

  const handleTag = async (e, is_tag) => {
    let params;
    let type;
    if (defaultData) {
      if (Boolean(defaultData?.is_file)) {
        params = {
          file_tag_id: e?.file_tag_id,
          file_id: defaultData?.file_id,
          file_tag_user_id: '',
          is_tag: is_tag,
        };
        type = 'tag-file';
      } else {
        params = {
          file_tag_id: e?.file_tag_id,
          directory_tag_user_id: '',
          directory_id: defaultData?.directory_id,
          is_tag: is_tag,
        };
        type = 'tag-dir';
      }
    } else {
      params = {
        file_tag_id: e?.file_tag_id,
        file_id: informationFileData[0]?.file_id,
        file_tag_user_id: '',
        is_tag: is_tag,
      };
      type = 'tag-file';
    }
    await dispatch(fileManager.postTag(params, type));

    let value;
    if (Boolean(defaultData?.is_directory)) {
      value = await fileManager.getInformationDirectoryWithOutDispatch(defaultData?.directory_id);
    } else {
      value = await fileManager.getInformationFileWithOutDispatch(defaultData?.file_id);
    }

    setDataActive({
      ...defaultData,
      list_tag: value[0]?.list_tag,
    });

    dispatch(
      fileManager.selectedFile({
        ...defaultData,
        list_tag: value[0]?.list_tag,
      }),
    );

    onRefesh();
  };

  const itemsRender = items?.filter(e => {
    if (!selectedFile?.list_tag?.find(value => value?.file_tag_id === e?.file_tag_id)) {
      return e;
    }
  });

  useOutsideClick(ref, () => setActiveSelect(false), []);

  return (
    <Wrapper ref={ref} topAbsolute={topAbsolute}>
      <div className="select-header">
        <div className="left-header">
          {!hideListTag &&
            (defaultData || informationFileData[0])?.list_tag?.map(e => (
              <TagStyle className="tag-input" closable onClose={() => handleTag(e, 0)}>
                <Circle backgroundColor={e?.color} />
                <span className="name-tag">{e?.file_tage_name}</span>
              </TagStyle>
            ))}
          <TagSitePlus boderStyled={boderStyled} onClick={() => setActiveSelect(prev => !prev)}>
            {nodeButton ?? <span>Chọn thêm thẻ</span>}
            {activeSelect && (
              <div className="select-list">
                {Boolean(itemsRender?.length) ? (
                  itemsRender?.map((e, q) => {
                    return (
                      <div key={q} onClick={() => handleTag(e, 1)} className="section">
                        <Circle backgroundColor={e?.color} />
                        <span style={{margin: '0 10px'}}>{e?.file_tage_name}</span>
                      </div>
                    );
                  })
                ) : (
                  <div>Thẻ tag trống</div>
                )}
              </div>
            )}
          </TagSitePlus>
        </div>
      </div>
    </Wrapper>
  );
};

TagSelect.propTypes = {
  defaultData: PropTypes.object,
  //
  topAbsolute: PropTypes.string,
  nodeButton: PropTypes.node,
  boderStyled: PropTypes.string,
  hideListTag: PropTypes.bool,
  setDataActive: PropTypes.func,
  onRefesh: PropTypes.func,
};

TagSelect.defaultProps = {
  setDataActive: () => {},
  onRefesh: () => {},
};

export default TagSelect;
