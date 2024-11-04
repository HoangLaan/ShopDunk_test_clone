import FileManagerPage from 'pages/FileManager/pages/FileManagerPage';

const fileManagerRoute = [
  {
    path: '/file-manager',
    exact: true,
    name: 'Quản lý file',
    function: 'FILE_MANAGER',
    component: FileManagerPage,
  },
]

export default fileManagerRoute
