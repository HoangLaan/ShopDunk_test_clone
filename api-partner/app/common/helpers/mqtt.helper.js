const mqtt = require('mqtt');
const config = require('../../../config/config');
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
// connect options
const OPTIONS = {
    keepalive: 60,
    clientId,
    connectTimeout: 4000,
    username: config.MQTT.USERNAME,
    password: config.MQTT.PASSWORD,
    reconnectPeriod: 1000,
    port: 8883,
    host: config.MQTT.HOST,
};

// default is mqtt, unencrypted tcp connection
// let connectUrl = `mqtt://${host}:${port}`;
let connectUrl = `mqtts://${config.MQTT.HOST}`;

const client = mqtt.connect(connectUrl, OPTIONS);

client.on('connect', () => {
    console.log(`Connected mqtt service`);
});

client.on('reconnect', (error) => {
    console.log(`Reconnecting mqtt(:`, error);
});
client.on('error', (error) => {
    console.log(`Cannot connect mqtt(:`, error);
});

const push = (context) => {
    if (client) {
        const { topic, qos, payload } = context;

        client.publish(topic, JSON.stringify(payload), { qos, retain: false }, (error, packet) => {
            if (error) {
                console.log('Publish error: ', error);
            }
        });
    } else {
        console.log('Khong push');
    }
};

module.exports = {
    client,
    push,
};
