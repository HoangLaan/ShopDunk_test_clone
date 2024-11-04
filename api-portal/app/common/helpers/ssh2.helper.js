const { Client } = require('ssh2');

const connect = async () => {
    const config = {
        host: '112.106.187.161',
        port: 22,
        username: 'SEHC-B2Bi',
        password: '34%ib2b-ches',
        tryKeyboard: true,
    };

    const conn = new Client();

    const connectPromise = () => {
        return new Promise((resolve, reject) => {
            conn.on('keyboard-interactive', (name, instructions, instructionsLang, prompts, finish) => {
                finish([config.password]);
            });

            conn.connect(config, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    };

    const sftpPromise = () => {
        return new Promise((resolve, reject) => {
            conn.sftp((err, sftp) => {
                if (err) reject(err);
                else resolve(sftp);
            });
        });
    };

    try {
        await connectPromise();
        console.log('Connected to SFTP server');

        const sftp = await sftpPromise();
        // Perform SFTP operations using the 'sftp' object
        // For example, sftp.readdir, sftp.put, sftp.get, etc.

        // Disconnect from the SFTP server

        conn.end();

        console.log('Disconnected from SFTP server');
        return 'connect successful';
    } catch (err) {
        console.error('Error connecting to SFTP server:', err);
        return err;
    }
};

module.exports = {
    connect,
};
