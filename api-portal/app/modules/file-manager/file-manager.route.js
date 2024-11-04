const express = require('express');
const validate = require('express-validation');
const fileManagerController = require('./file-manager.controller');
const routes = express.Router();
const rules = require('./file-manager.rule');
const prefix = '/file-manager';
const multer = require('multer');
const upload = multer();


// const whitelistfile = [
//     'image/png',
//     'image/jpeg',
//     'image/jpg',
//     "video/mp4",
//     "video/3gpp",
//     "video/quicktime",
//     "application/pdf",
//     "application/msword",
//     "application/x-zip-compressed",
//     "application/zip",
//     "application/vnd.ms-powerpoint",
//     "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     "application/vnd.ms-excel",

//     // .psd
//     "application/x-photoshop",
//     "image/vnd.adobe.photoshop",
//     "image/svg+xml",
//     // .ai
//     "application/postscript",
//     // .xml
//     "application/xml",
//     "text/xml",
//     // .rp
//     "image/vnd.rn-realpix",
//     // .xmind
//     "application/x-xmind",
//     // .stl
//     "model/stl",
//     "model/x.stl-ascii",
//     "model/x.stl-binary",

//     // .glb
//     "model/gltf-binary",
//     "model/gltf+json",
//     // . 3dm
//     "x-world/x-3dmf",
//   ]

//     const Blacklistfile = [
//           "exe",
//           "clock",
//           "sh"      
//     ]



//   const upload = multer({
//     fileFilter: (req, file, cb) => {
//       if (!whitelistfile.includes(file.mimetype)) {
//         return cb(new Error('Lỗi upload file không thuộc định dạng được cho phép'))
//       }
//       cb(null, true)
//     }
//   })


// Tạo tập tin   
routes.route('/file').post(upload.any(),fileManagerController.createFile)


routes.route('/type-document')
      .get(fileManagerController.getListDocumentType) // Lấy danh sách loại tài liệu 
      .post(validate(rules.createDocumentType),fileManagerController.createDocumentType) // Thêm loại tài liệu
      .put(validate(rules.updateDocumentType),fileManagerController.UpdateDocumentType) // Thay đổi tên loại tài liệu

routes.route('/type-document/:document_type_id(\\d+)').delete(fileManagerController.deleteDocumentType); // Xóa loại tài liệu


// Lấy danh sách tập tin
routes.route('/file').get(fileManagerController.getListFile);

// Lấy danh sách thư mục
routes.route('/directory').get(fileManagerController.getListDirectory);

// Lấy danh sách cả tập tin và thư mục
routes.route('/all').get(fileManagerController.getListAll);


// Lấy danh sách cả tập tin và thư mục theo search
routes.route('/search-all').get(fileManagerController.getListSearchAll);


// Khởi tạo thư mục 
routes.route('/dir').post( validate(rules.createDirectory)  ,fileManagerController.createDirectory);

// chia sẻ thư mục 
routes.route('/share-dir').post(fileManagerController.shareDirectory);


// Lấy danh sách quyền và người dùng đã được chia sẻ
routes.route('/list-share').get(fileManagerController.getListUserShare)

// Thay đổi tên thư mục
routes.route('/rename-dir').put(validate(rules.updateDirName),fileManagerController.renameDirectory);

// Di chuyển thư mục
routes.route('/move-dir').put(fileManagerController.moveDirectory);

// xóa thư mục
routes.route('/dir/:directory_id(\\d+)').delete(fileManagerController.deleteDirectory);

// chia sẻ tập tin
routes.route('/share-file').post(fileManagerController.shareFile);

// Lấy chi tiết của tập tin
routes.route('/infor-file/:file_id(\\d+)').get(fileManagerController.getInforFile);

routes.route('/infor-directory/:directory_id(\\d+)').get(fileManagerController.getInforDirectory);


// Di chuyển tập tin
routes.route('/move-file').put(fileManagerController.moveFile);

// Đổi tên tập tin
routes.route('/rename-file').put(validate(rules.updateFileName) ,fileManagerController.renameFile);

// Xóa tập tin 
routes.route('/file/:file_id(\\d+)').delete(fileManagerController.deleteFile)

// Gắn nhán dán với tập tin createTagFile
routes.route('/tag-file').post(fileManagerController.createTagFile);

// Gắn nhán dán với thư mục
routes.route('/tag-dir').post(fileManagerController.createTagDirectory);

// Khởi tạo loại nhãn
routes.route('/tag').post(validate(rules.createFileManager) , fileManagerController.createTagType);

// Lấy danh sách loại nhãn tập tin
routes.route('/tag').get(fileManagerController.getListTagTypeFile);

// Xóa loại nhãn dán tập tin 
routes.route('/tag/:file_tag_id(\\d+)').delete(fileManagerController.deleteFileTagType)

// tải tập tin với web 
routes.route('/download/:file_id(\\d+)').get(fileManagerController.downloadFile)


// tải tập tin với app 
routes.route('/download-app/:file_id(\\d+)').get(fileManagerController.downloadFileForApp)







module.exports = {
  prefix,
  routes,
};