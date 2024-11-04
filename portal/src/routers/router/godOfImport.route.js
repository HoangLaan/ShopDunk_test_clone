import React from 'react';

const GodOfImportPage = React.lazy(() => import('pages/GodOfImport/GodOfImport'));

const godOfImport = [
  {
    path: '/god-of-import',
    exact: true,
    name: 'Import Excel',
    function: 'MD_BLOCK_VIEW',
    component: GodOfImportPage,
  },
];

export default godOfImport;
