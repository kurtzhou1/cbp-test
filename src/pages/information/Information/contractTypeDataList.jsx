import { useState, useRef } from 'react';

// project import
import { handleNumber } from 'components/commonFunction';
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

import dayjs from 'dayjs';

import { toBillDataapi, sendJounary } from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const InvalidatedDataList = ({ listInfo, BootstrapDialogTitle, apiQuery }) => {
    const dispatch = useDispatch();
    // const fakeData = {
    //     TotalAmount: 5582012.72,
    //     InvoiceMaster: [
    //         {
    //             InvMasterID: 1,
    //             WKMasterID: 1,
    //             InvoiceNo: 'DT0170168-1',
    //             PartyName: 'Edge',
    //             SupplierName: 'NEC',
    //             SubmarineCable: 'SJC2',
    //             WorkTitle: 'Construction',
    //             IssueDate: '2022-09-09T00:00:00',
    //             DueDate: '2022-11-08T00:00:00',
    //             IsPro: false,
    //             ContractType: 'SC',
    //             Status: ''
    //         }
    //     ],
    //     InvoiceDetail: [
    //         {
    //             WKMasterID: 1,
    //             WKDetailID: 1,
    //             InvMasterID: 1,
    //             InvoiceNo: 'DT0170168-1',
    //             PartyName: 'Edge',
    //             SupplierName: 'NEC',
    //             SubmarineCable: 'SJC2',
    //             WorkTitle: 'Construction',
    //             BillMilestone: 'BM9a',
    //             FeeItem: 'BM9a Sea...',
    //             LBRatio: 28.5714285714,
    //             FeeAmountPre: 1288822.32,
    //             FeeAmountPost: 368234.95,
    //             Difference: 0
    //         },
    //         {
    //             WKMasterID: 2,
    //             WKDetailID: 2,
    //             InvMasterID: 2,
    //             InvoiceNo: 'DT0170168-2',
    //             PartyName: 'Edge',
    //             SupplierName: 'NEC',
    //             SubmarineCable: 'SJC2',
    //             WorkTitle: 'Construction',
    //             BillMilestone: 'BM9a',
    //             FeeItem: 'BM9a Sea...',
    //             LBRatio: 28.5714285714,
    //             FeeAmountPre: 1288844.44,
    //             FeeAmountPost: 368244.44,
    //             Difference: 0
    //         }
    //     ]
    // };

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const toBillDataMain = useRef();
    const [toBillDataInfo, setToBillDataInfo] = useState([]); //???????????????
    const [totalAmount, setTotalAmount] = useState([]); //???????????????
    const [currentAmount, setCurrentAmount] = useState(''); //????????????
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
        }
    }));

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    //????????????
    const toBillData = (wKMasterID) => {
        console.log('????????????wKMasterID=>>', wKMasterID);
        let tmpQuery = '/' + 'WKMasterID=' + wKMasterID;
        tmpQuery = toBillDataapi + tmpQuery;
        console.log('tmpQuery=>>', tmpQuery);
        fetch(tmpQuery, { method: 'GET' })
            .then((res) => res.json())
            .then((data) => {
                console.log('????????????=>>', data);
                let tmpAmount = 0;
                if (Array.isArray(data)) {
                    toBillDataMain.current = data ? data.InvoiceMaster : [];
                    setToBillDataInfo(data ? data.InvoiceDetail : []);
                    setTotalAmount(data ? data.TotalAmount : 0);
                    data.InvoiceDetail.forEach((i) => {
                        tmpAmount = tmpAmount + i.FeeAmountPost + i.Difference;
                    });
                    setCurrentAmount(tmpAmount.toFixed(2));
                }
            })
            .catch((e) => console.log('e1=>>', e));
        setIsDialogOpen(true);
    };

    const changeDiff = (diff, id) => {
        let tmpArray = toBillDataInfo.map((i) => i);
        let tmpAmount = 0;
        tmpArray[id].Difference = Number(diff);
        tmpArray.forEach((i) => {
            tmpAmount = tmpAmount + i.FeeAmountPost + i.Difference;
        });
        setToBillDataInfo(tmpArray);
        setCurrentAmount(tmpAmount.toFixed(2));
    };

    // ????????????(??????)
    const sendJounaryInfo = () => {
        let tmpArray = toBillDataMain.current.map((i) => i);
        tmpArray.forEach((i) => {
            delete i.InvMasterID;
        });
        let tmpData = {
            TotalAmount: totalAmount,
            InvoiceMaster: tmpArray,
            InvoiceDetail: toBillDataInfo
        };
        fetch(sendJounary, { method: 'POST', body: JSON.stringify(tmpData) })
            .then((res) => res.json())
            .then((data) => {
                dispatch(setMessageStateOpen({ messageStateOpen: { isOpen: true, severity: 'success', message: '??????????????????' } }));
                apiQuery();
                handleDialogClose();
            })
            .catch((e) => console.log('e1=>>', e));
    };

    return (
        <>
            <Dialog onClose={handleDialogClose} maxWidth="lg" fullWidth open={isDialogOpen}>
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleDialogClose}>
                    ????????????
                </BootstrapDialogTitle>
                <DialogContent>
                    <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                        <Table sx={{ minWidth: 300 }} stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center"></StyledTableCell>
                                    <StyledTableCell align="center">NO</StyledTableCell>
                                    <StyledTableCell align="center">???????????????</StyledTableCell>
                                    <StyledTableCell align="center">??????</StyledTableCell>
                                    <StyledTableCell align="center">??????</StyledTableCell>
                                    <StyledTableCell align="center">??????</StyledTableCell>
                                    <StyledTableCell align="center">E-mail</StyledTableCell>
                                    <StyledTableCell align="center">Name</StyledTableCell>
                                    <StyledTableCell align="center">Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {toBillDataInfo.map((row, id) => {
                                    let afterDiff = row.FeeAmountPost + row.Difference;
                                    return (
                                        <TableRow
                                            key={row.FeeAmountPre + row?.PartyName + row?.LBRatio}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center">{row.FeeItem}</TableCell>
                                            <TableCell align="center">{`$${handleNumber(row.FeeAmountPre)}`}</TableCell>
                                            <TableCell align="center">{row.PartyName}</TableCell>
                                            <TableCell align="center">{`${row.LBRatio}%`}</TableCell>
                                            <TableCell align="center">{`$${handleNumber(row.FeeAmountPost)}`}</TableCell>
                                            <TableCell align="center">
                                                <TextField
                                                    label="$"
                                                    size="small"
                                                    type="number"
                                                    style={{ width: '30%' }}
                                                    // value={diffNumber}
                                                    onChange={(e) => {
                                                        changeDiff(e.target.value, id);
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">{`$${handleNumber(afterDiff.toFixed(2))}`}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <DialogContentText sx={{ fontSize: '20px', mt: '0.5rem' }}>??????????????????${handleNumber(totalAmount)}</DialogContentText>
                    <DialogContentText sx={{ fontSize: '20px', color: '#CC0000' }}>
                        ???????????????${handleNumber(currentAmount)}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button sx={{ mr: '0.05rem' }} variant="contained" onClick={sendJounaryInfo}>
                        ??????
                    </Button>
                    <Button sx={{ mr: '0.05rem' }} variant="contained" onClick={handleDialogClose}>
                        ??????
                    </Button>
                </DialogActions>
            </Dialog>
            <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                <Table sx={{ minWidth: 300 }} stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">NO</StyledTableCell>
                            <StyledTableCell align="center">??????????????????</StyledTableCell>
                            <StyledTableCell align="center">??????</StyledTableCell>
                            <StyledTableCell align="center">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listInfo?.map((row, id) => {
                            return (
                                <TableRow
                                    key={row.InvoiceWKMaster?.WKMasterID + row.InvoiceWKMaster?.InvoiceNo}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <StyledTableCell align="center">{id + 1}</StyledTableCell>
                                    <StyledTableCell align="center">{row.InvoiceWKMaster.WKMasterID}</StyledTableCell>
                                    <StyledTableCell align="center">{row.InvoiceWKMaster.InvoiceNo}</StyledTableCell>
                                    <StyledTableCell align="center">{row.InvoiceWKMaster.SupplierName}</StyledTableCell>
                                    <StyledTableCell align="center">{row.InvoiceWKMaster.SubmarineCable}</StyledTableCell>
                                    <StyledTableCell align="center">{row.InvoiceWKMaster.WorkTitle}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        {dayjs(row.InvoiceWKMaster.IssueDate).format('YYYY/MM/DD')}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{row.InvoiceWKDetail.length}</StyledTableCell>
                                    <StyledTableCell align="center">{handleNumber(row.InvoiceWKMaster.TotalAmount)}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Button
                                            color="primary"
                                            onClick={() => {
                                                toBillData(row.InvoiceWKMaster.WKMasterID);
                                            }}
                                        >
                                            ????????????
                                        </Button>
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

export default InvalidatedDataList;
