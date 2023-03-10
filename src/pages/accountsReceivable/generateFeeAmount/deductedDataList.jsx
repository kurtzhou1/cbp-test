import { useState, useRef } from 'react';

// project import
import { handleNumber, BootstrapDialogTitle } from 'components/commonFunction';
import DeductWork from './deductWork';
import GenerateFeeTerminate from './generateFeeTerminate';
import GenerateBack from './generateBack';
import SignAndUpload from './signAndUpload';
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
    Box,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import dayjs from 'dayjs';

import { toBillDataapi, sendJounary } from 'components/apis.jsx';

const GeneratedDataList = ({ listInfo, apiQuery }) => {
    const fakeData = {
        TotalAmount: 5582012.72,
        InvoiceMaster: [
            {
                InvMasterID: 1,
                WKMasterID: 1,
                InvoiceNo: 'DT0170168-1',
                PartyName: 'Edge',
                SupplierName: 'NEC',
                SubmarineCable: 'SJC2',
                WorkTitle: 'Construction',
                IssueDate: '2022-09-09T00:00:00',
                DueDate: '2022-11-08T00:00:00',
                IsPro: false,
                ContractType: 'SC',
                Status: ''
            }
        ],
        InvoiceDetail: [
            {
                WKMasterID: 1,
                WKDetailID: 1,
                InvMasterID: 1,
                InvoiceNo: 'DT0170168-1',
                PartyName: 'Edge',
                SupplierName: 'NEC',
                SubmarineCable: 'SJC2',
                WorkTitle: 'Construction',
                BillMilestone: 'BM9a',
                FeeItem: 'BM9a Sea...',
                LBRatio: 28.5714285714,
                FeeAmountPre: 1288822.32,
                FeeAmountPost: 369234.95,
                Difference: 0
            },
            {
                WKMasterID: 2,
                WKDetailID: 2,
                InvMasterID: 2,
                InvoiceNo: 'DT0170168-2',
                PartyName: 'Edge',
                SupplierName: 'NEC',
                SubmarineCable: 'SJC2',
                WorkTitle: 'Construction',
                BillMilestone: 'BM9a',
                FeeItem: 'BM12a Under the Sea',
                LBRatio: 28.5714285714,
                FeeAmountPre: 1288844.44,
                FeeAmountPost: 368244.44,
                Difference: 0
            }
        ]
    };
    const deductInfo = useRef({});
    const actionName = useRef('');
    const [isDialogOpen, setIsDialogOpen] = useState(false); //??????
    const [infoTerminal, setInfoTerminal] = useState(false); //??????
    const [infoBack, setInfoBack] = useState(false); //??????
    const [uploadOpen, setUploadOpen] = useState(false); //??????
    const [toBillDataMain, setToBillDataMain] = useState(fakeData.InvoiceMaster); //????????????
    const [toBillDataInfo, setToBillDataInfo] = useState(fakeData.InvoiceDetail); //???????????????
    const [totalAmount, setTotalAmount] = useState(fakeData.TotalAmount); //???????????????
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

    const handleDialogOpen = (action, info) => {
        deductInfo.current = info;
        actionName.current = action;
        setIsDialogOpen(true);
    };

    const handleTerminalClose = () => {
        setInfoTerminal(false);
    };

    const handleBackClose = () => {
        setInfoBack(false);
    };

    const handUploadClose = () => {
        setUploadOpen(false);
    };

    //????????????
    // const toBillData = (wKMasterID) => {
    //     console.log('????????????wKMasterID=>>', wKMasterID);
    //     let tmpQuery = '/' + 'WKMasterID=' + wKMasterID;
    //     tmpQuery = toBillDataapi + tmpQuery;
    //     console.log('tmpQuery=>>', tmpQuery);
    //     fetch(tmpQuery, { method: 'GET' })
    //         .then((res) => res.json())
    //         .then((data) => {
    //             console.log('????????????=>>', data);
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
    //         .catch((e) => console.log('e1=>>', e));
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

    // // ????????????(??????)
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
    //             console.log('????????????=>>', data);
    //             apiQuery();
    //             handleDialogClose();
    //         })
    //         .catch((e) => console.log('e1=>>', e));
    // };

    console.log('infoTerminal=>>', infoTerminal);

    return (
        <>
            <DeductWork
                isDialogOpen={isDialogOpen}
                handleDialogClose={handleDialogClose}
                deductInfo={deductInfo.current}
                actionName={actionName.current}
            />
            <GenerateFeeTerminate infoTerminal={infoTerminal} handleTerminalClose={handleTerminalClose} />
            <GenerateBack infoBack={infoBack} handleBackClose={handleBackClose} />
            <SignAndUpload uploadOpen={uploadOpen} handUploadClose={handUploadClose} />
            <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                <Table sx={{ minWidth: 300 }} stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">NO</StyledTableCell>
                            <StyledTableCell align="center">??????</StyledTableCell>
                            <StyledTableCell align="center">????????????</StyledTableCell>
                            <StyledTableCell align="center">????????????</StyledTableCell>
                            <StyledTableCell align="center">????????????</StyledTableCell>
                            <StyledTableCell align="center">?????????</StyledTableCell>
                            {/* <StyledTableCell align="center">????????????</StyledTableCell> */}
                            <StyledTableCell align="center">????????????</StyledTableCell>
                            <StyledTableCell align="center">????????????</StyledTableCell>
                            <StyledTableCell align="center">??????</StyledTableCell>
                            <StyledTableCell align="center">????????????</StyledTableCell>
                            <StyledTableCell align="center">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {toBillDataInfo?.map((row, id) => {
                            console.log('row=>>', row);
                            return (
                                <TableRow
                                    key={row.InvoiceWKMaster?.WKMasterID + row.InvoiceWKMaster?.InvoiceNo}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <StyledTableCell align="center">{id + 1}</StyledTableCell>
                                    <StyledTableCell align="center">{row.PartyName}</StyledTableCell>
                                    <StyledTableCell align="center">{row.SubmarineCable}</StyledTableCell>
                                    <StyledTableCell align="center">{row.WorkTitle}</StyledTableCell>
                                    <StyledTableCell align="center">{row.InvoiceNo}</StyledTableCell>
                                    <StyledTableCell align="center">{row.SupplierName}</StyledTableCell>
                                    <StyledTableCell align="center">{dayjs(row.IssueDate).format('YYYY/MM/DD')}</StyledTableCell>
                                    <StyledTableCell align="center">{toBillDataInfo.length}</StyledTableCell>
                                    <StyledTableCell align="center">{row.TotalAmount}</StyledTableCell>
                                    <StyledTableCell align="center">{row.Status}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                '& button': { mx: { sm: 0.3, md: 0.3, lg: 0.6, xl: 1.5 }, p: 0, fontSize: 1 }
                                            }}
                                        >
                                            <Button
                                                color="success"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    handleDialogOpen('viewDeducted', {
                                                        PartyName: row.PartyName,
                                                        IssueDate: dayjs(row.IssueDate).format('YYYY/MM/DD'),
                                                        SubmarineCable: row.SubmarineCable,
                                                        WorkTitle: row.WorkTitle
                                                    });
                                                }}
                                            >
                                                ??????
                                            </Button>
                                            <Button
                                                color="primary"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    setUploadOpen(true);
                                                }}
                                            >
                                                ??????Draft
                                            </Button>
                                            <Button
                                                color="warning"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    setInfoBack(true);
                                                }}
                                            >
                                                ??????
                                            </Button>
                                            <Button
                                                color="error"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    setInfoTerminal(true);
                                                }}
                                            >
                                                ??????
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

export default GeneratedDataList;
