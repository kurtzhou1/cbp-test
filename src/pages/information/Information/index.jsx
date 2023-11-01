import { useEffect, useState } from 'react';
import { Grid, Button, IconButton, Box, Tabs, Tab, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// import { styled } from '@mui/material/styles';

// project import
import { TabPanel } from 'components/commonFunction';
import MainCard from 'components/MainCard';
import SupplierDataList from './supplierDataList';
import PartyDataList from './partyDataList';
import CorporatesDataList from './corporatesDataList';
import ContractDataList from './contractDataList';
import SubmarineCableDataList from './submarineCableDataList';

import CableWorkDataList from './cableWorkDataList';
import ContractTypeDataList from './contractTypeDataList';
import PartiesByContractDataList from './partiesByContractDataList';
import SuppliersByContractDataList from './SuppliersByContractDataList';
import CBPBankAccount from './cBPBankAccount';

//api
import { submarineCableInfoList, supplierNameDropDownUnique } from 'components/apis.jsx';

const Information = () => {
    const [value, setValue] = useState(2);
    const [submarineCableList, setSubmarineCableList] = useState([]); //海纜名稱下拉選單
    const [supNmList, setSupNmList] = useState([]); //供應商下拉選單
    const tableH = document.getElementById('tableContainer')?.offsetTop;
    const maxHei = window.screen.height - tableH - 270;
    console.log('window.screen.height=>>', window.screen.height);
    const [submarineCable, setSubmarineCable] = useState(''); //海纜名稱
    const [workTitle, setWorkTitle] = useState(''); //海纜作業
    const [supplierName, setSupplierName] = useState(''); //供應商
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`
        };
    };

    const handleQuery = () => {
        
    }

    const initQuery = () => {
        setSubmarineCable('');
        setWorkTitle('');
        setSupplierName('');
    }

    useEffect(() => {
        fetch(supplierNameDropDownUnique, { method: 'GET' })
            .then((res) => res.json())
            .then((data) => {
                console.log('data=>>', data);
                if(Array.isArray(data)) {
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
    }, [])

    return (
        <Grid container spacing={1} id="tableContainer">
            <Grid container display="flex" justifyContent="center" alignItems="center" spacing={2}>
                {value === 0 || value === 1 ? (
                    <>
                        <Grid item sm={1} md={1} lg={1}>
                            <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem' ,xl: '0.88rem' }, ml: { lg: '0.5rem', xl: '1.5rem' } }}>
                                海纜名稱：
                            </Typography>
                        </Grid>
                        <Grid item xs={2} sm={2} md={2} lg={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>選擇海纜名稱</InputLabel>
                                <Select value={submarineCable} label="海纜名稱" size="small" onChange={(e) => setSubmarineCable(e.target.value)}>
                                    {submarineCableList.map((i) => (
                                        <MenuItem key={i.CableName} value={i.CableName}>
                                            {i.CableName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </>
                ) : (
                    <Grid item xs={3} sm={3} md={3} lg={3} />
                )}
                {value === 1 ? (
                    <>
                        <Grid item sm={1} md={1} lg={1}>
                            <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem' ,xl: '0.88rem' }, ml: { lg: '0.5rem', xl: '1.5rem' } }}>
                                海纜作業：
                            </Typography>
                        </Grid>
                        <Grid item xs={2} sm={2} md={2} lg={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>選擇海纜作業</InputLabel>
                                <Select value={workTitle} label="海纜作業" onChange={(e) => setWorkTitle(e.target.value)}>
                                    <MenuItem value={'Upgrade'}>Upgrade</MenuItem>
                                    <MenuItem value={'Construction'}>Construction</MenuItem>
                                    <MenuItem value={'O&M'}>O&M</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </>
                ) : (
                    <Grid item xs={3} sm={3} md={3} lg={3} />
                )}
                {value === 1 ? (
                    <>
                        <Grid item sm={1} md={1} lg={1}>
                            <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem' ,xl: '0.88rem' }, ml: { lg: '0.5rem', xl: '1.5rem' } }}>
                                供應商：
                            </Typography>
                        </Grid>
                        <Grid item xs={2} sm={2} md={2} lg={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>選擇供應商</InputLabel>
                                <Select value={supplierName} label="供應商" onChange={(e) => setSupplierName(e.target.value)}>
                                    {supNmList.map((i) => (
                                        <MenuItem key={i} value={i}>
                                            {i}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </>
                ) : (
                    <Grid item xs={3} sm={3} md={3} lg={3} />
                )}
                <Grid item xs={3} sm={3} md={3} lg={3} />

                {value === 0 || value === 1 ? (
                <Grid item xs={12} sm={12} md={12} lg={12} display="flex" justifyContent="end" alignItems="center">
                    <Button sx={{ mr: '0.5rem' }} variant="contained" onClick={handleQuery}>
                        查詢
                    </Button>
                    <Button variant="contained" onClick={initQuery}>
                        清除
                    </Button>
                </Grid>
                ) : (
                    ''
                )}
            </Grid>
            <Grid item xs={12}>
                {/* <MainCard
                    contentSX={{ py: 1, px: 0 }}
                    title={`${value === 0 ? '海纜代號' : value === 1 ? '供應商' : value === 2 ? '會員' : '聯盟金融帳戶'}資料列表`}
                > */}
                    <Box sx={{ p: 0, borderBottom: 1, borderColor: 'divider', position: 'relative' }}>
                        <Tabs value={value} onChange={handleChange}>
                            <Tab sx={{ p: 0 }} label="海纜代號" {...a11yProps(0)} />
                            <Tab sx={{ p: 0 }} label="供應商" {...a11yProps(1)} />
                            <Tab sx={{ p: 0 }} label="會員" {...a11yProps(2)} />
                            <Tab sx={{ p: 0 }} label="聯盟金融帳戶" {...a11yProps(3)} />
                            {/* <Tab label="聯盟" {...a11yProps(3)} /> */}
                            {/* <Tab label="合約" {...a11yProps(3)} /> */}
                            {/* <Tab label="海纜作業" {...a11yProps(3)} /> */}
                            {/* <Tab label="合約種類" {...a11yProps(5)} /> */}
                            {/* <Tab label="合約會員" {...a11yProps(6)} /> */}
                            {/* <Tab label="合約廠商" {...a11yProps(7)} /> */}
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <SubmarineCableDataList maxHei={maxHei} />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <SupplierDataList maxHei={maxHei} />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <PartyDataList maxHei={maxHei} />
                    </TabPanel>
                    {/* <TabPanel value={value} index={3}>
                        <CorporatesDataList />
                    </TabPanel> */}
                    {/* <TabPanel value={value} index={3}>
                        <ContractDataList />
                    </TabPanel> */}
                    {/* <TabPanel value={value} index={3}>
                        <CableWorkDataList maxHei={maxHei} />
                    </TabPanel> */}
                    {/* <TabPanel value={value} index={5}>
                        <ContractTypeDataList />
                    </TabPanel> */}
                    {/* <TabPanel value={value} index={6}>
                        <PartiesByContractDataList />
                    </TabPanel> */}
                    {/* <TabPanel value={value} index={7}>
                        <SuppliersByContractDataList />
                    </TabPanel> */}
                    <TabPanel value={value} index={3}>
                        <CBPBankAccount maxHei={maxHei} />
                    </TabPanel>
                {/* </MainCard> */}
            </Grid>
        </Grid>
    );
};

export default Information;
