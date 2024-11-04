import { TaskTypeProvider } from 'pages/TaskType/utils/context';
import { StyledTaskType } from 'pages/TaskType/utils/styles';

function PageProvider({ children }) {
  return (
    <StyledTaskType>
      <TaskTypeProvider>{children}</TaskTypeProvider>
    </StyledTaskType>
  );
}

export default PageProvider;
