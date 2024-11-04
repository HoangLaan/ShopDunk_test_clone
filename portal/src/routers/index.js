// ** Routes Imports
import blockRoute from './router/block.route';
import brandRoute from './router/brand.route';
import businessRoutes from './router/business.route';
import clusterRoute from './router/cluster.route';
import commissionRoute from './router/commission';
import contractRoute from './router/contract.route';
import couponRoute from './router/coupon.route';
import customerLeadRoute from './router/customerLead.route';
import debitRoute from './router/debit.route';
import expendType from './router/expendType.route';
import functionGroupRoute from './router/functionGroup.route';
import functionsRoute from './router/functions.route';
import menuRoute from './router/menu.route';
import ordersRoute from './router/orders.route';
import orderStatusRoute from './router/orderStatus.route';
import orderTypeRoute from './router/orderType';
import outputTypeRoute from './router/outputType.route';
import Page404 from 'pages/PageError/Page404';
import partnerRoute from './router/partner.route';
import websiteDirectory from './router/websiteDirectory.route';
import priceReviewLevelRoute from './router/priceReviewLevel.route';
import pricesRoute from './router/prices.route';
import productAttributeRoute from './router/productAttribute.route';
import productCategoryRoute from './router/productCategory.route';
import productModelRoute from './router/productModel';
import productRoute from './router/product';
import receivePaymentSlipCash from './router/receivePaymentSlipCash.route';
import receivePaymentSlipCredit from './router/receivePaymentSlipCredit.route';
import ReceiveType from './router/ReceiveType.route';
import sourceRoute from './router/source.route';
import stocksDetailRoute from './router/stocksDetail.route';
import stocksInRequestRoute from './router/stocksInRequest.route';
import stocksInTypeRoute from './router/stocksInType.route';
import stocksOutRequestRoute from './router/stocksOutRequest.route';
import stocksOutTypeRoute from './router/stocksOutType.route';
import stocksTakeRequestRoute from './router/stocksTakeRequest.route';
import stocksRoute from './router/stocks.route';
import stocksTakeTypeRoute from './router/stocksTakeType.route';
import stocksTransferRoute from './router/stocksTransfer.route';
import stocksTypeRoute from './router/stocksType.route';
import storeRoute from './router/store.route';
import storeTypeRoute from './router/storeType.route';
import supplierRoute from './router/supplier.route';
import unitRoute from './router/unit';
import taskWorkFlowRoute from './router/taskWorkFlow.route';
import equipmentGroupRoute from './router/equipmentGroup.route';
import transferShiftTypeRoute from './router/transferShiftType.route';
import workScheduleTypeRoute from './router/workScheduleType.route';
import taskTypeRoute from './router/taskType.route';
import customerCareRoute from './router/customerCare.route';
import customerCaseTypeRoute from './router/customerCareType.route';
import customerType from './router/customerType.route';
import taskRoute from './router/task.route';
import permissionRoute from './router/permission.route';
import userRoute from './router/user.route';

import costTypeRoute from './router/costType.route';
import experienceRoute from './router/experience.route';
import returnConditionRoute from './router/return-condition.route';
import areaRoute from './router/area.route';
import businessUserRoute from './router/businessUser.route';
import degreeRoute from './router/degree.route';
import holidayRoute from './router/holiday.route';
import reviewRoute from './router/reviewList.route';
import hrSalaryRoute from './router/hrSalary.route';
import offWorkRoute from './router/offWork.route';
import offWorkReviewLevelRoute from './router/offWorkReviewLevel.route';
import offWorkTypeRoute from './router/offWorkType.route';
import positionRoute from './router/position.route';
import shiftRoute from './router/shift.route';
import skillGroupRoute from './router/skillGroup.route';
import skillLevelRoute from './router/skillLevel.route';
import sourseRoute from './router/source.route';
import timeKeepingRoute from './router/timeKeeping.route';
import userGroupsRoute from './router/userGroups.route';
import userLevelHistoryRoute from './router/userLevelHistory.route';
import useScheduleRoute from './router/userSchedule.route';
import dateCofirmTimeKeepingRoute from './router/dateConfirmTimeKeeping';
import departmentRoute from './router/department.route';
import businessTypeRoute from './router/businessType.route';
import lockshiftCloseRoute from './router/lockshiftClose.route';
import lockshiftOpen from './router/lockShiftOpen.route';
import budgetRoute from './router/budget.route';
import itemRoute from './router/item.route';
import bankUserRoute from './router/bankUser.route';
import accountingAccountRoute from './router/accountingAccount.route';
import budBudgetTypeRoutes from './router/budget-type.route';
import budgetPlanRoutes from './router/budgetPlan.route';
import mailRoute from './router/mail.route';
import cashFlowRoute from './router/cashFlow.route';
import requestUsingBudgetRoute from './router/requestUsingBudget.route';
import dashboardRoute from './router/dashboard.route';
import denominationRoutes from './router/denomination.route';
import lockShiftReportRoutes from './router/lockShiftReport.route';
import customerRoute from './router/customer.route';
import lockshiftClose from './router/lockshiftClose.route';
import transferShiftRoute from './router/transferShift.route';
import skillRoute from './router/skill.route';
import newsRoutes from './router/news.route';
import newsInsideRoutes from './router/newsInside.route';
import announceRoute from './router/announce.route';
import paymentFormRoute from './router/paymentForm.route';
import accountingPeriodRoute from './router/accountingPeriod.route';
import bankRoute from './router/bank.route';
import materialRoutes from './router/material.route';
import ledgerRoute from './router/ledger.route';
import materialGroupRoutes from './router/materialGroup.route';
import promotionOffersRoute from './router/promotionOffers.route';
import promotionRoute from './router/promotions.route';
import regimeTypeRoute from './router/regimeType.route';
import proposalRoute from './router/proposal.route';
import customerWorkingRoute from './router/customerWorking.route';
import workSchedule from './router/workSchedule';
import borrowRequestTypeRoute from './router/borrowRequestType.route';
import borrowRequestRoute from './router/borrowRequest.route';
import compareBudget from './router/compareBudget.route';
import emailMarketingRoute from './router/emailMarketing.route';
import regimeRoute from './router/regime.route';
import defaultAccount from './router/defaultAccount.route';
import fileManagerRoute from './router/fileManager.route';
import discountProgramRoute from './router/discountProgram.route';
import companyRoute from './router/company.route';
import requestPoRlRoute from './router/requestPoRl.route';
import companyTypeRoute from './router/companyType.route';
import purchaseRequisitionRoute from './router/purchaseRequisition.route';
import requestPurchaseOrderRoute from './router/requestPurchaseOrder.route';
import purchaseOrdersRoutes from './router/purchaseOrders.route';
import purchaseOrderDivisionRoute from './router/purchaseOrderDivision.route';
import vatRoute from './router/vat.route';
import announceTypeRoute from './router/announeType.route';
import positionLevelRoute from './router/positionLevel.route';
import exchangePointRoute from './router/exchangePoint.route';
import manufacturerRoute from './router/manufacturer.route';
import payPartnerRoute from './router/payPartner.route';
import profitLossRoute from './router/profitLoss.route';
import cumulatePointTypeRoute from './router/cumulatePointType.route';
import cdrsRoute from './router/voip.route';
import stocksTransferTypeRoutes from './router/stocksTransferType.route';
import stocksReviewLevelRoute from './router/stocksReviewLevel.route';
import installmentFormRoute from './router/installmentForm.route';
import installmentPartnerRoute from './router/installmentPartner.route';
import returnPolicyRoute from './router/return-policy.route';
import discountProgramProduct from './router/discountProgramProduct.route';
import relationshipRoute from './router/relationship.route';
import SellerStore from './router/seller-store-connect.route';
import zaloTemplateRoute from './router/zaloTemplate.route';
import originRoute from './router/origin.route';
import OffWorkManagementRoutes from './router/offwork-management.route';
import preOrderRoute from './router/preOrder.route';
import customerCouponRoute from './router/customerCoupon.route';
import payrollTemplateRoute from './router/payrollTemplate.route';
import PurchaseCostRoutes from './router/purchaseCost.route';
import shortLinkRoute from './router/shortLink.route';
import purchaseRequisitionTypeRoute from './router/purchaseRequisitionType.route';
import customerSubscriberReportRoute from './router/customerSubscriberReport.route';
import customerDepositRoute from './router/customerDeposit.route';
import payDebitRoute from './router/payDebit.route';
import interestContentRoute from './router/interestContent.route';
import timeKeepingClaimTypeRoute from './router/time-keeping-claim-type.route';
import timeKeepingClaimRoute from './router/time-keeping-claim.route';
import godOfImport from './router/godOfImport.route';
import documentTypeRoute from './router/documentType.route';

import saleChannelRoutes from './router/saleChanelFacebook.route';
import internalTransfer from './router/internal-transfer';
import internalTransferTypeRoute from './router/internalTransferType.route';
import cdrsSamRoute from './router/voipSamCenter.route';
import otherVoucherRoute from './router/otherVoucher.route';
import receiveDebitRoute from './router/receiveDebit.route';
import receivePayRoute from './router/receivePay.route';
import VoipReportRoute from './router/voipReport.route';
import appConfigRoute from './router/appConfig.route';
import customrerOfTaskRoute from './router/customrerOfTask.route';
import returnPurchaseRoute from './router/returnPurchase.route';
import groupServiceRoute from './router/groupService.route';
import careServiceRoute from './router/careService.route';
import bookingRoute from './router/booking.route';
import staticContentRoute from './router/staticContent.route';
import FunctionGroupRoutes from './router/reconcileDebt.route';
import FunctionGroupRoutesRevertDebt from './router/revertReconcileDebt.route';
import reportRoute from './router/report.route';

const otherPages = [
  {
    path: '/404',
    exact: true,
    name: 'Trang không tồn tại',
    component: Page404,
  },
];

const routes = [
  ...blockRoute,
  ...brandRoute,
  ...businessRoutes,
  ...clusterRoute,
  ...commissionRoute,
  ...contractRoute,
  ...couponRoute,
  ...customerLeadRoute,
  ...debitRoute,
  ...expendType,
  ...functionGroupRoute,
  ...functionsRoute,
  ...menuRoute,
  ...reviewRoute,
  ...ordersRoute,
  ...orderStatusRoute,
  ...orderTypeRoute,
  ...otherPages,
  ...outputTypeRoute,
  ...partnerRoute,
  ...priceReviewLevelRoute,
  ...pricesRoute,
  ...productAttributeRoute,
  ...productCategoryRoute,
  ...productModelRoute,
  ...productRoute,
  ...receivePaymentSlipCash,
  ...receivePaymentSlipCredit,
  ...ReceiveType,
  ...sourceRoute,
  ...stocksDetailRoute,
  ...stocksInRequestRoute,
  ...stocksInTypeRoute,
  ...stocksOutRequestRoute,
  ...stocksOutTypeRoute,
  ...stocksReviewLevelRoute,
  ...stocksRoute,
  ...stocksTakeTypeRoute,
  ...stocksTransferRoute,
  ...stocksTypeRoute,
  ...storeRoute,
  ...storeTypeRoute,
  ...supplierRoute,
  ...taskWorkFlowRoute,
  ...unitRoute,
  ...taskTypeRoute,
  ...customerCareRoute,
  ...customerCaseTypeRoute,
  ...customerType,
  ...taskRoute,
  ...permissionRoute,
  ...userRoute,
  ...costTypeRoute,
  ...experienceRoute,
  ...returnConditionRoute,
  ...customerRoute,
  ...areaRoute,
  ...businessUserRoute,
  ...degreeRoute,
  ...holidayRoute,
  ...hrSalaryRoute,
  ...offWorkRoute,
  ...offWorkReviewLevelRoute,
  ...offWorkTypeRoute,
  ...positionRoute,
  ...shiftRoute,
  ...skillGroupRoute,
  ...skillLevelRoute,
  ...sourseRoute,
  ...timeKeepingRoute,
  ...userGroupsRoute,
  ...userLevelHistoryRoute,
  ...useScheduleRoute,
  ...dateCofirmTimeKeepingRoute,
  ...departmentRoute,
  ...businessTypeRoute,
  ...lockshiftCloseRoute,
  ...budgetRoute,
  ...itemRoute,
  ...accountingAccountRoute,
  ...budBudgetTypeRoutes,
  ...budgetPlanRoutes,
  ...mailRoute,
  ...cashFlowRoute,
  ...requestUsingBudgetRoute,
  ...dashboardRoute,
  ...equipmentGroupRoute,
  ...denominationRoutes,
  ...bankUserRoute,
  ...lockShiftReportRoutes,

  ...lockshiftOpen,
  ...lockshiftClose,
  ...transferShiftRoute,
  ...skillRoute,
  ...newsRoutes,
  ...newsInsideRoutes,
  ...announceRoute,
  ...transferShiftTypeRoute,
  ...paymentFormRoute,
  ...accountingPeriodRoute,
  ...bankRoute,
  ...materialRoutes,
  ...workScheduleTypeRoute,
  ...regimeRoute,
  ...ledgerRoute,
  ...materialGroupRoutes,
  ...promotionOffersRoute,
  ...promotionRoute,
  ...defaultAccount,
  ...regimeTypeRoute,
  ...fileManagerRoute,
  ...proposalRoute,
  ...customerWorkingRoute,
  ...workSchedule,
  ...borrowRequestTypeRoute,
  ...borrowRequestRoute,
  ...discountProgramRoute,
  ...companyRoute,
  ...requestPoRlRoute,
  ...companyTypeRoute,
  ...purchaseRequisitionRoute,
  ...requestPurchaseOrderRoute,
  ...purchaseOrdersRoutes,
  ...purchaseOrderDivisionRoute,
  ...vatRoute,
  ...announceTypeRoute,
  ...compareBudget,
  ...positionLevelRoute,
  ...exchangePointRoute,
  ...manufacturerRoute,
  ...emailMarketingRoute,
  ...payPartnerRoute,
  ...cumulatePointTypeRoute,
  ...profitLossRoute,
  ...cdrsRoute,
  ...stocksTransferTypeRoutes,
  ...stocksTakeRequestRoute,
  ...returnPolicyRoute,
  ...discountProgramProduct,
  ...relationshipRoute,
  ...SellerStore,
  ...zaloTemplateRoute,
  ...originRoute,
  ...installmentFormRoute,
  ...installmentPartnerRoute,
  ...preOrderRoute,
  ...customerCouponRoute,
  ...OffWorkManagementRoutes,
  ...payrollTemplateRoute,
  ...PurchaseCostRoutes,
  ...shortLinkRoute,
  ...purchaseRequisitionTypeRoute,
  ...customerSubscriberReportRoute,
  ...customerDepositRoute,
  ...payDebitRoute,
  ...interestContentRoute,
  ...timeKeepingClaimTypeRoute,
  ...timeKeepingClaimRoute,
  ...godOfImport,
  ...documentTypeRoute,
  ...saleChannelRoutes,
  ...internalTransfer,
  ...cdrsSamRoute,
  ...internalTransferTypeRoute,
  ...otherVoucherRoute,
  ...receiveDebitRoute,
  ...receivePayRoute,
  ...VoipReportRoute,
  ...appConfigRoute,
  ...customrerOfTaskRoute,
  ...returnPurchaseRoute,
  ...groupServiceRoute,
  ...careServiceRoute,
  ...websiteDirectory,
  ...bookingRoute,
  ...staticContentRoute,
  ...FunctionGroupRoutes,
  ...FunctionGroupRoutesRevertDebt,
  ...reportRoute,
  // ...websiteDirectory,
];

export default routes;
