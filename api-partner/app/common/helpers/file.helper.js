const fs = require('fs');
const mkdirp = require('mkdirp-promise');
const appRoot = require('app-root-path');
const logger = require('../classes/logger.class');
const path = require('path');
const folderUploadName = 'uploads';
const base64 = require('is-base64');
const axios = require('axios');
const FormData = require('form-data');
const config = require('../../../config/config');


const readFileAsString = (path) => {
    try {
        return fs.readFileSync(path, { encoding: 'utf8' });
    } catch (e) {
        logger.error(e, { 'function': 'fileHelper.readFileAsString' });
    }
    return '';
};


const createFileAsString = (path) => {
    return new Promise((resolve, reject) => {
        const form = new FormData();
        form.append('path', path);
        axios({
            method: 'post',
            url: `${config.domain_cdn}/upload/directory`,
            data: form,
            headers: {
                ...form.getHeaders(),
                ...{ 'Authorization': `APIKEY ${config.upload_apikey}` }
            },
        }).then(res => resolve(res.data))
            .catch(reject)
    })

}


const uploadFormData = (base64) => {
    return new Promise((resolve, reject) => {
        const form = new FormData();
        form.append('type', 'default');
        form.append('file', Buffer.from(base64.split(';base64,').pop(), 'base64'), { filename: 'document.png' })
        axios.post(`${config.domain_cdn}/upload`, form, { headers: { ...form.getHeaders(), ...{ 'Authorization': `APIKEY ${config.upload_apikey}` } } })
            .then(res => resolve(res.data))
            .catch(reject)
    })
}

const saveTmpBase64File = (pathFile, base64) => {
    try {
        const base64data = base64.split(';base64,').pop();
        fs.writeFileSync(pathFile, base64data, { encoding: 'base64' });

        return pathFile;
    } catch (e) {
        return null;
    }
};

const getPathStorage = () => {
    return `${appRoot}/storage`;
};

const getPathUpload = () => {
    return getPathStorage() + `/${folderUploadName}`;
};

/**
 * Save base64 to file
 *
 * @param folderPath
 * @param base64
 * @param fileName
 * @returns {Promise<*>}
 */
const saveBase64 = async (folder, base64, filename) => {
    try {
        if (isBase64(folder)) {
            base64 = folder;
        }
        const res = await uploadFormData(base64);
        return res.data && res.data.file ? res.data.file : null

    } catch (e) {
        logger.error(e, { 'function': 'fileHelper.saveBase64' });

        return null;
    }
};

const getExtensionFromBase64 = (base64, extentions) => {
    if (!extentions || extentions.length === 0)
        extentions = ['.jpeg', '.jpg', '.png', '.gif', '.xls', '.xlsx', '.ods', '.mp3', '.mp4', '.doc', '.docx', '.odt', '.pdf', '.txt', '.ppt', '.pptx'];
    const extention = base64.substring(base64.indexOf('/') + 1, base64.indexOf(';base64'));
    if (extentions.includes('.' + extention))
        return extention;
    return null;
};

function isBase64(data) {
    //   return base64(strBase64, {allowEmpty: false, allowMime: true});
    if (!data) return false;
    return (data.indexOf('data:image/jpg;base64') != -1 ||
        data.indexOf('data:image/png;base64') != -1 ||
        data.indexOf('data:image/jpeg;base64') != -1);
}

const getExtensionFromFileName = (fileName, extentions) => {
    if (!extentions || extentions.length === 0)
        extentions = ['.jpeg', '.jpg', '.png', '.gif', '.xls', '.xlsx', '.ods', '.mp3', '.mp4', '.doc', '.docx', '.odt', '.pdf', '.txt', '.ppt', '.pptx', '.jfif'];
    var arrName = fileName.split('.');
    const extention = arrName.length > 1 ? arrName[arrName.length - 1] : '';
    if (extentions.includes('.' + extention))
        return extention;
    return null;
};

const createGuid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        var r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

const saveFile = async (base64, folderName) => {
    let url = null;
    try {
        if (isBase64(base64)) {
            const extension = getExtensionFromBase64(base64);
            const guid = createGuid();
            url = await saveBase64(
                folderName,
                base64,
                `${guid}.${extension}`
            );
        } else {
            url = base64.split(config.domain_cdn)[1];
        }
    } catch (e) {
        logger.error(e, {
            function: "file.helper.saveFile",
        });
    }
    return url;
};


const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
        const form = new FormData();
        for (let i = 0; i < file.length; i++) {
            form.append("file", file[i]?.buffer, { filename: file[i]?.originalname });
        }
        axios
            .post(`${config.domain_cdn}/upload/file`, form, {
                headers: {
                    ...form.getHeaders(),
                    ...{ Authorization: `APIKEY ${config.upload_apikey}` },
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            })
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                console.log(err)
                let { response } = err;
                if (!response) {
                    throw err;
                }
                const { data } = response;
                reject(data.message || "Lỗi upload video!");
            });
    });
};


// const saveVideo = async (video) => {
//     let url = null;
//     try {
//         if (video.buffer || !video.includes(config.domain_cdn)) {
//             url = await fileHelper.saveVideo(video);
//         } else {
//             url = video.split(config.domain_cdn)[1];
//         }
//     } catch (e) {
//         logger.error(e, {
//             'function': 'groupService.saveVideo',
//         });
//     }
//     return url;
// };

const saveVideo = async (video) => {
    try {
        const res = await uploadVideo(video instanceof Array ? video[0] : video);
        return res.data && res.data.file ? res.data.file : null
    } catch (e) {
        logger.error(e.message || e, { 'function': 'fileHelper.video' });
        return null;
    }
};

const uploadVideo = file => {
    return new Promise((resolve, reject) => {
        const form = new FormData();
        form.append('video', file.buffer)
        axios.post(`${config.domain_cdn}/upload/video`, form, {
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            headers: { ...form.getHeaders(), ...{ 'Authorization': `APIKEY ${config.upload_apikey}` } }
        })
            .then(res => {
                console.log("🚀  file: newfeed-post.service.js  chay 4", res)
                resolve(res.data);
            })
            .catch((err) => {

                let { response } = err;
                console.log("🚀  file: newfeed-post.service.js  chay 5", err)
                if (!response) {
                    throw err;
                }
                const { data } = response;
                reject(data.message || 'Lỗi upload video!')
            })
    })
}

module.exports = {
    readFileAsString,
    saveBase64,
    getExtensionFromBase64,
    isBase64,
    getExtensionFromFileName,
    saveFile,
    saveVideo,
    uploadFile,
    uploadVideo,
    createFileAsString
};
