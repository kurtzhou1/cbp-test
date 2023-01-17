// project import
import invoiceWorkManagePage from './invoiceWorkManagePage';
import dashboard from './dashboard';
import createJournal from './createJournal';
import liabilityManage from './liabilityManage';
import creditBalanceManage from './creditBalanceManage';
import accountsReceivable from './accountsReceivable';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
    // items: [dashboard, pages, utilities, support]
    items: [dashboard, invoiceWorkManagePage, createJournal, liabilityManage, creditBalanceManage, accountsReceivable]
};

export default menuItems;
