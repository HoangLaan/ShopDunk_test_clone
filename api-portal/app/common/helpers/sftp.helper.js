let Client = require('ssh2-sftp-client');
const config = require('../../../config/config');

class SFTPClient {
    constructor() {
        this.client = new Client();
    }

    async connect() {
        // const connectionData = {
        //     host: config.SamsungSFTP.ip,
        //     port: config.SamsungSFTP.port,
        //     username: config.SamsungSFTP.username,
        //     password: config.SamsungSFTP.password,
        // };

        const connectionData = {
            host: 'mft.samsungb2bi.co.kr', // host production
            port: 22,
            username: 'SEHC-B2Bi',
            password: '12#ib2b-ches',
            tryKeyboard: true,
        };
        try {
            await this.client.connect(connectionData);

            return 'Connected to B2Bi Samsung server !';
        } catch (err) {
            console.log('Failed to connect:', err);
            return err;
        }
    }

    async disconnect() {
        console.log('Disconnected to B2Bi Samsung server !:');
        await this.client.end();
    }

    async listFiles(remoteDir, fileGlob) {
        console.log(`Listing ${remoteDir} ...`);
        let fileObjects;
        try {
            fileObjects = await this.client.list(remoteDir, fileGlob);
        } catch (err) {
            console.log('Listing failed:', err);
        }

        const fileNames = [];

        for (const file of fileObjects) {
            if (file.type === 'd') {
                console.log(`${new Date(file.modifyTime).toISOString()} PRE ${file.name}`);
            } else {
                console.log(`${new Date(file.modifyTime).toISOString()} ${file.size} ${file.name}`);
            }

            fileNames.push(file.name);
        }

        return fileNames;
    }

    async uploadFile(localFile, remoteFile) {
        console.log(`Uploading ${localFile} to ${remoteFile} ...`);
        try {
            await this.client.put(localFile, remoteFile);
            return {
                error: null,
                message: 'succes',
                status: true,
            };
        } catch (err) {
            console.error('Uploading failed:', err);
            return {
                error: err,
                message: err?.message,
                status: false,
            };
        }
    }

    async downloadFile(remoteFile, localFile) {
        console.log(`Downloading ${remoteFile} to ${localFile} ...`);
        try {
            await this.client.get(remoteFile, localFile);
        } catch (err) {
            console.error('Downloading failed:', err);
        }
    }

    async deleteFile(remoteFile) {
        console.log(`Deleting ${remoteFile}`);
        try {
            await this.client.delete(remoteFile);
        } catch (err) {
            console.error('Deleting failed:', err);
        }
    }
}

module.exports = SFTPClient;

// (async () => {
//     const parsedURL = new URL(process.env.SFTPTOGO_URL);
//     const port = parsedURL.port || 22;
//     const { host, username, password } = parsedURL;

//     //* Open the connection
//     const client = new SFTPClient();
//     await client.connect({ host, port, username, password });

//     //* List working directory files
//     await client.listFiles('.');

//     //* Upload local file to remote file
//     await client.uploadFile('./local.txt', './remote.txt');

//     //* Download remote file to local file
//     await client.downloadFile('./remote.txt', './download.txt');

//     //* Delete remote file
//     await client.deleteFile('./remote.txt');

//     //* Close the connection
//     await client.disconnect();
// })();
