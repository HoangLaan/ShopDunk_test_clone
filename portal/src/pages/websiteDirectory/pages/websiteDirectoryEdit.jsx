import React from 'react';
import { useParams } from 'react-router-dom';
import OrdersAdd from './websiteDirectoryAdd';

const WebsiteDirectoryEdit = () => {
  const { id } = useParams();

  return <OrdersAdd website_category_id={id} isEdit={true} />;
};
export default WebsiteDirectoryEdit;
