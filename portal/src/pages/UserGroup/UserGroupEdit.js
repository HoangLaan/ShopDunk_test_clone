import React from 'react';
import { useParams } from 'react-router';
import UserGroupAdd from './UserGroupAdd';

export default function UserGroupEdit() {
    let { id } = useParams();
    return <UserGroupAdd userGroupId={id} isEdit={true} />;
}
