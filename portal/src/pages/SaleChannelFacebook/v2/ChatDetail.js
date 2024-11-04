import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import fanpage_image from 'assets/bw_image/fanpage.jpg';
import user_image from 'assets/bw_image/user.png';
import { useAuth } from 'context/AuthProvider';
import Conversation from './Conversation';
import Chatbox from './ChatBox';

function ChatDetail() {
  const {conversationSelected, facebookUser} = useSelector(state => state.scfacebook);
  const { user: userAuth } = useAuth()
  const clientId = useMemo(() => userAuth?.user_id + (Math.random() + 1).toString(36).substring(7), []);

  return (
    <div className='bw_detail_notice bw_contain_mess'>
      <div className='bw_detail_inf'>
        <img src={conversationSelected?.user?.profile_pic || fanpage_image} alt={2} />
        <h4>{facebookUser?.info?.full_name}</h4>
        <p className='bw_step'>
          {(facebookUser?.hash_tags || []).map((tag, index) => (
            <span key={tag.id}>{tag.name}</span>
          ))}
        </p>
      </div>
      <Conversation clientId={clientId} />
      <Chatbox />
    </div>
  );
}

export default ChatDetail;
