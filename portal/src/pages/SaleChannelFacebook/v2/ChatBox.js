import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import attach from 'pages/SaleChannelFacebook/assets/attach.svg';
import emoji from 'pages/SaleChannelFacebook/assets/i__emoji.svg';
import like from 'pages/SaleChannelFacebook/assets/i__like.svg';
import { SendOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import grapql from 'pages/SaleChannelFacebook/actions/grapql';
import EmojiPicker from 'emoji-picker-react';
import { urlFacebook } from 'pages/SaleChannelFacebook/utils/constants';
import { showToast } from 'utils/helpers';
import useOutsideClick from 'hooks/use-outside-picker';
import fbActions from 'pages/SaleChannelFacebook/actions/index';

const Wrapper = styled.div`
  background-color: white;
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  width: 100%;
  margin-top: 10px;
`;

const Avatar = styled.img`
  height: 45px;
  width: 45px;
  border-radius: 50%;
  margin-right: 7px;
`;

const Manipulation = styled.div`
  display: flex;
`;

const PickerEmoji = styled.span`
  position: relative;
  cursor: pointer;
  .EmojiPickerReact {
    position: fixed !important;
    bottom: 120px !important;
    right: 500px !important;
    z-index: 10000 !important;
  }
`;

const Chatbox = () => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const refOutsite = useRef(null);
  const { register, setValue, watch, reset } = useForm();
  const [openEmoji, setOpenEmoji] = useState(false);
  const { conversationSelected, uploadFileData, messageCreateOrder } = useSelector((state) => state.scfacebook);
  const { pageConnect: pageConnectSelected } = useSelector((state) => state.scFacebookPerTist);

  useEffect(() => {
    register('text');
  }, [register]);

  const handleClickUpload = () => {
    inputRef.current.click();
  };

  const handleFileChange = (event) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }
    if (fileObj?.size > 25000000) {
      showToast.success('Vui lòng chọn file dưới 25Mb!', 'error');
      return;
    }
    dispatch(
      fbActions.uploadFile({
        pageId: conversationSelected?.page_id,
        userId: conversationSelected?.user.user_id,
        converSationId: conversationSelected?.conversation_id,
        file_name: fileObj?.name,
        type: fileObj?.type,
        file: fileObj,
      }),
    );
  };

  const handleSendMessage = async (msgText) => {
    const params = {
      access_token: pageConnectSelected?.page_token,
      ...conversationSelected,
    };
    const data = {
      messaging_type: 'RESPONSE',
      recipient: {
        id: conversationSelected?.user.user_id,
      },
    };

    if (msgText) {
      await dispatch(
        grapql.sendMessage(params, {
          ...data,
          message: {
            text: msgText,
          },
        }),
      );
    } else if (watch('text')) {
      await dispatch(
        grapql.sendMessage(params, {
          ...data,
          message: {
            text: watch('text'),
          },
        }),
      );
    }

    // if (uploadFileData) {
    //   await dispatch(
    //     grapql.sendMessage(params, {
    //       ...data,
    //       message: {
    //         attachment: {
    //           type: getType(uploadFileData?.type),
    //           payload: {
    //             url: uploadFileData?.urlFile,
    //             is_reusable: true,
    //           },
    //         },
    //       },
    //     }),
    //   );
    //   dispatch(fbactions.clearUploadFile());
    // }
    reset({ text: undefined });
    document.getElementById('my__conversation').scroll(0, 10000);
  };

  const onEmojiClick = (emojiData, ev) => {
    setValue('text', `${watch('text') ?? ''}${emojiData.emoji}`);
  };

  useOutsideClick(
    refOutsite,
    () => {
      setOpenEmoji(false);
    },
    [],
  );

  const avartar = useMemo(
    () =>
      `${urlFacebook.graphUrl}/${pageConnectSelected?.page_id}/picture?access_token=${pageConnectSelected?.page_token}`,
    [pageConnectSelected],
  );
  return (
    <Wrapper>
      <Avatar src={avartar} />
      <input
        onKeyPress={(e) => {
          if (e.shiftKey) {
            return;
          }
          if (e.charCode === 13) {
            e.preventDefault();
            handleSendMessage();
            return;
          }
        }}
        value={watch('text') || ''}
        onChange={(event) => {
          setValue('text', event.target.value);
        }}
        style={{ border: '0px', outline: 'none', width: '100%' }}
        autoSize={{ minRows: 1, maxRows: 2 }}
        placeholder='Trả lời'
      />
      <Manipulation>
        {/* <input style={{ display: 'none' }} ref={inputRef} type='file' onChange={handleFileChange} />
        <img style={{ cursor: 'pointer', padding: '0 5px' }} src={attach} onClick={handleClickUpload} /> */}
        <PickerEmoji ref={refOutsite}>
          <img src={emoji} onClick={() => setOpenEmoji(true)} />
          {openEmoji && (
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              native
            />
          )}
        </PickerEmoji>
        <img src={like} onClick={async () => handleSendMessage('👍')} style={{ cursor: 'pointer', padding: '0 5px' }} />
        <SendOutlined
          onClick={() => handleSendMessage()}
          style={{
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            marginLeft: '10px',
          }}
        />
      </Manipulation>
    </Wrapper>
  );
};

export default Chatbox;
