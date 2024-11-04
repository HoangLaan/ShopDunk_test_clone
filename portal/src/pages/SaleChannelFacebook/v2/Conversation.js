import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import mqtt from 'mqtt';
import moment from 'moment';
import { Image, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowDownOutlined } from '@ant-design/icons';
import { urlCheck } from 'pages/SaleChannelFacebook/utils/helpers';
import { urlFacebook } from 'pages/SaleChannelFacebook/utils/constants';
import fbActions from 'pages/SaleChannelFacebook/actions/index';
import grapql from 'pages/SaleChannelFacebook/actions/grapql';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';
import CONFIG from 'config/config';
import { Wrapper, Section } from 'pages/SaleChannelFacebook/utils/styles';

const Conversation = ({ clientId }) => {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const messagesEndRef = useRef(null);
  const element = document.getElementById('show_file_sale_chanel');
  const elementConversation = document.getElementById('my__conversation');

  const [informationUser, setInformationUser] = useState(undefined);

  const [loadFirst, setLoadFirst] = useState(true);
  const [messageSocket, setMessageSocket] = useState(undefined);
  const [conversationListChange, setConversationListChange] = useState(undefined);
  const [loadingConverstation, setLoadingConverstation] = useState(false);
  const {
    conversationSelected,
    getMessageFacebookUserList,
    getMessageFacebookUserListLoading,
    appendListConversation,
    conversationList,
    uploadFileData,
    uploadFileLoading,
  } = useSelector((state) => state.scfacebook);

  const { pageConnect: pageConnectSelected } = useSelector((state) => state.scFacebookPerTist);

  const { items: getMessageFacebookUserData, page: pageMessageFacebook } = getMessageFacebookUserList;
  const [builderData, setBuilderData] = useState([]);
  const loading = getMessageFacebookUserListLoading || loadingConverstation;

  const avartarAdminFanpage = useMemo(
    () =>
      `${urlFacebook.graphUrl}/${pageConnectSelected?.page_id}/picture?access_token=${pageConnectSelected?.page_token}`,
    [pageConnectSelected, urlFacebook],
  );

  const loadInformationUser = useCallback(() => {
    if (conversationSelected && pageConnectSelected?.page_token && conversationSelected?.user?.user_id) {
      axios({
        url: `${urlFacebook.graphUrl}/${conversationSelected?.user?.user_id}?fields=first_name,last_name,profile_pic&access_token=${pageConnectSelected?.page_token}`,
        method: 'GET',
      }).then((e) => {
        setInformationUser(e.data);
      });
    }
  }, [pageConnectSelected, conversationSelected]);
  useEffect(loadInformationUser, [loadInformationUser]);

  useEffect(() => {
    if (conversationSelected) {
      setBuilderData([]);
    }
  }, [conversationSelected]);

  const loadConversation = useCallback(() => {
    if (pageConnectSelected?.page_token && conversationSelected?.user?.user_id) {
      dispatch(
        fbActions.getMessageFacebookUser({
          access_token: pageConnectSelected.page_token,
          pageId: conversationSelected?.page_id,
          userId: conversationSelected?.user?.user_id,
          conversationId: conversationSelected?.conversation_id,
          itemsPerPage: 25,
          page: 1,
        }),
      );
    }
  }, [conversationSelected, pageConnectSelected]);

  useEffect(loadConversation, [loadConversation]);


  useEffect(() => {
    let client;

    const options = {
      keepalive: 60,
      clientId: clientId,
      connectTimeout: 4000,
      username: CONFIG.MQTT_USERNAME,
      password: CONFIG.MQTT_PASSWORD,
      reconnectPeriod: 1000,
      port: CONFIG.MQTT_PORT,
      host: CONFIG.MQTT_HOST,
    };

    const CONNECT_URL = `${CONFIG.MQTT_PROTOCOL}://${CONFIG.MQTT_HOST}`;
    client = mqtt.connect(CONNECT_URL, options);

    client.on('connect', function () {});
    client.subscribe(`sc/facebook/page/${pageConnectSelected?.page_id}/webhook`, function (err, a, b) {});
    client.on('message', (_, message) => {
      // check atttachment if from page pulish from client
      const payload = JSON.parse(message.toString());
      if (!payload.created_date) {
        payload.created_date = moment(new Date()).format('DD/MM/YYYY HH:mm');
      }

      const isHasAttachment = payload?.clientId && payload?.message?.attachment?.payload;
      if (isHasAttachment) {
        payload.message.attachment.url = payload.message?.attachment?.payload?.url;
      }
      setMessageSocket(payload);
    });
    return () => client.end();
  }, [pageConnectSelected, clientId]);

  // handle if have message from mqtt
  // build chat box first
  useEffect(() => {
    setLoadingConverstation(true);
    let data = [...getMessageFacebookUserData.reverse()];
    let group = [];
    while (data.length > 0) {
      const lengthGroup = group.length;
      if (lengthGroup === 0) {
        group[0] = [data[0]];
      } else {
        let valueLast = group[lengthGroup - 1];
        if (valueLast[valueLast.length - 1].from.id === data[0].from.id) {
          valueLast.push(data[0]);
          group[lengthGroup - 1] = valueLast;
        } else {
          group.push([data[0]]);
        }
      }
      data.shift();
    }
    setLoadingConverstation(false);
    setBuilderData((prev) => [...group, ...prev]);
  }, [getMessageFacebookUserData]);

  // build conversation list first
  useEffect(() => {
    if (conversationListChange) {
      let conversationPayload;
      if (conversationList?.items?.find((e) => e?.user?.user_id === conversationListChange?.user?.user_id)) {
        const items = [
          conversationListChange,
          ...conversationList?.items?.filter((e) => e?.user.user_id !== conversationListChange.user.user_id),
        ];
        conversationPayload = {
          items,
        };
      } else {
        conversationPayload = {
          items: [conversationListChange, ...conversationList?.items],
        };
      }
      dispatch(fbActions.mqttGetListConversation(conversationPayload));
    }
  }, [conversationListChange]);

  useEffect(() => {
    if (!messageSocket) {
      return;
    }
    //let getUser;
    const page_id = messageSocket?.isPageAdmin ? messageSocket?.sender_id : messageSocket?.recipient_id;
    const user_id = messageSocket?.isPageAdmin ? messageSocket?.recipient_id : messageSocket?.sender_id;
    const { mid, message: messageRes } = messageSocket;
    const { attachment, text } = messageRes;
    // #conversation
    const findConversation = conversationList?.items.find((e) => e?.user?.user_id === user_id);

    const getInformationUser = async () => {
      let getUser;
      let conversation_id;
      const isSeen = page_id === conversationSelected?.page_id && user_id === conversationSelected?.user?.user_id;
      if (findConversation) {
        getUser = findConversation?.user;
        conversation_id = findConversation?.conversation_id;
      } else {
        getUser = await grapql.getInformationUser({
          user_id: user_id,
          access_token: pageConnectSelected?.page_token,
        });

        conversation_id = await grapql.getConversationId({
          page_id: page_id,
          user_id: user_id,
          access_token: pageConnectSelected?.page_token,
        });
      }

      const appendList = {
        page_id: page_id,
        conversation_id: conversation_id,
        message: {
          message_id: mid,
          text: text,
          attachment: {
            file_url: attachment?.url,
            file_type: attachment?.type,
            file_name: 'Tập tin đính kèm',
            created_date: new Date(),
          },
          from: {
            id: user_id,
            name: getUser?.name,
            avatar: informationUser?.profile_pic,
          },
          to: findConversation?.to ?? {},
          created_date: new Date(),
        },
        user: getUser,
        is_seen: isSeen ? 1 : 0,
        hash_tags: findConversation?.hash_tags ?? [],
      };
      setConversationListChange(appendList);
    };
    getInformationUser();
  }, [messageSocket, informationUser]);

  useEffect(() => {
    if (!messageSocket) {
      return;
    }
    const page_id = messageSocket?.isPageAdmin ? messageSocket?.sender_id : messageSocket?.recipient_id;
    const user_id = messageSocket?.isPageAdmin ? messageSocket?.recipient_id : messageSocket?.sender_id;
    const { mid, message: messageRes, sticker } = messageSocket;
    const { attachment, text } = messageRes;

    if (messageSocket?.clientId === clientId) {
      return;
    } else {
      if (messageSocket?.isPageAdmin) {
        if (messageSocket?.conversation_id !== conversationSelected?.conversation_id) {
          return;
        }
      }
    }
    const appendChatBox = {
      message_id: mid,
      page_id: page_id,
      user_id: user_id,
      text: text,
      attachment: {
        file_url: attachment?.url,
        file_type: attachment?.type,
        file_name: 'Tập tin đính kèm',
      },
      sticker: sticker,
      from: {
        id: messageSocket.isPageAdmin ? page_id : user_id,
        name: messageSocket.isPageAdmin && conversationSelected?.user.name,
        avatar: messageSocket.isPageAdmin ? avartarAdminFanpage : informationUser?.profile_pic,
      },
      ...messageSocket,
    };

    if (
      appendChatBox.page_id === conversationSelected.page_id &&
      (appendChatBox.user_id || appendChatBox?.user.user_id) === conversationSelected.user.user_id
    ) {
      let valueLast;
      if (builderData?.length > 0) {
        valueLast = [...builderData[builderData.length - 1]];
      }
      if (Array.isArray(valueLast) && valueLast[valueLast?.length - 1]?.from?.id === appendChatBox?.from.id) {
        valueLast.push(appendChatBox);
        setBuilderData((prev) => {
          prev.pop();
          return [...prev, valueLast];
        });
      } else {
        setBuilderData((prev) => {
          const clone = [...prev];
          clone.push([appendChatBox]);
          return clone;
        });
      }
    }

    setMessageSocket(undefined);
  }, [messageSocket, conversationSelected, conversationList]);

  const heightShowFile = useMemo(() => {
    if (uploadFileData || uploadFileLoading) {
      return 67;
    } else {
      return 0;
    }
  }, [element, uploadFileData, uploadFileLoading]);

  const jsx_render = useMemo(() => {
    return (builderData ?? [])?.map((res, j) => {
      const owner = res[0]?.from?.id === conversationSelected?.page_id;
      return (
        <Section key={j} owner={Boolean(owner)} loadFirst={loadFirst ? '100000px' : 'auto'}>
          <img className='avartar' src={owner ? avartarAdminFanpage : informationUser?.profile_pic}></img>
          <span className='list'>
            {(res ?? [])?.map((value, i) => {
              const checkLast = res.length - 1 === i;
              return (
                <Tooltip
                  key={i}
                  placement='right'
                  color='white'
                  title={
                    <div>
                      <span style={{ color: 'black' }}>
                        <b>Đã gửi:</b> {value?.created_date}
                      </span>
                      <br></br>
                      {owner && (
                        <span style={{ color: 'black' }}>
                          <span>
                            <b>Người gửi:</b>{' '}
                            <a target='_blank' href={`/users/detail/${value.last_reply_userid}`}>
                              {value?.last_reply_username} - {value?.last_reply_fullname}
                            </a>
                          </span>{' '}
                        </span>
                      )}
                    </div>
                  }>
                  <span key={value?.message?.message_id} className='conversation'>
                    {value?.text ? (
                      <span
                        className='conversation__item'
                        dangerouslySetInnerHTML={{ __html: urlCheck(value?.text) }}></span>
                    ) : value?.attachment?.file_type === 'image' || value?.sticker ? (
                      <Image src={value?.attachment?.file_url ?? value?.sticker} style={{ maxWidth: '200px' }} />
                    ) : value?.attachment?.file_type === 'file' ? (
                      <div className='conversation__file' onClick={() => window.open(value?.attachment?.file_url)}>
                        <ArrowDownOutlined style={{ marginRight: '3px' }} />
                        <span>{value?.attachment?.file_name}</span>
                      </div>
                    ) : undefined}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 500,
                    }}>
                    {checkLast && value?.last_reply_username && (
                      <p style={{ width: '100%', textAlign: 'right', marginBottom: '0rem' }}>
                        Được gửi bởi:{' '}
                        <a
                          style={{ color: '#20a8d8' }}
                          target='_blank'
                          href={`/users/detail/${value.last_reply_userid}`}>
                          {value?.last_reply_username} - {value?.last_reply_fullname}
                        </a>
                      </p>
                    )}
                  </span>
                </Tooltip>
              );
            })}
          </span>
        </Section>
      );
    });
  }, [
    builderData,
    conversationSelected,
    pageConnectSelected,
    urlFacebook,
    avartarAdminFanpage,
    informationUser,
    loadFirst,
  ]);

  const onScroll = (e) => {
    if (ref.current.scrollTop === 0 && elementConversation.scrollHeight > elementConversation.clientHeight) {
      if (pageMessageFacebook) {
        if (pageMessageFacebook?.cursors?.after) {
          dispatch(
            fbActions.getMessageFacebookUser({
              access_token: pageConnectSelected.page_token,
              pageId: conversationSelected?.page_id,
              userId: conversationSelected?.user?.user_id,
              conversationId: conversationSelected?.conversation_id,
              after: pageMessageFacebook?.cursors?.after,
            }),
          );
        }
      }
    }
  };

  useEffect(() => {
    if (conversationSelected) {
      setLoadFirst(true);
    }
  }, [conversationSelected]);

  useEffect(() => {
    if (appendListConversation) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView();
      }, 1500);
    }
  }, [appendListConversation]);

  useEffect(() => {
    if (loadFirst && Boolean(jsx_render.length)) {
      messagesEndRef.current.scrollIntoView();
      setLoadFirst(false);
    }
  }, [jsx_render, loadFirst, ref]);
  return (
    <Wrapper ref={ref} id='my__conversation' onScroll={onScroll} heightShowFile={`${heightShowFile ?? 0}px`}>
      {loading && <LoadingOutlined style={{ width: '100%' }} />}
      {jsx_render}
      <div ref={messagesEndRef} />
    </Wrapper>
  );
};

export default Conversation;
