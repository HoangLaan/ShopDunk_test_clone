import { Progress } from 'antd';
import ModalPortal from 'components/shared/ModalPortal/ModalPortal';

function ModalSelectAll({ loadedData, totalItems, onClose, onConfirm, title = 'Chọn khách hàng' }) {
  return (
    <ModalPortal
      title={`${title} (${loadedData?.length || 0} / ${totalItems})`}
      width={600}
      onClose={onClose}
      onConfirm={onConfirm}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Progress type='circle' percent={Math.round(Number((loadedData?.length || 0) / totalItems) * 100)} />
      </div>
    </ModalPortal>
  );
}

export default ModalSelectAll;
