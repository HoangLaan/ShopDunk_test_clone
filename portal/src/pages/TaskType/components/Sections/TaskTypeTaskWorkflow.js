import React from 'react';
import TableTaskWorkflow from '../Tables/TableTaskWorkflow';
import BWAccordion from 'components/shared/BWAccordion/index';

function TaskTypeTaskWorkflow({ title, disabled }) {
  return (
    <BWAccordion title={title}>
      <TableTaskWorkflow disabled={disabled} />
    </BWAccordion>
  );
}

export default TaskTypeTaskWorkflow;
