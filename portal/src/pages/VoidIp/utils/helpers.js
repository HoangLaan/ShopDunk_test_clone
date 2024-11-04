import JsSIP from 'jssip';
import { createCallCustomer } from 'services/task.service';
import { syncCdrs } from 'services/voip.services';
import { store } from '../../../store';
import { updatePhone, updateIsUserInCall } from '../actions/actions';
import showNotification from './showNotification';

// JsSIP.debug.enable('JsSIP:*');
var UA;
let selfView;
let remoteView;
let session;
let remoteAudio = new window.Audio();
remoteAudio.autoplay = true;
remoteAudio.crossOrigin = 'anonymous';
let isIncall = false;
let coutTime = 0;
let timer;

const secondToMinute = (s) => {
  return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
};

const eventHandlers = {
  progress: (e) => {
    try {
      function reverseString(str) {
        var convertString = "";
        for (var i = str?.length - 1; i >= 0; i--) {
          convertString += str[i];
        }
        return convertString;
      }

      const link = window.location.pathname;
      var task_detail_id = "";
      if (link.includes('task/detail')) {
        for (var i = link.length - 1; i >= 0; i--) {
          if (link[i] === "/") {
            break;
          }
          task_detail_id += link[i];
        }
      }

      createCallCustomer({
        task_detail_id: reverseString(task_detail_id),
        sip_id: e?.response?.call_id
      })
    } catch (error) {
      console.log(error);
    }
  },
  failed: (e) => {
    isIncall = false;
    document.getElementById('bw_calling').classList.remove('bw_modal_open');
    document.getElementById('bw_calling').classList.remove('bw_lessCalling');
  },
  started: (e) => {
    isIncall = true;
    var rtcSession = e.sender;
    if (rtcSession.getLocalStreams().length > 0) {
      selfView.src = window.URL.createObjectURL(rtcSession.getLocalStreams()[0]);
    }
    if (rtcSession.getRemoteStreams().length > 0) {
      remoteView.src = window.URL.createObjectURL(rtcSession.getRemoteStreams()[0]);
    }
  },
  connecting: (e) => {

  },
  accepted: (e) => {
    isIncall = true;
    //document.getElementById('bw_calling__item').innerHTML = '0:00';
    // console.log('UA_LOG : ACCEPT');
    // timer = setInterval(() => {
    //   coutTime = coutTime + 1;
    //   document.getElementById('bw_calling__item').innerHTML = secondToMinute(parseInt(coutTime));
    // }, 1000);

    // document.getElementById('bw_calling').classList.add('bw_lessCalling');

    //document.getElementById('bw_calling__item').innerHTML = '0:00';
    //coutTime = 0;
    // console.log('UA_LOG : ACCEPT');
    // timer = setInterval(() => {
    //   coutTime = coutTime + 1;
    //   document.getElementById('bw_calling__item').innerHTML = secondToMinute(parseInt(coutTime));
    // }, 1000);
    //document.getElementById('bw_enjoyCalling__endCall').classList.add('hidden_button__calling');
  },
  ended: async (e) => {
    isIncall = false;
    coutTime = 0;
    clearInterval(timer);
    document.getElementById('bw_calling').classList.remove('bw_modal_open');
    document.getElementById('bw_calling').classList.remove('bw_lessCalling');
    try {
      syncCdrs(session?._request?.call_id)
    } catch (error) {
    }
  },
};

const options = {
  eventHandlers: eventHandlers,
  extraHeaders: ['X-Foo: foo', 'X-Bar: bar'],
  mediaConstraints: { audio: true, video: false },
  pcConfig: {
    iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
  },
};

const addEventVoild = function (client, user_user_name) {
  client.on('newRTCSession', (ev) => {
    if (session) {
      //hangup any existing call
      ev.session.terminate({
        extraHeaders: ['X-Foo: foo', 'X-Bar: bar'],
        status_code: 486,
        reason_phrase: 'reject',
      });
      // End P2P
    } else {
      session = ev.session;
    }
    if (!isIncall) { // nếu không trong cuộc gọi nào thì lấy số điện thoại goi đến
      let display_name = '';
      if (ev.originator === 'local') {
        display_name = ev.request.to._uri?._user
      } else {
        display_name = ev.request.from.display_name
      }
      const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
      if (display_name.match(regexPhoneNumber)) {
        store.dispatch(updatePhone(display_name));
      }
    }


    // getFullName({
    //   type: display_name.match(regexPhoneNumber) ? 2 : 1,
    //   value_query: display_name
    // }).then((o) => {
    //   document.getElementById('bw_calling__nameNumber').innerHTML = o?.full_name ?? 'Không xác định';
    //   document.getElementById('bw_reCalling__fullnam').innerHTML = o?.full_name ?? 'Không xác định';
    // })

    var fix40sec = null;

    session.on('icecandidate', function (candidate) {
      if (fix40sec != null) clearTimeout(fix40sec);
      fix40sec = setTimeout(candidate.ready, 15000);
    });
    session.on('progress', function (e, value) {
      // if(e?.originator === 'local'){
      //   getFullName({
      //     type: 1,

      //   })
      // }
    });
    session.on('ended', function async(e) {
      store.dispatch(updateIsUserInCall(false));
      isIncall = false;
      document.getElementById('bw_calling').classList.remove('bw_modal_open');
      document.getElementById('bw_reCalling').classList.remove('bw_modal_open')
      document.getElementById('bw_enjoyCalling__endCall').classList.remove('hidden_button__calling');
      document.getElementById('bw_reCalling__item').innerHTML = 'Đang gọi bạn';
      document.getElementById('bw_calling__item').innerHTML = 'Đang gọi ...';
      coutTime = 0;
      clearInterval(timer);
      session = null;
      //syncCdrs(e?.message?.call_id);
    });
    session.on('connecting', function (e) {
      // console.log('connecting');
    });
    session.on('failed', function (e) {
      document.getElementById('voip_ringing').pause()
      isIncall = false;
      document.getElementById('bw_reCalling').classList.remove('bw_modal_open');
      if (session?.direction === 'incoming') {
        var user = session._remote_identity._uri._user;
      } else if (session.direction === 'outgoing') {
        var user = session._remote_identity._uri._user;
      } else {
        // makeToast('End call');
      }
      session = null;
    });
    session.on('accepted', function (e) {
      document.getElementById('voip_ringing').pause()
      isIncall = true;
      document.getElementById('bw_reCalling__item').innerHTML = '0:00';
      document.getElementById('bw_calling__item').innerHTML = '0:00';
      coutTime = 0;
      timer = setInterval(() => {
        coutTime = coutTime + 1;
        const timeParse = secondToMinute(parseInt(coutTime));
        document.getElementById('bw_reCalling__item').innerHTML = timeParse;
        document.getElementById('bw_calling__item').innerHTML = timeParse;
      }, 1000);
      document.getElementById('bw_enjoyCalling__endCall').classList.add('hidden_button__calling');
      //document.getElementById('bw_reCalling').classList.add('bw_lessCalling');
      //   incomingCallAudio.pause();
    });
    session.on('confirmed', function (e) {
      isIncall = true;
    });
    // Fire when newRTC establish
    session.on('peerconnection', (e) => {
      const peerconnection = e.peerconnection;
      peerconnection.onaddstream = function (e) {
        remoteAudio.srcObject = e.stream;
        remoteAudio.play();
      };
      var remoteStream = new MediaStream();
      peerconnection.getReceivers().forEach(function (receiver) {
        remoteStream.addTrack(receiver.track);
      });
    });

    // Incoming Calling
    // update nếu tài khoản là administrator thì không nhận cuộc gọi
    if (session.direction === 'incoming' && user_user_name !== 'administrator') {
      if (!isIncall) {
        showNotification()
        document.getElementById('voip_ringing').muted = false
        document.getElementById('voip_ringing').play()
        var user = session._remote_identity._uri._user;
        document.getElementById('bw_reCalling__number').innerHTML = user;
        document.getElementById('bw_reCalling').classList.add('bw_modal_open');
      }
    } else if (user_user_name !== 'administrator') {
      session.connection.addEventListener('addstream', function (e) {
        remoteAudio.srcObject = e.stream;
      });
    }
    // End P2P
    // Incoming Calling
  });
};

const initVoid = function (client, user_user_name) {
  // if (typeof username === 'undefined' || username == '') return;
  try {
    if (client.isRegistered()) {
      client.unregister(options);
    }
    client.stop();
  } catch (error) {
    console.log('Already stopped');
  }
  client.start();
  client.register(options);
  client.registrator();
  addEventVoild(client, user_user_name);
};

function beforeInit(iUser, iWss, iUri, iPassword, iProxy, user_user_name) {
  try {
    const username = iUser;
    const wss = iWss;
    const password = iPassword;
    const proxy = iProxy;
    if (username !== '') {
      var socket = new JsSIP.WebSocketInterface(wss);
      const configuration = {
        display_name: username + user_user_name + process.env.NODE_ENV,
        sockets: socket,
        authorization_user: username,
        uri: iUri,
        contact_uri: iUri,
        password: password,
        proxy: proxy,
        instance_id: null,
        pcConfig: {
          iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
        },
        session_timers: false,
      };
      UA = new JsSIP.UA(configuration);
      // JsSIP.debug.enable('JsSIP:*');
      initVoid(UA, user_user_name);
    }
  } catch (error) {

  }
}

const callPhone = function (inumber) {
  isIncall = true;
  store.dispatch(updateIsUserInCall(true));
  store.dispatch(updatePhone(inumber));
  document.getElementById('bw_calling').classList.add('bw_modal_open');
  document.getElementById('bw_calling__phonenumber').innerHTML = inumber;
  UA.call(inumber, options, true);
};

const cancelCall = () => {
  isIncall = false;
  store.dispatch(updateIsUserInCall(false));
  if (session === null) return;
  session.terminate({
    extraHeaders: ['X-Foo: foo', 'X-Bar: bar'],
    status_code: 300,
    reason_phrase: 'reject',
  });
  document.getElementById('bw_calling').classList.remove('bw_modal_open');
  localStorage.removeItem(form_work_flow);
};

const answerCall = () => {
  store.dispatch(updateIsUserInCall(true));
  document.getElementById('bw_calling').classList.add('bw_modal_open');
  document.getElementById('bw_reCalling').classList.remove('bw_modal_open');
  session.answer(options, true);
};

function makeBlindTransfer(numberToTransfer) {
  let eventHandlers = {
    requestSucceeded: function (e) {
      console.log("Chuyển cuộc gọi thành công");
    },
    requestFailed: function (e) {
      console.log("Chuyển cuộc gọi thất bại");
    },
    trying: function (e) {
      console.log("trying", e);
    },
    progress: function (e) {
      console.log("progress", e);
    },
    accepted: function (e) {
      console.log("accepted", e);
    },
    failed: function (e) {
      console.log("failed", e);
    },
  };
  try {
    const uri = `sip:${numberToTransfer}@pbx.shopdunk.com`;
    session.refer(numberToTransfer, {
      eventHandlers,
      extraHeaders: [`Contact: ${uri}`],
    });
    cancelCall();
  } catch (err) {
    console.log("error");
  }
}

const holdCall = () => {
  try {
    if (!session) {
      return;
    }
    session.hold();
    console.log('Cuộc gọi đã được đặt ở chế độ giữ');
  } catch (err) {
    console.log('Cuộc gọi không thể được đặt ở chế độ giữ', err)
  }
};

const unholdCall = () => {
  if (!session) {
    return;
  }
  try {
    if (!session) {
      return;
    }
    session.unhold();
    console.log('Cuộc gọi đã được khôi phục từ chế độ giữ')
  } catch (err) {
    console.log('Cuộc gọi không thể được khôi phục từ chế độ giữ', err)
  }
};

const orderStatus = (status) => {
  if(status === 0){
    return 'Đơn hàng mới'
  } else if (status === 1) {
    return 'Đang xử lý'
  } else if (status === 2) {
    return 'Hoàn thành'
  } else if (status === 3) {
    return 'Hủy'
  }
}

export { addEventVoild, beforeInit, callPhone, cancelCall, answerCall, UA, session, makeBlindTransfer, holdCall, unholdCall, orderStatus };

export const cns_source_id = 41;
export const form_work_flow = 'formWorkFlow';