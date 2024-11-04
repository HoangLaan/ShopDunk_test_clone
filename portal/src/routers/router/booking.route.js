import React from 'react';

const Booking = React.lazy(() => import('pages/Booking/pages/BookingPage'));
const BookingAdd = React.lazy(() => import('pages/Booking/pages/BookingAdd'));
const BookingEdit = React.lazy(() => import('pages/Booking/pages/BookingEdit'));
const BookingDetail = React.lazy(() => import('pages/Booking/pages/BookingDetail'));

const booking = [
  {
    path: '/list-booking-care',
    exact: true,
    name: 'Danh sách đặt lịch',
    function: 'ST_BOOKING_VIEW',
    component: Booking,
  },
  {
    path: '/booking/add',
    exact: true,
    name: 'Thêm mới đặt lịch',
    function: 'ST_BOOKING_ADD',
    component: BookingAdd,
  },
  {
    path: '/booking/edit/:id',
    exact: true,
    name: 'Chi tiết đặt lịch',
    function: 'ST_BOOKING_EDIT',
    component: BookingEdit,
  },
  {
    path: '/booking/detail/:id',
    exact: true,
    name: 'Chi tiết đặt lịch',
    function: 'ST_BOOKING_VIEW',
    component: BookingDetail,
  },
  // {
  //   path: '/orders/payment/:order_id',
  //   exact: true,
  //   name: 'Thông tin thanh toán đơn hàng',
  //   function: 'SL_ORDER_EDIT',
  //   component: OrdersPayment,
  // },
];

export default booking;
