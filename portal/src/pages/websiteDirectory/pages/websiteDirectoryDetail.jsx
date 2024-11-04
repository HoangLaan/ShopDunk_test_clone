import React from 'react';
import { useParams } from 'react-router-dom';
import WebsiteDirectoryA from './websiteDirectoryAdd';

const WebsiteDirectoryDetail = () => {
  const { id } = useParams();

  return <WebsiteDirectoryA website_category_id={id} isEdit={false} />;
};
export default WebsiteDirectoryDetail;
