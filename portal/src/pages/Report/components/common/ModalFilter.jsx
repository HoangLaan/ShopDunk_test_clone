import FormSelect from "components/shared/BWFormControl/FormSelect";
import FormDebouneTreeSelect from "components/shared/BWFormControl/FormTreeSelect";
import { keyReport, periodOptions } from "pages/Report/utils/constant";
import { FormProvider, useForm } from "react-hook-form";
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import styled from "styled-components";
import ProductTable from "./TableProduct";
import { useCallback, useEffect, useMemo, useState } from "react";
import { defaultPaging, defaultParams, mapDataOptions4Select } from "utils/helpers";
import { getList } from 'services/product.service';
import CustomerTable from "./TableCustomer";
import moment from "moment";
import useGetOptions, { optionType } from "hooks/useGetOptions";
import { getOptionsModel, getOptionsTreeview } from "services/product-category.service";
import FormDebouneSelect from "components/shared/BWFormControl/FormDebouneSelect";
import { getOptionsGlobal } from "services/global.service";
import { getListAccount } from "services/partner.service";
import { debounce } from "lodash";
import FormInput from "components/shared/BWFormControl/FormInput";

const Wrapper = styled.div`
  @keyframes loading {
    to {
      background-position-x: -30%;
    }
  }
  .loader__filter__searchbar {
    height: 42px;
    border-radius: 7px;
    width: 100%;
  }
  .bw_frm_box .loader__filter__searchbar {
    background-size: 200% 100%;
    background-position-x: 180%;
    animation: 1s loading ease-in-out infinite;
  }
`;
const ModalFilter = ({isOpenModal, setIsOpenModal, setParams, setTimeReport, methods, keyFilter}) => {
    // const businessOptions = useGetOptions(optionType.business, { isHasOptionAll: true });
    // const storeOptions = useGetOptions(optionType.storeByBusiness, {parent_id: '0'});
    // const methods = useForm();
    const {watch} = methods;

    const [keywordProd, setKeywordProd] = useState(undefined);
    const [keywordAcc, setKeywordAcc] = useState(undefined);
    const [dataProduct, setDataProduct] = useState(defaultPaging);
    const [dataAccount, setDataAccount] = useState(defaultPaging);
    const [dataSelectProd, setDataSelectProd] = useState([]);
    const [dataSelectAcc, setDataSelectAcc] = useState([]);
    const [isCheckedProd, setIsCheckedProd] = useState(false);
    const [isCheckedAcc, setIsCheckedAcc] = useState(false);
    
    const [dataStore, setDataStore] = useState([]);
    const [dataBusiness, setDataBusiness] = useState([]);
    const [queryProd, setQueryProd] = useState({
        ...defaultParams,
        itemsPerPage: 5
    });
    const [queryAcc, setQueryAcc] = useState({
        ...defaultParams,
        itemsPerPage: 5
    });

    const { 
        items: itemsProduct, 
        itemsPerPage: itemsPerPageProd, 
        page: pageProd, 
        totalItems: totalItemsProd, 
        totalPages: totalPagesProd 
    } = dataProduct;

    const { 
        items: itemsAccount, 
        itemsPerPage: itemsPerPageAcc, 
        page: pageAcc, 
        totalItems: totalItemsAcc, 
        totalPages: totalPagesAcc 
    } = dataAccount;

    const getProductList = useCallback(async () => {
        getList(queryProd).then((data) => {
          setDataProduct(data);
        });
      }, [queryProd]);
    
    const getAccountList = useCallback(async () => {
      getListAccount(queryAcc).then((data) => {
        setDataAccount(data);
      });
    }, [queryAcc]);

    const getOptionsStore = useCallback(async () => {
        getOptionsGlobal({type: optionType.storeByBusiness, parent_id: watch('business_id').join('|')}).then((data) => {
          setDataStore(mapDataOptions4Select(data));
        });
      }, [isOpenModal]);

    const getOptionsBusiness = useCallback(async () => {
        getOptionsGlobal({type: optionType.business, is_active: 1}).then((data) => {
          setDataBusiness(mapDataOptions4Select(data));
        });
      }, [isOpenModal]);

    const getProductModel = useCallback(
      async (search = '') => {
        let models = [];
        if (watch('parent_id')) {
          const res = await getOptionsModel({ search, limit: 100, productCategoryId: watch('parent_id') });
          models = mapDataOptions4Select(res);
        }
        return models;
      },
      [],
    );
    
    useEffect(()=> {
      getProductList()
    }, [getProductList]);
    
    useEffect(()=> {
      getAccountList()
    }, [getAccountList]);

    useEffect(() => {
      getProductModel()
    }, [getProductModel]);

    useEffect(() => {
      if(!watch('period')){
        methods.setValue('period', 20);
        methods.setValue('created_date_from', moment().startOf('month').format('DD/MM/YYYY'));
        methods.setValue('created_date_to', moment().endOf('month').format('DD/MM/YYYY'));
      }
    },[])

    const submitReport = () => {
      setIsOpenModal(false)
      const store_id = watch('store_id')?.map(i => i?.value);
      const business_id = watch('business_id')?.map(i => i?.value);
      const product_id = dataSelectProd?.map(o => o?.product_id);
      const account_id = dataSelectAcc?.map(o => o?.id);

      setParams({
        ...methods.getValues(),
        store_id,
        business_id,
        model_id: watch('model_id')?.value || undefined,
        product_id,
        account_id
      });
    }

    const handleSearch = useMemo(() => {
      const loadKeyWord = (event) => {
        setKeywordProd(event.target.value);
        setQueryProd({...queryProd, search: event.target.value})
      };
      return debounce(loadKeyWord, 700);
    }, [keywordProd]);

    const handleSearchAcc = useMemo(() => {
      const loadKeyWord = (event) => {
        setKeywordAcc(event.target.value);
        setQueryAcc({...queryAcc, keyword: event.target.value})
      };
      return debounce(loadKeyWord, 700);
    }, [keywordAcc]);

    return (
        <FormProvider {...methods}>
            <div className="bw_calling bw_modal bw_modal_open">
              <div className="rp_fill">
                <h3 style={{fontWeight: 700}}>CHỌN THAM SỐ</h3>
                <Wrapper>
                    <div className='bw_row bw_mt_1 bw_mb_1 '>
                      <div className='bw_col_6 bw_frm_box_rp_fill bw_h-100'>
                        <label htmlFor="">Kỳ báo cáo</label>
                        <FormSelect
                            field='period'
                            list={periodOptions}
                            onChange={(value) => {
                                methods.setValue('period', value);
                                const selectedItem = periodOptions.find((_) => _.value === value);
                                if (selectedItem) {
                                setTimeReport(selectedItem);
                                methods.setValue('created_date_from', selectedItem.from_date);
                                methods.setValue('created_date_to', selectedItem.to_date);
                                }
                            }}
                        />
                      </div>
                    </div>
                    <div className={`${keyFilter === keyReport.REPORT_ACCOUTING ? 'bw_flex' : 'bw_row'}  bw_mt_1 bw_mb_1`} style={{gap: '10px'}}>
                      <div className={`${keyFilter !== keyReport.REPORT_ACCOUTING && 'bw_col_6'} bw_frm_box_rp_fill bw_h-100`} style={keyFilter === keyReport.REPORT_ACCOUTING ? {flex: 1} : {}}>
                        <label htmlFor="">Thời gian cụ thể</label>
                        <FormDateRange
                          disabled={watch('period') !== null}
                          allowClear={true}
                          fieldStart={'created_date_from'}
                          fieldEnd={'created_date_to'}
                          placeholder={['Từ ngày', 'Đến ngày']}
                          format={'DD/MM/YYYY'}
                          onChange={(value) => {
                            methods.setValue('created_date_from', moment(value[0]?.$d).format('DD/MM/YYYY'));
                            methods.setValue('created_date_to', moment(value[1]?.$d).format('DD/MM/YYYY'));
                            setTimeReport({
                              value: null,
                              from_date: moment(value[0]?.$d).format('DD/MM/YYYY'),
                              to_date: moment(value[1]?.$d).format('DD/MM/YYYY')
                            })
                          }}
                          style={{color: 'black', fontWeight: 'bold'}}
                        />
                      </div>
                      {
                        keyFilter === keyReport.REPORT_ACCOUTING &&
                        <div className='bw_frm_box_rp_fill bw_h-100' style={{flex: 1}}>
                          <label htmlFor="">IMEI/Seri</label> <br />
                          <FormInput style={{
                            width: '100%', 
                            border: '1px solid silver', 
                            marginTop: '7px',
                            padding: '3px'}} placeholder='IMEI/Seri' field='imei' type='text' />
                        </div>
                      }
                    </div>
                </Wrapper>
                <div className='bw_flex bw_mt_1 bw_mb_1 ' style={{gap: '10px'}}>
                  <div className='bw_frm_box_rp_fill bw_h-100' style={{flex: 1}}>
                    <label htmlFor="">Chi nhánh</label>
                    <FormDebouneSelect
                      mode='multiple'
                      placeholder='--Chọn--'
                      field='business_id'
                      fetchOptions={getOptionsBusiness}
                      options={dataBusiness}
                      onChange={(value) => {
                        methods.setValue('business_id', value);
                      }}
                    />
                  </div>
                  <div className='bw_frm_box_rp_fill bw_h-100' style={{flex: 1}}>
                    <label htmlFor="">Cửa hàng</label>
                    <FormDebouneSelect
                      disabled={!watch('business_id')}
                      mode='multiple'
                      placeholder='--Chọn--'
                      fetchOptions={getOptionsStore}
                      options={dataStore}
                      field='store_id'
                    />
                  </div>
                </div>
                <div className='bw_flex bw_mt_1 bw_mb_1 ' style={{gap: '10px'}}>
                    <div className='bw_frm_box_rp_fill bw_h-100' style={{flex: 1}}>
                    <label htmlFor="">Ngành hàng</label>
                    <FormDebouneTreeSelect
                      field='parent_id'
                      treeDataSimpleMode
                      fetchOptions={getOptionsTreeview}
                      allowClear={true}
                      onChange={(value) => {
                        // methods.clearErrors('product_category_id');
                        methods.setValue('parent_id', value);
                      }}
                    />
                    </div>
                    <div className='bw_frm_box_rp_fill bw_h-100' style={{flex: 1}}>
                    <label htmlFor="">Nhóm hàng</label>
                      <FormDebouneSelect
                        field='model_id'
                        fetchOptions={getProductModel}
                        allowClear={true}
                        placeholder='--Chọn--'
                        disabled={!watch('parent_id')}
                      />
                    </div>
                </div>

                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <label className="bw_checkbox">
                    <input type="checkbox" title="Chon tat ca" onChange={() => setIsCheckedProd(!isCheckedProd)} />
                    <span></span>
                    Chọn tất cả {isCheckedProd && `| Đã chọn ${totalItemsProd?.toLocaleString('de-DE')} bản ghi`}
                  </label>
                  <input 
                    className='bw_inp bw_inp_success' 
                    style={{width: '30%'}} 
                    placeholder='Nhập từ khóa tìm kiếm' 
                    onChange={handleSearch}
                  />
                </div>
                <ProductTable
                    onChangePage={(page) => {
                        setQueryProd({
                        ...queryProd,
                        page,
                        });
                    }}
                    data={itemsProduct}
                    totalPages={totalPagesProd}
                    itemsPerPage={itemsPerPageProd}
                    page={pageProd}
                    totalItems={totalItemsProd}
                    setParams={setQueryProd}
                    setDataSelect={setDataSelectProd}
                    dataSelect={dataSelectProd}
                />

                <div className="bw_mt_2" style={{display: 'flex', justifyContent: 'space-between'}}>
                  <label className="bw_checkbox">
                    <input type="checkbox" title="Chon tat ca" onChange={() => setIsCheckedAcc(!isCheckedAcc)} />
                    <span></span>
                    Chọn tất cả {isCheckedAcc && `| Đã chọn ${totalItemsAcc?.toLocaleString('de-DE')} bản ghi`}
                  </label>
                  <input 
                    className='bw_inp bw_inp_success' 
                    style={{width: '30%'}} 
                    placeholder='Nhập từ khóa tìm kiếm' 
                    onChange={handleSearchAcc}
                  />
                </div>
                <div className="bw_mb_4">
                <CustomerTable
                  onChangePage={(page) => {
                      setQueryAcc({
                      ...queryAcc,
                      page,
                      });
                  }}
                  data={itemsAccount}
                  totalPages={totalPagesAcc}
                  itemsPerPage={itemsPerPageAcc}
                  page={pageAcc}
                  totalItems={totalItemsAcc}
                  setParams={setQueryAcc}
                  setDataSelect={setDataSelectAcc}
                  dataSelect={dataSelectAcc}
                />
                </div>

                <div className="bw_flex report-btn bw_mt_2">
                    <div className="bw_flex" style={{gap: '15px'}}>
                        <button 
                            className="rp_btn_cancel" 
                            onClick={() => setIsOpenModal(false)}>Hủy</button>
                        <button 
                            className="rp_btn_clear"
                            onClick={() => methods.reset()}>Xóa điều kiện</button>
                    </div>
                    <div>
                        <button 
                        className="rp_btn_report" 
                        onClick={() => {
                          submitReport()
                        }}>Xem báo cáo</button>
                    </div>
                </div>
              </div>
            </div>
        </FormProvider>
    )
}

export default ModalFilter;