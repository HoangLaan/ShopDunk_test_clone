import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import mqtt from 'mqtt';
import { v4 as uuidv4 } from 'uuid';
import { isJsonString } from 'utils/helpers';

const CONFIG = {
  MQTT_HOST: process.env.REACT_APP_MQTT_DOMAIN,
  MQTT_USERNAME: process.env.REACT_APP_MQTT_USER,
  MQTT_PASSWORD: process.env.REACT_APP_MQTT_PASSWORD,
  MQTT_PORT: process.env.REACT_APP_MQTT_PORT,
};

const CONNECT_STATUS = {
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  RECONNECT: 'RECONNECT',
  DISCONNECT: 'DISCONNECT',
  ERROR: 'ERROR',
};

export const MqttContext = createContext({
  connected: false,
  connectStatus: CONNECT_STATUS.DISCONNECT,
  payload: null,
  isSubscribe: false,
  subscribe: () => {},
  unsubscribe: () => {},
  publish: () => {},
  disconnect: () => {},
});

export function MqttProvider({ children }) {
  const [client, setClient] = useState(null);
  const [connectStatus, setConnectStatus] = useState(CONNECT_STATUS.DISCONNECT);
  const [payload, setPayload] = useState(null);
  const [isSubscribe, setIsSubscribe] = useState(false);

  const createClient = useCallback(() => {
    try {
      const options = {
        keepalive: 60,
        clientId: 'portal_' + uuidv4(),
        connectTimeout: 4000,
        username: CONFIG.MQTT_USERNAME,
        password: CONFIG.MQTT_PASSWORD,
        reconnectPeriod: 1000,
        port: CONFIG.MQTT_PORT,
        host: CONFIG.MQTT_HOST,
      };
      const CONNECT_URL = `mqtts://${CONFIG.MQTT_HOST}`;
      setConnectStatus(CONNECT_STATUS.CONNECTING);
      setClient(mqtt.connect(CONNECT_URL, options));
    } catch (error) {
      console.log('createClient error', error);
    }
  }, []);

  useEffect(createClient, [createClient]);

  const connectBroker = useCallback(() => {
    if (client) {
      client.on('connect', () => {
        setConnectStatus(CONNECT_STATUS.CONNECTED);
      });
      client.on('error', (err) => {
        console.error('Connection error: ', err);
        setConnectStatus(CONNECT_STATUS.ERROR);
        client.end();
      });
      client.on('reconnect', () => {
        setConnectStatus(CONNECT_STATUS.RECONNECT);
      });
    }
  }, [client]);
  useEffect(connectBroker, [connectBroker]);

  // listenning data
  useEffect(() => {
    if (client) {
      client.on('message', (topic, message) => {
        const payload = { topic, message: message.toString() };
        setPayload(payload);
      });
    }
  }, [client]);

  const subscribe = (topic, qos = 2) => {
    client?.subscribe(topic, { qos }, (error) => {
      if (error) {
        return console.log('Subscribe to topics error', error);
      }
      setIsSubscribe(true);
    });
  };
  const unsubscribe = (topic) => {
    client?.unsubscribe(topic, (error) => {
      if (error) {
        console.log('Unsubscribe error', error);
        return;
      }
      setIsSubscribe(false);
    });
  };

  const publish = (topic, payload, qos = 2) => {
    client?.publish(topic, payload, { qos }, (error) => {
      if (error) {
        console.log('Publish error: ', error);
      }
    });
  };

  const disconnect = () => {
    client?.end(() => {
      setConnectStatus(CONNECT_STATUS.DISCONNECT);
    });
  };

  return (
    <MqttContext.Provider
      value={{
        connected: connectStatus === CONNECT_STATUS.CONNECTED,
        connectStatus,
        payload,
        isSubscribe,
        subscribe,
        unsubscribe,
        publish,
        disconnect,
      }}>
      {children}
    </MqttContext.Provider>
  );
}

export const useMqttSubscribe = (topic, qos = 2) => {
  const { payload, subscribe } = useContext(MqttContext);
  subscribe(topic, qos);
  return payload?.topic === topic
    ? isJsonString(payload?.message)
      ? JSON.parse(payload?.message)
      : payload?.message
    : null;
};

export const useMqttPublish = (topic, payload, qos = 2) => {
  const { publish } = useContext(MqttContext);
  publish(topic, payload, qos);
};
