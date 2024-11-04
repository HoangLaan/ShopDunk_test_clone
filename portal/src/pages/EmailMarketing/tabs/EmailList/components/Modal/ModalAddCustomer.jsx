import React, { useCallback, useState, useEffect } from 'react';
import { defaultPaging } from 'utils/helpers';
import CustomerFilter from './section/CustomerFilter';
import CustomerTable from './section/CustomerTable';
import { useFormContext } from 'react-hook-form';

import { getListPartner } from 'services/partner.service';
import CustomerLeadService from 'services/customer-lead.service';
import { getListCustomer } from 'services/customer.service';

import styled from 'styled-components';
import { EMAIL_LIST_TYPE } from 'pages/EmailMarketing/utils/constants';

const ModalWrapper = styled.div`
  .bw_modal_wrapper {
    max-height: 80vh;
    max-width: 80vw;
  }
`;

const AddCustomerModal = ({ open, onClose }) => {
  const methods = useFormContext();

  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 25,
  });
  const [dataItem, setDataItem] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);

  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataItem;

  const loadData = useCallback(async () => {
    setLoading(true);
    const emailListType = methods.getValues('email_list_type');
    if (emailListType === EMAIL_LIST_TYPE.PRESONAL) {
      getListCustomer(params)
        .then((data) => {
          data?.items?.forEach((_) => {
            _.customer_id = _.member_id;
            _.customer_name = _.full_name;
            _.customer_email = _.email;
            _.customer_phone = _.phone_number;
          });
          setDataItem(data);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (emailListType === EMAIL_LIST_TYPE.LEAD) {
      CustomerLeadService.getList(params)
        .then((data) => {
          data?.items?.forEach((_) => {
            _.customer_id = _.data_leads_id;
            _.customer_code = _.data_leads_code;
            _.customer_name = _.full_name;
            _.customer_email = _.email;
            _.customer_phone = _.phone_number;
          });
          setDataItem(data);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (emailListType === EMAIL_LIST_TYPE.PARNER) {
      getListPartner(params)
        .then((data) => {
          data?.items?.forEach((_) => {
            _.customer_id = _.partner_id;
            _.customer_code = _.partner_code;
            _.customer_name = _.partner_name;
            _.customer_email = _.email;
            _.customer_phone = _.phone_number;
          });
          setDataItem(data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [params]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onChange = (params) => {
    setParams((prev) => ({ ...prev, ...params }));
  };

  return (
    <ModalWrapper>
      <div className={`bw_modal ${open ? 'bw_modal_open' : ''}`} id='bw_addProduct'>
        <div class='bw_modal_container bw_w800 bw_modal_wrapper'>
          <div class='bw_title_modal'>
            <h3>Danh sách khách hàng</h3>
            <span class='fi fi-rr-cross-small bw_close_modal' onClick={onClose}></span>
          </div>
          <div>
            <div>
              <div className='bw_main_wrapp'>
                <CustomerFilter onChange={onChange} />
                <CustomerTable
                  onChangePage={(page) => {
                    onChange({ page });
                  }}
                  data={items}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  page={page}
                  totalItems={totalItems}
                  loading={loading}
                  closeModal={onClose}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AddCustomerModal;
