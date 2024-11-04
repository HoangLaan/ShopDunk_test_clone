import FormSection from 'components/shared/FormSection/index';
import LockshiftProducts from './section/LockshiftProducts';

const ProductList = ({ disabled, lockshiftId, onSubmit }) => {
  const detailForm = [
    {
      title: 'Danh sách hàng hóa',
      id: 'lockshift-productlist',
      component: LockshiftProducts,
      lockshiftId,
      disabled,
    },
  ];

  return <FormSection detailForm={detailForm} onSubmit={onSubmit} noSideBar disabled={disabled} />;
};

export default ProductList;
