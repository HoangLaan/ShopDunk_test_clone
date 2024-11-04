import ocb_image from 'assets/banks/OCB.png';
import acb_image from 'assets/banks/acb.png';
import bidv_image from 'assets/banks/bidv.png';
import exim_image from 'assets/banks/exim.png';
import hsbc_image from 'assets/banks/hsbc.png';
import kien_long_image from 'assets/banks/kien_long.png';
import mb_image from 'assets/banks/mb.png';
import msb_image from 'assets/banks/msb.png';
import nam_a_image from 'assets/banks/nam_a.png';
import sacombank_image from 'assets/banks/sacombank.png';
import scb_image from 'assets/banks/scb.png';
import seabank_image from 'assets/banks/seabank.png';
import shb_image from 'assets/banks/shb.png';
import shinhanbank_image from 'assets/banks/shinhanbank.png';
import standard_chartered_image from 'assets/banks/standard_chartered.png';
import techcombank_image from 'assets/banks/techcombank.png';
import tpbank_image from 'assets/banks/tpbank.png';
import vib_image from 'assets/banks/vib.png';
import vietcombank_image from 'assets/banks/vietcombank.png';
import viettinbank_image from 'assets/banks/viettinbank.png';
import vpbank_image from 'assets/banks/vpbank.png';
import ab_image from 'assets/banks/ab.png';
import hdbank_image from 'assets/banks/hdbank.png';
import fe_credit_image from 'assets/banks/fe-credit.png';
import pvcombank_image from 'assets/banks/pvcombank.png';

import jcb_card from 'assets/cards/JCB.png';
import american_express_card from 'assets/cards/american-express.png';
import master_card from 'assets/cards/mastercard.png';
import visa_card from 'assets/cards/visa.png';

const BANK_IMAGES = [
  { bank_id: 'SACLVNVX', bank_code: 'SCB', bank_logo: scb_image },
  { bank_id: 'BIDVVNVX', bank_code: 'BIDV', bank_logo: bidv_image },
  { bank_id: 'SGTTVNVX', bank_code: 'SACOMBANK', bank_logo: sacombank_image },
  { bank_id: 'VNIBVNVX', bank_code: 'VIB', bank_logo: vib_image },
  { bank_id: 'MSCBVNVX', bank_code: 'MBBank', bank_logo: mb_image },
  { bank_id: 'SHBAVNVX', bank_code: 'SHB', bank_logo: shb_image },
  { bank_id: 'VPBKVNVX', bank_code: 'VPBank', bank_logo: vpbank_image },
  { bank_id: 'VTCBVNVX', bank_code: 'TECHCOMBANK', bank_logo: techcombank_image },
  { bank_id: 'MCOBVNVX', bank_code: 'MSB', bank_logo: msb_image },
  { bank_id: 'SEAVVNVX', bank_code: 'SEABANK', bank_logo: seabank_image },
  { bank_id: 'SHBKVNVX', bank_code: 'SHINHANBANK', bank_logo: shinhanbank_image },
  { bank_id: 'NAMAVNVX', bank_code: 'Nam A Bank', bank_logo: nam_a_image },
  { bank_id: 'HSBCVNVX', bank_code: 'HSBC', bank_logo: hsbc_image },
  { bank_id: 'TPBVVNVX', bank_code: 'TPBank', bank_logo: tpbank_image },
  { bank_id: 'SCBLVNVX', bank_code: 'Standard Chartered', bank_logo: standard_chartered_image },
  { bank_id: 'BFTVVNVX', bank_code: 'Vietcombank', bank_logo: vietcombank_image },
  { bank_id: 'EBVIVNVX', bank_code: 'EXIMBANK', bank_logo: exim_image },
  { bank_id: 'ORCOVNVX', bank_code: 'OCB', bank_logo: ocb_image },
  { bank_id: 'KLBKVNVX', bank_code: 'Kien Long Bank', bank_logo: kien_long_image },
  { bank_id: 'ASCBVNVX', bank_code: 'ACB', bank_logo: acb_image },
  { bank_id: 'ICBVVNVX', bank_code: 'VIETINBANK', bank_logo: viettinbank_image },
  { bank_id: 'ABBKVNVX', bank_code: 'An Binh Bank', bank_logo: ab_image },
  { bank_id: 'HDBCVNVX', bank_code: 'HDBANK', bank_logo: hdbank_image },
  { bank_id: 'VPBKVNVXFE', bank_code: 'FE CREDIT', bank_logo: fe_credit_image },
  { bank_id: 'WBVNVNVX', bank_code: 'PVCOMBANK', bank_logo: pvcombank_image },
];

const CARD_IMAGES = [
  { card_type: 'VC', card_logo: visa_card },
  { card_type: 'MC', card_logo: master_card },
  { card_type: 'JC', card_logo: jcb_card },
  { card_type: 'AE', card_logo: american_express_card },
];

const ONEPAY_ENV = {
  PAYMENT_URL: process.env.REACT_APP_ONEPAY_PAYMENT_URL,
  MERCHANT_ID: process.env.REACT_APP_ONEPAY_MERCHANT_ID,
  ACCESS_CODE: process.env.REACT_APP_ONEPAY_ACCESS_CODE,
  SECRET_CODE: process.env.REACT_APP_ONEPAY_SECRET_CODE,
};

export { BANK_IMAGES, CARD_IMAGES, ONEPAY_ENV };
