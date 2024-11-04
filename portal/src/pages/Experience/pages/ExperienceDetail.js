import React from 'react';
import { useParams } from 'react-router';
import ExperienceAdd from './ExperienceAdd';

export default function ExperienceDetail() {
  const { id } = useParams();
  return <ExperienceAdd id={id} disabled={true} />;
}
