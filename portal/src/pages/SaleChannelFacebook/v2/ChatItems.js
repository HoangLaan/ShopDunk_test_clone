import user_image from 'assets/bw_image/user.png';
import user_admin_image from 'assets/bw_image/user_admin.png';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Tag } from 'antd';
import { Button, Space, Skeleton } from 'antd';
import logoImg from 'assets/bw_image/logo.png';
import styled from 'styled-components';
import { relativeTime } from 'pages/SaleChannelFacebook/utils/helpers';
import { SearchOutlined, CheckOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import fbActions from '../actions';

function ChatItems(props) {
  const { selectedTags, search, setSearch, getListConversation } = props;
  const dispatch = useDispatch();
  const { conversationList, conversationSelected } = useSelector((state) => state.scfacebook);

  const { pageConnect: pageSelected } = useSelector((state) => state.scFacebookPerTist);
  const { hashTags } = useSelector((state) => state.scfacebook);
  const [scrollHeightPre, setScrollHeightPre] = useState();
  const conversationRef = useRef(null);

  const [isScroll, setScroll] = useState(false);

  useEffect(() => {
    conversationRef?.current?.addEventListener('scroll', handleScroll);
    return () => {
      conversationRef?.current?.removeEventListener('scroll', handleScroll);
    };
  });

  const isBottom = (ref) => {
    if (!ref.current) {
      return false;
    }

    const { scrollTop, scrollHeight, clientHeight } = ref.current;

    if (scrollHeight - (scrollTop + clientHeight) <= 50 && scrollHeight !== scrollHeightPre) {
      setScrollHeightPre(scrollHeight);
      return true;
    }

    return false;
  };

  const handleScroll = () => {
    if (isBottom(conversationRef)) {
      setScroll(true);
    }
  };

  useEffect(() => {
    if (isScroll) {
      const params = {};
      if (Boolean(conversationList.page?.cursors)) {
        params.after = conversationList.page.cursors.after;
      } else {
        params.page = parseInt(conversationList?.page) + 1;
      }
      getListConversation({ ...params, search });
    }
    setScroll(false);
  }, [isScroll, conversationList]);

  useEffect(getListConversation, [getListConversation]);

  const getConversationFiltered = () => {
    if (!selectedTags?.length) {
      return conversationList?.items || [];
    }
    return (
      conversationList?.items?.filter((conversation) => {
        return conversation?.user_hash_tags?.some((tag) => selectedTags?.includes(tag.name));
      }) || []
    );
  };

  const conversationsFiltered = getConversationFiltered();

  useEffect(() => {
    if (pageSelected) {
      if (conversationsFiltered.length > 0) {
        if (!conversationSelected?.conversation_id) {
          dispatch(fbActions.conversationSelected(conversationsFiltered[0]));
          dispatch(fbActions.changeView('info'));
        }
      }
    }
  }, [pageSelected, conversationList, conversationsFiltered]);
  console.log('~  conversationsFiltered >>>', conversationsFiltered)

  return (
    <div>
      {conversationsFiltered.map((conversation, index) => {
        return (
          <div
            className='bw_chat_items'
            key={conversation?.conversation_id || index}
            onClick={() => {
              dispatch(fbActions.changeView('info'));
              dispatch(fbActions.conversationSelected(conversation));
            }}>
            <a href='#!' onClick={(e) => e?.preventDefault()} className='bw_notice_items bw_active'>
              <img src={conversation?.user?.profile_pic ?? logoImg} alt={2} />
              <h3>
                {conversation.user?.name ?? 'Người dùng facebook'}{' '}
                <span>{relativeTime(new Date(), conversation?.message?.created_date)}</span>
              </h3>
              <p className='bw_step'>
                {(conversation?.user_hash_tags || []).map((tag, index) => (
                  <span key={tag.id}>{tag.name}</span>
                ))}
              </p>
              <p>{conversation.message?.text || conversation.message?.attachment?.file_name || 'Tập tin đính kèm'}</p>
            </a>
          </div>
        );
      })}
    </div>
  );
}

export default ChatItems;
