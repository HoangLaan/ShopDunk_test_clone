import React from 'react';
import { useParams } from 'react-router';
import ReturnConditionAdd from './ReturnConditionAdd';

export default function ExperienceDetail() {
  const { id } = useParams();
  return <ReturnConditionAdd id={id} disabled={true} />;
}
