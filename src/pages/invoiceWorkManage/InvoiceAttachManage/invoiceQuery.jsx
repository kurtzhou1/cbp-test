import { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormGroup,
  FormControlLabel,
  Radio,
  Box,
  Checkbox,
} from '@mui/material';
import PropTypes from 'prop-types';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { TextField } from '@mui/material/index';
// project import
import MainCard from 'components/MainCard';

// api
// api
import {
  searchBillMasterByInvoiceWKMaster,
  supplierNameDropDownUnique,
  submarineCableInfoList,
  billMilestoneLiabilityList,
} from 'components/apis.jsx';
import dayjs from 'dayjs';

const InvoiceQuery = ({ setListInfo, queryApi, setAction, setPage }) => {
  const [supplierName, setSupplierName] = useState(''); //供應商
  const [submarineCable, setSubmarineCable] = useState(''); //海纜名稱
  const [workTitle, setWorkTitle] = useState(''); //海纜作業
  const [billMilestone, setBillMilestone] = useState(''); // 計帳段號
  const [isIssueDate, setIsIssueDate] = useState(''); //是否為發票日期
  const [issueDate, setIssueDate] = useState(null); //發票日期
  const [invoiceNo, setInvoiceNo] = useState(''); //發票號碼
  const [supNmList, setSupNmList] = useState([]); //供應商下拉選單
  const [submarineCableList, setSubmarineCableList] = useState([]); //海纜名稱下拉選單
  const [bmsList, setBmsList] = useState([]); //計帳段號下拉選單
  const [invoiceStatusQuery, setInvoiceStatusQuery] = useState({
    BILLED: false,
    COMPLETE: false,
    INVALID: false,
    PAYING: false,
    TEMPORARY: false,
    VALIDATED: false,
  }); //處理狀態

  const initQuery = () => {
    setSupplierName('');
    setSubmarineCable('');
    setWorkTitle('');
    setBillMilestone('');
    setIsIssueDate('');
    setIssueDate(null);
    setInvoiceNo('');
    setInvoiceStatusQuery({
      BILLED: false,
      COMPLETE: false,
      INVALID: false,
      PAYING: false,
      TEMPORARY: false,
      VALIDATED: false,
    });
  };

  const handleChange = (event) => {
    setInvoiceStatusQuery({ ...invoiceStatusQuery, [event.target.name]: event.target.checked });
  };

  const invoiceQuery = () => {
    let tmpQuery = {};
    if (supplierName && supplierName !== '') {
      tmpQuery.SupplierName = supplierName;
    }
    if (submarineCable && submarineCable !== '') {
      tmpQuery.SubmarineCable = submarineCable;
    }
    if (workTitle && workTitle !== '') {
      tmpQuery.WorkTitle = workTitle;
    }
    if (invoiceNo && invoiceNo !== '') {
      tmpQuery.InvoiceNo = invoiceNo;
    }
    if (billMilestone && billMilestone !== '') {
      tmpQuery.BillMilestone = billMilestone;
    }
    console.log(issueDate, isIssueDate);
    if (issueDate && isIssueDate === 'true') {
      tmpQuery.startIssueDate = dayjs(issueDate).format('YYYYMMDD');
      tmpQuery.endIssueDate = dayjs(issueDate).format('YYYYMMDD');
    }
    if (issueDate && isIssueDate === 'false') {
      tmpQuery.startDueDate = dayjs(issueDate).format('YYYYMMDD');
      tmpQuery.endDueDate = dayjs(issueDate).format('YYYYMMDD');
    }
    if (
      !(
        invoiceStatusQuery?.TEMPORARY &&
        invoiceStatusQuery?.VALIDATED &&
        invoiceStatusQuery?.BILLED &&
        invoiceStatusQuery?.PAYING &&
        invoiceStatusQuery?.COMPLETE &&
        invoiceStatusQuery?.INVALID
      ) &&
      (invoiceStatusQuery?.TEMPORARY ||
        invoiceStatusQuery?.VALIDATED ||
        invoiceStatusQuery?.BILLED ||
        invoiceStatusQuery?.PAYING ||
        invoiceStatusQuery?.COMPLETE ||
        invoiceStatusQuery?.INVALID)
    ) {
      let tmpStatus = [];
      if (invoiceStatusQuery?.TEMPORARY) {
        tmpStatus.push('TEMPORARY');
      }
      if (invoiceStatusQuery?.VALIDATED) {
        tmpStatus.push('VALIDATED');
      }
      if (invoiceStatusQuery?.BILLED) {
        tmpStatus.push('BILLED');
      }
      if (invoiceStatusQuery?.PAYING) {
        tmpStatus.push('PAYING');
      }
      if (invoiceStatusQuery?.COMPLETE) {
        tmpStatus.push('COMPLETE');
      }
      if (invoiceStatusQuery?.INVALID) {
        tmpStatus.push('INVALID');
      }
      tmpQuery.Status = tmpStatus;
    }

    // fetch(searchBillMasterByInvoiceWKMaster, { method: 'POST', body: JSON.stringify(tmpQuery) })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log('查詢成功=>>', data);
    //     if (Array.isArray(data)) {
    //       setListInfo(data);
    //       setDetailInfo([]);
    //     }
    //   })
    //   .catch((e) => console.log('e1=>', e));
  };

  useEffect(() => {
    fetch(supplierNameDropDownUnique, { method: 'GET' })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSupNmList(data);
        }
      })
      .catch((e) => console.log('e1=>', e));
    //海纜名稱
    fetch(submarineCableInfoList, { method: 'GET' })
      .then((res) => res.json())
      .then((data) => {
        setSubmarineCableList(data);
      })
      .catch((e) => console.log('e1=>', e));
    fetch(billMilestoneLiabilityList, { method: 'GET' })
      .then((res) => res.json())
      .then((data) => {
        setBmsList(data);
      })
      .catch((e) => console.log('e1=>', e));
  }, []);

  return (
    <MainCard title="條件查詢" sx={{ width: '100%' }}>
      <Grid container display="flex" alignItems="center" spacing={2}>
        {/* row1 */}
        <Grid item xs={2} sm={2} md={1} lg={1}>
          <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
            供應商：
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={2} lg={2}>
          <FormControl fullWidth size="small">
            <InputLabel>選擇供應商</InputLabel>
            <Select
              value={supplierName}
              label="供應商"
              onChange={(e) => setSupplierName(e.target.value)}
            >
              {supNmList.map((i) => (
                <MenuItem key={i} value={i}>
                  {i}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={1} md={1} lg={1}>
          <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
            海纜名稱：
          </Typography>
        </Grid>
        <Grid item xs={2} sm={2} md={2} lg={2}>
          <FormControl fullWidth size="small">
            <InputLabel>選擇海纜名稱</InputLabel>
            <Select
              value={submarineCable}
              label="海纜名稱"
              onChange={(e) => setSubmarineCable(e.target.value)}
            >
              {submarineCableList.map((i) => (
                <MenuItem key={i.CableName} value={i.CableName}>
                  {i.CableName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={1} md={1} lg={1}>
          <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
            海纜作業：
          </Typography>
        </Grid>
        <Grid item xs={2} sm={2} md={2} lg={2}>
          <FormControl fullWidth size="small">
            <InputLabel>選擇海纜作業</InputLabel>
            <Select
              value={workTitle}
              label="海纜作業"
              onChange={(e) => setWorkTitle(e.target.value)}
            >
              <MenuItem value={'Upgrade'}>Upgrade</MenuItem>
              <MenuItem value={'Construction'}>Construction</MenuItem>
              <MenuItem value={'O&M'}>O&M</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={1} md={1} lg={1}>
          <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
            計帳段號：
          </Typography>
        </Grid>
        <Grid item xs={2} sm={2} md={2} lg={2}>
          <FormControl fullWidth size="small">
            <InputLabel>選擇計帳段號</InputLabel>
            <Select
              value={billMilestone}
              label="發票供應商"
              onChange={(e) => setBillMilestone(e.target.value)}
            >
              {bmsList.map((i) => (
                <MenuItem key={i} value={i}>
                  {i}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* row2 */}
        <Grid item sm={1} md={1} lg={1}>
          <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
            發票號碼：
          </Typography>
        </Grid>
        <Grid item xs={2} sm={2} md={2} lg={2}>
          <FormControl fullWidth size="small">
            <TextField
              fullWidth
              variant="outlined"
              value={invoiceNo}
              size="small"
              label="填寫發票號碼"
              onChange={(e) => setInvoiceNo(e.target.value)}
            />
          </FormControl>
        </Grid>
        <Grid item sm={1} md={1} lg={1}>
          <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
            日期條件：
          </Typography>
        </Grid>
        <Grid item xs={8} sm={8} md={8} lg={8} display="flex" alignItems="center">
          <FormControl>
            <RadioGroup row value={isIssueDate} onChange={(e) => setIsIssueDate(e.target.value)}>
              <FormControlLabel
                value={true}
                control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }} />}
                label="發票日期"
              />
              <FormControlLabel
                value={false}
                control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }} />}
                label="發票到期日"
              />
            </RadioGroup>
          </FormControl>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            localeText={{ start: '起始日', end: '結束日' }}
          >
            <DesktopDatePicker
              inputFormat="YYYY/MM/DD"
              value={issueDate}
              onChange={(e) => {
                setIssueDate(e);
              }}
              renderInput={(params) => <TextField size="small" {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item sm={1} md={1} lg={1}>
          <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
            處理狀態：
          </Typography>
        </Grid>
        <Grid item md={7}>
          <FormGroup row value={invoiceStatusQuery}>
            <FormControlLabel
              control={
                <Checkbox
                  name={'TEMPORARY'}
                  onChange={handleChange}
                  checked={invoiceStatusQuery.TEMPORARY}
                  sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }}
                />
              }
              label="暫存"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name={'VALIDATED'}
                  onChange={handleChange}
                  checked={invoiceStatusQuery.VALIDATED}
                  sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }}
                />
              }
              label="待立帳"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name={'BILLED'}
                  onChange={handleChange}
                  checked={invoiceStatusQuery.BILLED}
                  sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }}
                />
              }
              label="已立帳"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name={'PAYING'}
                  onChange={handleChange}
                  checked={invoiceStatusQuery.PAYING}
                  sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }}
                />
              }
              label="付款中"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name={'COMPLETE'}
                  onChange={handleChange}
                  checked={invoiceStatusQuery.COMPLETE}
                  sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }}
                />
              }
              label="完成付款結案"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name={'INVALID'}
                  onChange={handleChange}
                  checked={invoiceStatusQuery.INVALID}
                  sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }}
                />
              }
              label="作廢"
            />
          </FormGroup>
        </Grid>
        <Grid item md={4} display="flex" justifyContent="end" alignItems="center">
          <Button sx={{ mr: '0.5rem' }} variant="contained" onClick={invoiceQuery}>
            查詢
          </Button>
          <Button variant="contained" onClick={initQuery}>
            清除
          </Button>
        </Grid>
      </Grid>
    </MainCard>
  );
};

InvoiceQuery.propTypes = {
  setListInfo: PropTypes.func,
  queryApi: PropTypes.string,
  supNmList: PropTypes.array,
  submarineCableList: PropTypes.array,
  bmsList: PropTypes.array,
  setAction: PropTypes.func,
  setPage: PropTypes.func,
};

export default InvoiceQuery;