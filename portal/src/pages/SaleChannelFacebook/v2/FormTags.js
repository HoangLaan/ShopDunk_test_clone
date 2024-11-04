import { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Input, Tag, theme } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import fbActions from '../actions';

const FormTags = ({ field = 'tags', labelNew = 'Thêm ghi chú' }) => {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { token } = theme.useToken();
  const { conversationSelected, createNoteError, createNoteSuccess } = useSelector((state) => state.scfacebook);

  const tags = methods.watch(field) || [];
  const setTags = (value) => methods.setValue(field, value);

  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);
  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag.id !== removedTag?.id);
    setTags(newTags);
    dispatch(
      fbActions.deleteNoteFacebookUser({
        pageId: conversationSelected?.page_id,
        userId: conversationSelected?.user?.user_id,
        noteId: removedTag.id,
      }),
    );
  };
  const showInput = () => {
    setInputVisible(true);
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
      dispatch(
        fbActions.createNoteFacebookUser({
          pageId: conversationSelected?.page_id,
          userId: conversationSelected?.user?.user_id,
          note: inputValue,
        }),
      );
    }
    setInputVisible(false);
    setInputValue('');
  };
  const forMap = (tag) => {
    const tagElem = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}>
        {tag.note}
      </Tag>
    );
    return (
      <span
        key={tag.id}
        style={{
          display: 'inline-block',
        }}>
        {tagElem}
      </span>
    );
  };
  const tagChild = tags.map(forMap);
  const tagPlusStyle = {
    background: token.colorBgContainer,
    borderStyle: 'dashed',
  };
  return (
    <>
      <div
        style={{
          marginBottom: 16,
        }}>
        <TweenOneGroup
          enter={{
            scale: 0.8,
            opacity: 0,
            type: 'from',
            duration: 100,
          }}
          onEnd={(e) => {
            if (e.type === 'appear' || e.type === 'enter') {
              e.target.style = 'display: inline-block';
            }
          }}
          leave={{
            opacity: 0,
            width: 0,
            scale: 0,
            duration: 200,
          }}
          appear={false}>
          {tagChild}
        </TweenOneGroup>
      </div>
      {inputVisible ? (
        <Input
          ref={inputRef}
          type='text'
          size='small'
          style={{
            width: 78,
          }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag onClick={showInput} style={tagPlusStyle}>
          <PlusOutlined /> {labelNew}
        </Tag>
      )}
    </>
  );
};
export default FormTags;