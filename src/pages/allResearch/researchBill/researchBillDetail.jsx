import { useState, useRef } from 'react';
import { Typography, Grid, Button, FormControl, Box, TextField, Table } from '@mui/material';

// day
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

// project import
import { BootstrapDialogTitle } from 'components/commonFunction';
import { handleNumber } from 'components/commonFunction';
// table
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

// api
import { queryToDecutBill } from 'components/apis.jsx';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        color: theme.palette.common.black,
        paddingTop: '0.2rem',
        paddingBottom: '0.2rem',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        paddingTop: '0.2rem',
        paddingBottom: '0.2rem',
    },
    [`&.${tableCellClasses.body}.totalAmount`]: {
        fontSize: 14,
        paddingTop: '0.2rem',
        paddingBottom: '0.2rem',
        backgroundColor: '#CFD8DC',
    },
}));

const ResearchBillDetail = ({ datailInfo }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false); //檢視
    const [billMasterInfo, setBillMasterInfo] = useState({});
    const [billDetailInfo, setBillDetailInfo] = useState([]);
    const totalPaidAmount = useRef(0);

    const initData = () => {
        totalPaidAmount.current = 0;
        setBillMasterInfo({});
        setBillDetailInfo([]);
    };

    const viewBillDetail = (id) => {
        let tmpQuery = queryToDecutBill + '/BillMasterID=' + id;
        fetch(tmpQuery, {
            method: 'GET',
            Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    let tmpAmount = 0;
                    data.forEach((i) => {
                        console.log('i=>>', i);
                        setBillMasterInfo(i.BillMaster);
                        setBillDetailInfo(i.BillDetail);
                        i.BillDetail.forEach((row) => {
                            tmpAmount = tmpAmount + row.PaidAmount;
                        });
                    });
                    totalPaidAmount.current = tmpAmount;
                    setIsDialogOpen(true);
                }
            })
            .catch((e) => console.log('e1=>', e));
    };

    const handleClose = () => {
        initData();
        setIsDialogOpen(false);
    };

    return (
        <>
            <Dialog maxWidth="md" fullWidth open={isDialogOpen}>
                <BootstrapDialogTitle>帳單明細</BootstrapDialogTitle>
                <DialogContent>
                    <Grid
                        container
                        spacing={1}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid
                            item
                            md={2}
                            lg={2}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Typography
                                variant="h5"
                                sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}
                            >
                                帳單號碼：
                            </Typography>
                        </Grid>
                        <Grid item sm={3} md={3} lg={3}>
                            <TextField
                                value={billMasterInfo.BillingNo}
                                fullWidth
                                variant="outlined"
                                size="small"
                                disabled
                            />
                        </Grid>
                        <Grid
                            item
                            md={2}
                            lg={2}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Typography
                                variant="h5"
                                sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}
                            >
                                帳單到期日：
                            </Typography>
                        </Grid>
                        <Grid item sm={3} md={3} lg={3}>
                            <TextField
                                value={dayjs(billMasterInfo.DueDate).format('YYYY/MM/DD')}
                                fullWidth
                                disabled={true}
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                                <Table sx={{ minWidth: 300 }} stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center">
                                                費用項目
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                計帳段號
                                            </StyledTableCell>
                                            <StyledTableCell align="center">會員</StyledTableCell>
                                            <StyledTableCell align="center">
                                                應收金額
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                已實收金額
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                已實付金額
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                摘要說明
                                            </StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {billDetailInfo?.map((row, id) => {
                                            return (
                                                <TableRow
                                                    key={row.FeeItem + row.PartyName + id}
                                                    sx={{
                                                        '&:last-child td, &:last-child th': {
                                                            border: 0,
                                                        },
                                                    }}
                                                >
                                                    <TableCell align="center">
                                                        {row.FeeItem}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {row.BillMilestone}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {row.PartyName}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        ${handleNumber(row.OrgFeeAmount.toFixed(2))}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        $
                                                        {handleNumber(
                                                            row.ReceivedAmount.toFixed(2),
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        ${handleNumber(row.PaidAmount.toFixed(2))}
                                                    </TableCell>
                                                    <TableCell align="center">{row.Note}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        <TableRow
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 },
                                            }}
                                        >
                                            <StyledTableCell className="totalAmount" align="center">
                                                Total
                                            </StyledTableCell>
                                            <StyledTableCell
                                                className="totalAmount"
                                                align="center"
                                            />
                                            <StyledTableCell
                                                className="totalAmount"
                                                align="center"
                                            />
                                            <StyledTableCell className="totalAmount" align="center">
                                                $
                                                {handleNumber(
                                                    billMasterInfo.FeeAmountSum?.toFixed(2),
                                                )}
                                            </StyledTableCell>
                                            <StyledTableCell className="totalAmount" align="center">
                                                $
                                                {handleNumber(
                                                    billMasterInfo.ReceivedAmountSum?.toFixed(2),
                                                )}
                                            </StyledTableCell>
                                            <StyledTableCell className="totalAmount" align="center">
                                                ${handleNumber(totalPaidAmount.current?.toFixed(2))}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                className="totalAmount"
                                                align="center"
                                            ></StyledTableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        sx={{ mr: '0.05rem' }}
                        variant="contained"
                        onClick={() => {
                            handleClose();
                        }}
                    >
                        關閉
                    </Button>
                </DialogActions>
            </Dialog>
            <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                <Table sx={{ minWidth: 300 }} stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">帳單號碼</StyledTableCell>
                            <StyledTableCell align="center">計帳段號</StyledTableCell>
                            <StyledTableCell align="center">會員</StyledTableCell>
                            <StyledTableCell align="center">帳單到期日</StyledTableCell>
                            <StyledTableCell align="center">應收金額</StyledTableCell>
                            <StyledTableCell align="center">已實收金額</StyledTableCell>
                            <StyledTableCell align="center">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {datailInfo?.map((row, id) => {
                            return (
                                <TableRow
                                    key={row?.BillingNo + row?.BillMilestone + id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <StyledTableCell align="center">
                                        {row.BillingNo}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.BillMilestone}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.PartyName}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {dayjs(row.DueDate).format('YYYY/MM/DD')}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        ${handleNumber(row.FeeAmountSum)}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        ${handleNumber(row.ReceivedAmountSum)}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                '& button': {
                                                    mx: { md: 0.3, lg: 0.7, xl: 1.5 },
                                                    p: 0,
                                                },
                                            }}
                                        >
                                            <Button
                                                color="primary"
                                                variant="outlined"
                                                onClick={() => {
                                                    viewBillDetail(row.BillMasterID);
                                                }}
                                            >
                                                檢視帳單明細
                                            </Button>
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

export default ResearchBillDetail;
