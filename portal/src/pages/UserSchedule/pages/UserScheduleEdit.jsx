import React from 'react';
import UserScheduleAdd from './UserScheduleAdd';
import queryString from 'query-string';

const UserScheduleEdit = () => {
  return <UserScheduleAdd querySchedule={queryString.parse(window.location.search) ?? {}} isEdit={true} />;
};
export default UserScheduleEdit;
