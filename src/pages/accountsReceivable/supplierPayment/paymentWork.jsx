import { useState, useRef, useEffect } from 'react';

// project import
import { handleNumber, BootstrapDialogTitle } from 'components/commonFunction';
import MainCard from 'components/MainCard';
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
    TextField
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

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

import { toBillDataapi, sendJounary } from 'components/apis.jsx';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        // backgroundColor: theme.palette.common.gary,
        color: theme.palette.common.black,
        paddingTop: '0.2rem',
        paddingBottom: '0.2rem'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
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

const ToGenerateDataList = ({ isDialogOpen, handleDialogClose, editPaymentInfo, actionName, invoiceNo, dueDate, savePaymentEdit }) => {
    const dispatch = useDispatch();
    const [toPaymentDetailInfo, setToPaymentDetailInfo] = useState([]); //帳單明細檔
    const feeAmountTotal = useRef(0); //應收金額
    const receivedAmountTotal = useRef(0); //已實收金額
    const paidAmountTotal = useRef(0); //已實付金額
    const toPaymentAmountTotal = useRef(0); //未付款金額
    const payAmountTotal = useRef(0); //此次付款金額

    const changeNote = (note, billMasterID, billDetailID) => {
        let tmpArray = toPaymentDetailInfo.map((i) => i);
        tmpArray.forEach((i) => {
            if (i.BillMasterID === billMasterID && i.BillDetailID === billDetailID) {
                i.Note = note;
            }
        });
        setToPaymentDetailInfo(tmpArray);
    };

    const changePayAmount = (payment, billMasterID, billDetailID) => {
        payAmountTotal.current = 0;
        let tmpArray = toPaymentDetailInfo.map((i) => i);
        tmpArray.forEach((i) => {
            if (i.BillMasterID === billMasterID && i.BillDetailID === billDetailID) {
                i.PayAmount = Number(payment);
            }
            payAmountTotal.current = payAmountTotal.current + (i.PayAmount ? i.PayAmount : Number(i.ReceivedAmount - i.PaidAmount));
        });
        setToPaymentDetailInfo(tmpArray);
    };

    const handleSaveEdit = () => {
        let tmpArray = toPaymentDetailInfo.map((i) => i);
        tmpArray.forEach((i) => {
            i.PayAmount = i.PayAmount ? i.PayAmount : Number(i.ReceivedAmount - i.PaidAmount);
        });
        savePaymentEdit(tmpArray);
    };

    const handleTmpSaveEdit = () => {
        savePaymentEdit(editPaymentInfo);
    };

    const sendInfo = () => {
        if (payAmountTotal.current + paidAmountTotal.current > receivedAmountTotal.current) {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'info',
                        message: `已實付金額+此次付款金額超出已實收金額${handleNumber(
                            (payAmountTotal.current + paidAmountTotal.current - receivedAmountTotal.current).toFixed(2)
                        )}`
                    }
                })
            );
        }
    };

    useEffect(() => {
        // let tmpArray = editPaymentInfo.map((i) => i);
        let tmpArray = JSON.parse(JSON.stringify(editPaymentInfo));
        tmpArray.forEach((i) => {
            // i.PayAmount = i.PayAmount ? i.PayAmount : Number(i.ReceivedAmount - i.PaidAmount);
            feeAmountTotal.current = feeAmountTotal.current + i.FeeAmount;
            receivedAmountTotal.current = receivedAmountTotal.current + i.ReceivedAmount;
            paidAmountTotal.current = paidAmountTotal.current + i.PaidAmount;
            toPaymentAmountTotal.current = toPaymentAmountTotal.current + (i.FeeAmount - i.PaidAmount);
            payAmountTotal.current = payAmountTotal.current + (i.PayAmount ? i.PayAmount : Number(i.ReceivedAmount - i.PaidAmount));
        });
        if (isDialogOpen) {
            setToPaymentDetailInfo(tmpArray);
        }
    }, [isDialogOpen]);

    return (
        <Dialog maxWidth="xxl" open={isDialogOpen}>
            <BootstrapDialogTitle>收款明細與編輯付款資訊</BootstrapDialogTitle>
            <DialogContent>
                <Grid container spacing={1} display="flex" justifyContent="center" alignItems="center" sx={{ fontSize: 10 }}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Grid container spacing={1} display="flex" justifyContent="center" alignItems="center" sx={{ fontSize: 10 }}>
                            <Grid item xs={1} sm={1} md={1} lg={1}>
                                <Typography
                                    variant="h5"
                                    sx={{ fontSize: { lg: '0.5rem', xl: '0.88rem' }, ml: { lg: '0.5rem', xl: '1.5rem' } }}
                                >
                                    會員：
                                </Typography>
                            </Grid>
                            <Grid item xs={2} sm={2} md={2} lg={2}>
                                <TextField
                                    value={invoiceNo}
                                    fullWidth
                                    disabled={true}
                                    variant="outlined"
                                    size="small"
                                    // type="number"
                                />
                            </Grid>
                            <Grid item xs={2} sm={2} md={2} lg={2}>
                                <Typography
                                    variant="h5"
                                    sx={{ fontSize: { lg: '0.5rem', xl: '0.88rem' }, ml: { lg: '0.5rem', xl: '1.5rem' } }}
                                >
                                    發票到期日：
                                </Typography>
                            </Grid>
                            <Grid item xs={2} sm={2} md={2} lg={2}>
                                <TextField
                                    value={dayjs(dueDate).format('YYYY/MM/DD')}
                                    fullWidth
                                    disabled={true}
                                    variant="outlined"
                                    size="small"
                                    // type="number"
                                />
                            </Grid>
                            <Grid item xs={5} sm={5} md={5} lg={5} />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <MainCard title="帳單明細列表">
                            <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                                <Table sx={{ minWidth: 300 }} stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center">費用項目</StyledTableCell>
                                            <StyledTableCell align="center">計帳段號</StyledTableCell>
                                            <StyledTableCell align="center">會員</StyledTableCell>
                                            <StyledTableCell align="center">應收金額</StyledTableCell>
                                            <StyledTableCell align="center">已實收金額</StyledTableCell>
                                            <StyledTableCell align="center">已實付金額</StyledTableCell>
                                            <StyledTableCell align="center">未付款金額</StyledTableCell>
                                            <StyledTableCell align="center">摘要說明</StyledTableCell>
                                            <StyledTableCell align="center">此次付款金額</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {toPaymentDetailInfo?.map((row) => {
                                            let toPayment = row.FeeAmount - row.PaidAmount;
                                            return (
                                                <TableRow
                                                    key={row.InvoiceNo + row?.BillMasterID + row?.BillDetailID}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="center">{row.FeeItem}</TableCell>
                                                    <TableCell align="center">{row.BillMilestone}</TableCell>
                                                    <TableCell align="center">{row.PartyName}</TableCell>
                                                    <TableCell align="center">{`$${handleNumber(row.FeeAmount.toFixed(2))}`}</TableCell>
                                                    <TableCell align="center">{`$${handleNumber(
                                                        row.ReceivedAmount.toFixed(2)
                                                    )}`}</TableCell>
                                                    <TableCell align="center">{`$${handleNumber(row.PaidAmount.toFixed(2))}`}</TableCell>
                                                    <TableCell align="center">{`$${handleNumber(toPayment.toFixed(2))}`}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.1rem' }} align="center">
                                                        <TextField
                                                            size="small"
                                                            sx={{ minWidth: 75 }}
                                                            value={row.Note}
                                                            onChange={(e) => {
                                                                changeNote(e.target.value, row.BillMasterID, row.BillDetailID);
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <TextField
                                                            size="small"
                                                            inputProps={{ step: '.01' }}
                                                            sx={{ minWidth: 75 }}
                                                            value={
                                                                row.PayAmount ? row.PayAmount : Number(row.ReceivedAmount - row.PaidAmount)
                                                            }
                                                            type="number"
                                                            onChange={(e) => {
                                                                changePayAmount(e.target.value, row.BillMasterID, row.BillDetailID);
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <StyledTableCell className="totalAmount" align="center">
                                                Total
                                            </StyledTableCell>
                                            <StyledTableCell className="totalAmount" align="center" />
                                            <StyledTableCell className="totalAmount" align="center" />
                                            <StyledTableCell className="totalAmount" align="center">
                                                {handleNumber(feeAmountTotal.current.toFixed(2))}
                                            </StyledTableCell>
                                            <StyledTableCell className="totalAmount" align="center">
                                                {handleNumber(receivedAmountTotal.current.toFixed(2))}
                                            </StyledTableCell>
                                            <StyledTableCell className="totalAmount" align="center">
                                                {handleNumber(paidAmountTotal.current.toFixed(2))}
                                            </StyledTableCell>
                                            <StyledTableCell className="totalAmount" align="center">
                                                {handleNumber(toPaymentAmountTotal.current.toFixed(2))}
                                            </StyledTableCell>
                                            <StyledTableCell className="totalAmount" align="center" />
                                            <StyledTableCell className="totalAmount" align="center">
                                                {handleNumber(payAmountTotal.current.toFixed(2))}
                                            </StyledTableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </MainCard>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                {actionName === 'deduct' ? (
                    <>
                        <Button sx={{ mr: '0.05rem' }} variant="contained" onClick={handleDialogClose}>
                            儲存
                        </Button>
                        <Button sx={{ mr: '0.05rem' }} variant="contained" onClick={handleDialogClose}>
                            Reset
                        </Button>
                    </>
                ) : (
                    ''
                )}
                <Button
                    sx={{ mr: '0.05rem' }}
                    variant="contained"
                    onClick={() => {
                        sendInfo();
                        handleSaveEdit();
                        feeAmountTotal.current = 0;
                        receivedAmountTotal.current = 0;
                        paidAmountTotal.current = 0;
                        toPaymentAmountTotal.current = 0;
                        payAmountTotal.current = 0;
                    }}
                >
                    儲存
                </Button>
                <Button
                    sx={{ mr: '0.05rem' }}
                    variant="contained"
                    onClick={() => {
                        handleDialogClose();
                        handleTmpSaveEdit();
                        feeAmountTotal.current = 0;
                        receivedAmountTotal.current = 0;
                        paidAmountTotal.current = 0;
                        toPaymentAmountTotal.current = 0;
                        payAmountTotal.current = 0;
                    }}
                >
                    關閉
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ToGenerateDataList;
