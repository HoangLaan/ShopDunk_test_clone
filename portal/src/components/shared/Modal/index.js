import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import BWButton from '../BWButton/index';
import styled from 'styled-components';
import { isFunctionComponent } from 'utils/helpers';

const ModalStyled = styled.div`
  .bw_modal_container {
    width: ${(props) => props.witdh ?? ''}!important;
    max-width: ${(props) => props.witdh ?? ''}!important;
  }
`;

const Modal = ({
  children,
  open,
  onClose,
  header,
  footer,
  witdh,
  lalbelClose,
  styleModal,
  headerStyles,
  titleModal,
  closeModal,
}) => {
  const jsx_header = useCallback(() => {
    if (isFunctionComponent(header)) {
      const Header = header;
      return <Header />;
    } else {
      return <h3>{header}</h3>;
    }
  }, [header]);

  return (
    <React.Fragment>
      <ModalStyled witdh={witdh} className={`bw_modal ${open ? 'bw_modal_open' : ''}`} id='bw_notice_del'>
        <div className='bw_modal_container' style={styleModal}>
          <div className='bw_title_modal bw_border_bottom' style={headerStyles}>
            {jsx_header()}
            <span className='bw_close_modal fi fi-rr-cross-small' onClick={onClose} style={closeModal} />
          </div>
          <div className='bw_main_modal'>{children}</div>
          <div className='bw_footer_modal bw_justify_content_right'>
            {footer}
            <BWButton
              type='button'
              outline
              className='bw_close_modal'
              content={lalbelClose ?? 'Quay về'}
              onClick={onClose}
            />
          </div>
        </div>
      </ModalStyled>
    </React.Fragment>
  );
};
Modal.propTypes = {
  open: PropTypes.bool,
  className: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  children: PropTypes.node,
};

export default Modal;