import { useState, useRef } from 'react';

// project import
import WriteOffWork from './writeOffWork';
import { handleNumber } from 'components/commonFunction';
import MainCard from 'components/MainCard';
import GenerateFeeTerminate from './generateFeeTerminate';

// material-ui
import {
    Typography,
    Button,
    Table,
    Dialog,
    DialogContent,
    DialogContentText,
    Grid,
    FormControl,
    InputLabel,
    Select,
    DialogActions,
    TextField,
    Box
} from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { alpha, styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs from 'dayjs';

import { toBillDataapi, sendJounary } from 'components/apis.jsx';

const ToWriteOffDataList = ({ listInfo }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false); //折抵作業
    const [isDeductWorkOpen, setIsDeductWorkOpen] = useState(false); //作廢
    const deductInfo = useRef({});
    const actionName = useRef('');
    const [editItem, setEditItem] = useState();
    const [currentAmount, setCurrentAmount] = useState(''); //目前金額
    const [infoTerminal, setInfoTerminal] = useState(false);
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            // backgroundColor: theme.palette.common.gary,
            color: theme.palette.common.black,
            paddingTop: '0.2rem',
            paddingBottom: '0.2rem'
        },
        [`&.${tableCellClasses.body}.totalAmount`]: {
            fontSize: 14,
            paddingTop: '0.2rem',
            paddingBottom: '0.2rem',
            backgroundColor: '#CFD8DC'
        }
    }));

    const handleDialogClose = () => {
        deductInfo.current = '可折抵CB';
        setIsDialogOpen(false);
        setEditItem();
    };

    const handleDialogOpen = (action, info) => {
        deductInfo.current = info;
        actionName.current = action;
        setIsDialogOpen(true);
    };

    const handleTerminalClose = () => {
        setInfoTerminal(false);
    };

    // //立帳作業
    // const toBillData = (wKMasterID) => {
    //     console.log('立帳作業wKMasterID=>>', wKMasterID);
    //     let tmpQuery = '/' + 'WKMasterID=' + wKMasterID;
    //     tmpQuery = toBillDataapi + tmpQuery;
    //     console.log('tmpQuery=>>', tmpQuery);
    //     fetch(tmpQuery, { method: 'GET' })
    //         .then((res) => res.json())
    //         .then((data) => {
    //             console.log('立帳成功=>>', data);
    //             let tmpAmount = 0;
    //             if (Array.isArray(data)) {
    //                 toBillDataMain.current = data ? data.InvoiceMaster : [];
    //                 setToBillDataInfo(data ? data.InvoiceDetail : []);
    //                 setTotalAmount(data ? data.TotalAmount : 0);
    //                 data.InvoiceDetail.forEach((i) => {
    //                     tmpAmount = tmpAmount + i.FeeAmountPost + i.Difference;
    //                 });
    //                 setCurrentAmount(tmpAmount.toFixed(2));
    //             }
    //         })
    //         .catch((e) => console.log('e1=>', e));
    //     setIsDialogOpen(true);
    // };

    // const changeDiff = (diff, id) => {
    //     let tmpArray = toBillDataInfo.map((i) => i);
    //     let tmpAmount = 0;
    //     tmpArray[id].Difference = Number(diff);
    //     tmpArray.forEach((i) => {
    //         tmpAmount = tmpAmount + i.FeeAmountPost + i.Difference;
    //     });
    //     setToBillDataInfo(tmpArray);
    //     setCurrentAmount(tmpAmount.toFixed(2));
    // };

    // 送出立帳(新增)
    // const sendJounaryInfo = () => {
    //     let tmpArray = toBillDataMain.current.map((i) => i);
    //     tmpArray.forEach((i) => {
    //         delete i.InvMasterID;
    //     });
    //     let tmpData = {
    //         TotalAmount: totalAmount,
    //         InvoiceMaster: tmpArray,
    //         InvoiceDetail: toBillDataInfo
    //     };
    //     fetch(sendJounary, { method: 'POST', body: JSON.stringify(tmpData) })
    //         .then((res) => res.json())
    //         .then((data) => {
    //             console.log('立帳成功=>>', data);
    //             apiQuery();
    //             handleDialogClose();
    //         })
    //         .catch((e) => console.log('e1=>', e));
    // };

    return (
        <>
            <WriteOffWork
                isDialogOpen={isDialogOpen}
                handleDialogClose={handleDialogClose}
                deductInfo={deductInfo.current}
                actionName={actionName.current}
            />
            <GenerateFeeTerminate infoTerminal={infoTerminal} handleTerminalClose={handleTerminalClose} />
            <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                <Table sx={{ minWidth: 300 }} stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">NO</StyledTableCell>
                            <StyledTableCell align="center">海纜名稱</StyledTableCell>
                            <StyledTableCell align="center">會員</StyledTableCell>
                            <StyledTableCell align="center">帳單號碼</StyledTableCell>
                            <StyledTableCell align="center">供應商</StyledTableCell>
                            <StyledTableCell align="center">帳單日期</StyledTableCell>
                            <StyledTableCell align="center">明細數量</StyledTableCell>
                            <StyledTableCell align="center">總價</StyledTableCell>
                            <StyledTableCell align="center">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listInfo?.map((row, id) => {
                            console.log('row=>>', row);
                            return (
                                <TableRow key={row.WKMasterID + row.InvoiceNo} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <StyledTableCell align="center">{id + 1}</StyledTableCell>
                                    <StyledTableCell align="center">{row.BillMaster.SubmarineCable}</StyledTableCell>
                                    <StyledTableCell align="center">{row.BillMaster.PartyName}</StyledTableCell>
                                    <StyledTableCell align="center">{row.BillMaster.BillingNo}</StyledTableCell>
                                    <StyledTableCell align="center">{row.BillMaster.SupplierName}</StyledTableCell>
                                    <StyledTableCell align="center">{dayjs(row.BillMaster.IssueDate).format('YYYY/MM/DD')}</StyledTableCell>
                                    <StyledTableCell align="center">{row.BillDetail?.length}</StyledTableCell>
                                    <StyledTableCell align="center">{row.BillMaster.FeeAmountSum}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Box sx={{ display: 'flex', justifyContent: 'center', '& button': { mx: 1, p: 0, fontSize: 1 } }}>
                                            <Button
                                                color="primary"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    handleDialogOpen('deduct', {
                                                        PartyName: row.PartyName,
                                                        IssueDate: dayjs(row.IssueDate).format('YYYY/MM/DD'),
                                                        SubmarineCable: row.SubmarineCable,
                                                        WorkTitle: row.WorkTitle
                                                    });
                                                }}
                                            >
                                                銷帳作業
                                            </Button>
                                            {/* <Button
                                                color="success"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    handleDialogOpen('view', {
                                                        PartyName: row.PartyName,
                                                        IssueDate: dayjs(row.IssueDate).format('YYYY/MM/DD'),
                                                        SubmarineCable: row.SubmarineCable,
                                                        WorkTitle: row.WorkTitle
                                                    });
                                                }}
                                            >
                                                檢視
                                            </Button> */}
                                            {/* <Button
                                                color="error"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    setInfoTerminal(true);
                                                }}
                                            >
                                                作廢
                                            </Button> */}
                                        </Box>
                                    </StyledTableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default ToWriteOffDataList;
