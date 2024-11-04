const express = require('express');
const validate = require('express-validation');
const rules = require('./sale-channel.rule');
const saleChannelController = require('./sale-channel.controller');
const routes = express.Router();
const prefix = '/sale-channel';
const multer  = require('multer')
const upload = multer()


// Lấy danh sách file theo conversation id
routes.route('/facebook/conversation/:conversation_id')
    .get(saleChannelController.getListFileByConversationId)

// Kiểm tra xem user đã có trên hệ thông chưa
routes.route('/facebook/admin/:user_id(\\d+)/status')
    .get(saleChannelController.getUserStatus);

// Lấy access token của user đăng nhập
routes.route('/facebook/admin/:user_id(\\d+)/token')
    .get(saleChannelController.getUserToken);

// Đông bộ dữ liêu facebook với hệ thống
routes.route('/facebook/sync')
    .post(saleChannelController.syncFacebookData);

// Lấy danh sách trang đã kết nối và chưa kết nối
routes.route('/facebook/pages')
    .get(saleChannelController.getListPage);

// Lay trang thai cac trang da ket noi hay chua
routes.route('/facebook/pages/sync')
    .post(validate(rules.pageToSync), saleChannelController.getListPageToSync)
    .put(validate(rules.pageToSync), saleChannelController.syncPageData)

// Lay danh sach pages da connect
routes.route('/facebook/pages/connect')
    .get(saleChannelController.getListPageConnect)

// Go ket noi
routes.route('/facebook/pages/disconnect')
    .post(validate(rules.deletePageConnect), saleChannelController.deletePageConnect)

// Update page
routes.route('/facebook/pages/:page_id(\\d+)/avatar')
    .put(saleChannelController.updatePageAvatar)

// Lấy danh sách hội thoại gần nhất của page
routes.route('/facebook/pages/:page_id(\\d+)/conversations')
    .get(saleChannelController.getListConversation)

// Lấy token của page
routes.route('/facebook/pages/:page_id(\\d+)/token')
    .get(saleChannelController.getPageAccessToken)

// Cập nhật thông tin của người dùng bao gom thong tin, danh sach don hang, ghi chu va nhan
routes.route('/facebook/pages/:page_id(\\d+)/users/:user_id(\\d+)')
    .get(saleChannelController.detailFacebookUser)
    .delete(saleChannelController.deleteFacebookUser)
    .put(validate(rules.updateFBUser), saleChannelController.updateFacebookUser)

// Lay danh sach don hang cua nguoi dung facebook (top 3)
routes.route('/facebook/pages/:page_id(\\d+)/users/:user_id(\\d+)/order')
    .get(saleChannelController.getListOrderFacebookUser)
    .post(validate(rules.createOrder), saleChannelController.createOrderFacebookUser)

// Lay danh sach ghi chu cua nguoi dung facebook
routes.route('/facebook/pages/:page_id(\\d+)/users/:user_id(\\d+)/note')
    .get(saleChannelController.getListNoteFacebookUser)
    .post(validate(rules.createNote), saleChannelController.createNoteFacebookUser)

// Xoa note cua nguoi dung facebook
routes.route('/facebook/pages/:page_id(\\d+)/users/:user_id(\\d+)/note/:note_id(\\d+)')
    .delete(saleChannelController.deleteNoteFacebookUser)

// Lay danh sach hash tag cua nguoi dung facebook
routes.route('/facebook/pages/:page_id(\\d+)/users/:user_id(\\d+)/hash-tag')
    .get(saleChannelController.getListHashTagFacebookUser)
    .post(validate(rules.createOrUpdateHashTag), saleChannelController.createOrUpdateHashTagFacebookUser)

// Lay danh sach hashtag
routes.route('/hash-tag')
    .get(saleChannelController.getListHashTag)
    .post(validate(rules.createHashTag), saleChannelController.createHashTag)

// Xoa hash tag
routes.route('/hash-tag/:hash_tag_id(\\d+)')
    .delete(saleChannelController.deleteHashTag)
    .put(validate(rules.updateHashTag), saleChannelController.updateHashTag)

// Lấy cuộc hội thoại với người dùng facebook từ fanpage
// Gui tin nhan cho nguoi dung facebook
routes.route('/facebook/pages/:page_id(\\d+)/users/:user_id(\\d+)/conversations/:conversation_id/messages')
    .get(saleChannelController.getMessageFacebookLive)
    .post(upload.any(), saleChannelController.sendMessageFacebookUser)

// Dinh kem file
routes.route('/facebook/pages/:page_id(\\d+)/users/:user_id(\\d+)/conversations/:conversation_id/messages/attachment')
    .post(upload.any(), saleChannelController.upload)

// Cap nhat tin nhan nguoi dung
routes.route('/facebook/pages/:page_id(\\d+)/users/:user_id(\\d+)/conversations/:conversation_id/messages/:message_id')
    .put(saleChannelController.updateMessageFacebookUser)

// Lay danh sach san pham
routes.route('/products')
    .get(saleChannelController.getListProduct)

// Tim ekiem san pham goi y
routes.route('/products/search')
    .get(saleChannelController.searchProduct)

routes.route('/products/search/:product_id(\\d+)')
    .get(saleChannelController.detailProduct)

// Lay danh sach chuong trinh khuyen mai duoc ap dung
routes.route('/promotions')
    .post(saleChannelController.getListPromotion)

module.exports = {
    prefix,
    routes,
};
