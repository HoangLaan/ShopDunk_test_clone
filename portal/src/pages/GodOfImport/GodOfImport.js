import BWButton from 'components/shared/BWButton';
import React, { Fragment, useState } from 'react';

import { importStockInRequest, importOrder, importReceiveSlip } from 'services/god-of-import.service';

import ImportModal from './modals/ImportModal';

function GodOfImport() {
  const [isShowStockInRequestModal, setIsShowStockInRequestModal] = useState(false);
  const [importService, setImportService] = useState({ onPress: null });

  return (
    <Fragment>
      <div className='bw_main_wrapp'>
        <div className='bw_row bw_mt_2 bw_mb_2'>
          <div className='bw_col_2'>
            <BWButton
              type='primary'
              content='Nhập Yêu cầu nhập kho'
              onClick={() => {
                setImportService({
                  onPress: importStockInRequest,
                });
                setIsShowStockInRequestModal(true);
              }}
            />
          </div>
          <div className='bw_col_2'>
            <BWButton
              type='primary'
              content='Nhập Đơn hàng'
              onClick={() => {
                setImportService({
                  onPress: importOrder,
                });
                setIsShowStockInRequestModal(true);
              }}
            />
          </div>
          <div className='bw_col_2'>
            <BWButton
              type='primary'
              content='Nhập Phiếu thu'
              onClick={() => {
                setImportService({
                  onPress: importReceiveSlip,
                });
                setIsShowStockInRequestModal(true);
              }}
            />
          </div>
        </div>

        {isShowStockInRequestModal && (
          <ImportModal
            onClose={() => {
              setIsShowStockInRequestModal(false);
            }}
            importService={importService?.onPress}
          />
        )}
      </div>
    </Fragment>
  );
}

export default GodOfImport;
