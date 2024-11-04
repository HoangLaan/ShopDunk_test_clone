import React from 'react';
import { useParams } from 'react-router';
import ReturnConditionAdd from './ReturnConditionAdd';

export default function ExperienceEdit() {
  const { id } = useParams();
  return <ReturnConditionAdd id={id} disabled={false} />;
}
