function showNotification() {
  // Check if the browser supports notifications
  if (!('Notification' in window)) {
    // alert('This browser does not support desktop notifications.');
  } else {
    // Request permission to show notifications
    Notification.requestPermission().then(function (permission) {
      if (permission === 'granted') {
        var notification = new Notification('ShopDunk ERP', {
          body: 'Có cuộc gọi đến',
          icon: 'https://erp.shopdunk.com/assets/image/favicon.ico',
        });
      } else {
        // alert('Permission for Notifications denied.');
      }
    });
  }
}

export default showNotification;
