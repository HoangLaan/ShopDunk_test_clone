const Joi = require('joi');
require('custom-env').env(process.env.NODE_ENV);

const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string().allow(['development', 'staging', 'production']).default('development'),
    APP_URL: Joi.string().required(),
    RUN_LOCAL: Joi.string().optional().default('no'),
    UNIT_TESTING: Joi.string().optional().default('no'),
    HASH_SECRET_KEY: Joi.string().required(),
    DOMAIN_CDN: Joi.string().required(),
})
    .unknown()
    .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    appName: 'API',
    env: envVars.NODE_ENV,
    port: process.env.PORT,
    runLocal: envVars.RUN_LOCAL === 'yes',
    testing: envVars.UNIT_TESTING === 'yes',
    appWelcome: envVars.APP_WELCOME,
    appUrl: envVars.APP_URL,
    hashSecretKey: envVars.HASH_SECRET_KEY,
    token: {
        key: 'Authorization',
        type: 'Bearer',
    },
    domain_cdn: envVars.DOMAIN_CDN,
    upload_apikey: envVars.UPLOAD_APIKEY,
    database: {
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10) || 1433,
        dialect: 'mssql',
    },
    sql: {
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        server: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10) || 1433,
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000,
        },
    },
    adminUserName: 'administrator',
    sendSms: {
        hostname: '',
        ApiKey: '',
        SecretKey: '',
    },
    sendEmail: {
        hostname: '',
        apiKey: '',
    },
    sendGmail: {
        user: '',
        pass: '',
    },
    mail: {
        MAIL_SMTP_SERVER: process.env.MAIL_SERVER,
        MAIL_SMTP_PORT: process.env.MAIL_PORT,
        MAIL_SECURE: process.env.MAIL_SECURE,
        MAIL_SMTP_USER: process.env.MAIL_USER,
        MAIL_SMTP_PASSWORD: process.env.MAIL_PASSWORD,
        MAIL_FROM: process.env.MAIL_FROM,
    },
    redis: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_URL,
        password: process.env.REDIS_PWD,
    },
    BULLMQ: {
        QUEUE: process.env.BULLMQ,
        TOPIC: process.env.BULLMQ_TOPIC,
    },
    website: process.env.WEBSITE,
    graylog: {
        ip: process.env.GRAYLOG_IP,
        port: process.env.GRAYLOG_PORT,
        project: process.env.GRAYLOG_PROJECT,
    },
    aes_key: process.env.AES_KEY,
    apiKey: process.env.API_KEY,
    smsBrandname: {
        rootUrl: process.env.SMS_API_ROOT_URL,
        ApiKey: process.env.SMS_API_KEY,
        SecretKey: process.env.SMS_SECRET_KEY,
        Sandbox: process.env.SMS_SANDBOX,
    },
    zalo: {
        appId: process.env.ZALO_APP_ID,
        appSecret: process.env.ZALO_APP_SECRET,
    },
    MQTT: {
        HOST: process.env.REACT_APP_DOMAIN,
        PORT: process.env.REACT_APP_PORT_MQTT,
        USERNAME: process.env.REACT_APP_USER,
        PASSWORD: process.env.REACT_APP_PASSWORD,
        VIETINBANK: process.env.REACT_APP_MQTT_TOPIC_VIETINBANK,
    },
};

module.exports = config;
