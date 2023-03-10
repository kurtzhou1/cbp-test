import { useState, useRef } from 'react';

// project import
import { handleNumber, BootstrapDialogTitle } from 'components/commonFunction';
import CorrespondenceQuery from './correspondenceQuery';
import MainCard from 'components/MainCard';
import CorrespondenceMake from './correspondenceMake';
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

import dayjs from 'dayjs';

import { toBillDataapi, sendJounary } from 'components/apis.jsx';

const Correspondence = ({ listInfo, apiQuery }) => {
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
    const correspondenceQuery = () => {
        console.log('correspondenceQuery');
    };

    //???????????????
    const deductInfo = useRef({});
    const actionName = useRef('');
    const [isDialogOpen, setIsDialogOpen] = useState(false); //??????
    const [infoTerminal, setInfoTerminal] = useState(false); //??????
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

    const handUploadClose = () => {
        setUploadOpen(false);
    };

    console.log('infoTerminal=>>', infoTerminal);

    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <CorrespondenceQuery correspondenceQuery={correspondenceQuery} />
                </Grid>
                <Grid item xs={12}>
                    <MainCard title="??????????????????">
                        <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                            <Table sx={{ minWidth: 300 }} stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="center">?????????</StyledTableCell>
                                        <StyledTableCell align="center">????????????</StyledTableCell>
                                        <StyledTableCell align="center">???????????????</StyledTableCell>
                                        <StyledTableCell align="center">??????</StyledTableCell>
                                        <StyledTableCell align="center">????????????</StyledTableCell>
                                        <StyledTableCell align="center">????????????</StyledTableCell>
                                        <StyledTableCell align="center">E-mail</StyledTableCell>
                                        <StyledTableCell align="center">????????????</StyledTableCell>
                                        <StyledTableCell align="center">????????????</StyledTableCell>
                                        <StyledTableCell align="center">?????????</StyledTableCell>
                                        <StyledTableCell align="center">??????</StyledTableCell>
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
                                                <StyledTableCell align="center">
                                                    {dayjs(row.IssueDate).format('YYYY/MM/DD')}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">{toBillDataInfo.length}</StyledTableCell>
                                                <StyledTableCell align="center">{toBillDataInfo.length}</StyledTableCell>
                                                <StyledTableCell align="center">{toBillDataInfo.length}</StyledTableCell>
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
                                                            color="primary"
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
                                                            ????????????
                                                        </Button>
                                                        {/* <Button
                                                            color="error"
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => {
                                                                setInfoTerminal(true);
                                                            }}
                                                        >
                                                            ??????
                                                        </Button>
                                                        <Button
                                                            color="warning"
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => {
                                                                setInfoTerminal(true);
                                                            }}
                                                        >
                                                            ??????
                                                        </Button> */}
                                                    </Box>
                                                </StyledTableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </MainCard>
                </Grid>
            </Grid>
            <CorrespondenceMake isDialogOpen={isDialogOpen} handleDialogClose={handleDialogClose} listInfo={listInfo} />
        </>
    );
};

export default Correspondence;
