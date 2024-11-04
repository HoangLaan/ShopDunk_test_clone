import React from 'react';
import UserScheduleAdd from './UserScheduleAdd';
import queryString from 'query-string';

const UserScheduleDetail = () => {
  return <UserScheduleAdd querySchedule={queryString.parse(window.location.search) ?? {}} isEdit={false} />;
};
export default UserScheduleDetail;
