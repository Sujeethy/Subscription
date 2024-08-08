import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    IconButton,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Paper,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Tooltip
} from '@mui/material';
import { Add, Edit, Delete, CleanHands } from '@mui/icons-material';
import 'tailwindcss/tailwind.css';


const Subscription = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [multiExtendMode, setMultiExtendMode] = useState(false);
    const [multiEndMode, setMultiEndMode] = useState(false);
    const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
    const [newSubscription, setNewSubscription] = useState({
        CustID: '',
        ProdName: '',
        StartDate: '',
        EndDate: '',
        NoUsers: 0
    });
    const [extendDate, setExtendDate] = useState("");
    const [extendPeriod, setExtendPeriod] = useState("");
    const [editMode, setEditMode] = useState(null);
    const [endMode, setEndMode] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const validateForm = () => {
        let errors = {};

        if (!newSubscription.CustID) {
            errors.CustID = "Customer is required.";
        }

        if (!newSubscription.ProdName) {
            errors.ProdName = "Product is required.";
        }

        if (!newSubscription.StartDate) {
            errors.StartDate = "Start date is required.";
        }

        if (!newSubscription.EndDate) {
            errors.EndDate = "End date is required.";
        }
        if (newSubscription.StartDate>=newSubscription.EndDate) {
            errors.EndDate = "End date must be after start date.";
        }

        if (new Date(newSubscription.StartDate) >= new Date(newSubscription.EndDate)) {
            errors.Date = "Start date must be before end date.";
        }

        if (newSubscription.NoUsers <= 0) {
            errors.NoUsers = "There must be at least one user.";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    useEffect(() => {
        fetchSubscriptions();
        fetchCustomers();
        fetchProducts();
    }, []);

    const fetchSubscriptions = async () => {
        const response = await axios.get('http://localhost:5000/subscriptions');
        setSubscriptions(response.data);
        console.log(response.data);
    };

    const fetchCustomers = async () => {
        const response = await axios.get('http://localhost:5000/customers');
        setCustomers(response.data);
    };

    const fetchProducts = async () => {
        const response = await axios.get('http://localhost:5000/products');
        setProducts(response.data);
    };

    const handleAddSubscription = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        await axios.post('http://localhost:5000/subscriptions', newSubscription)
        
        
        fetchSubscriptions();
        setModalIsOpen(false);
    };

    const handleExtendSubscription = async () => {
        if (extendDate && extendPeriod){
            alert('Please set either date or period')
            return;
        }
        if (!extendDate && !extendPeriod){
            alert('Please set before submitting')
            return;
        }
        await axios.put('http://localhost:5000/multiextend', { selectedSubscriptions, extendedbydate: extendDate, extendedbydays: extendPeriod});
        setExtendDate("");
        setExtendPeriod("");
        setSelectedSubscriptions([]);
        fetchSubscriptions();
        setMultiExtendMode(false);
    };

    const handleEndSubscription = async () => {
        if (selectedSubscriptions.length==0){
            alert('Please select at least one subscription')
            return;
        }
        await axios.put('http://localhost:5000/multiend', { selectedSubscriptions });
        setSelectedSubscriptions([]);
        fetchSubscriptions();
        setMultiEndMode(false);
    };

    const handleSelectSubscription = (id) => {
        if (selectedSubscriptions.includes(id)) {
            setSelectedSubscriptions(selectedSubscriptions.filter(subId => subId !== id));
        } else {
            setSelectedSubscriptions([...selectedSubscriptions, id]);
        }
    };

    const handleEditSubscription = (id) => {
        setEditMode(id);
    };

    const handleSaveSubscription = async (subscription) => {
        
        await axios.put(`http://localhost:5000/subscriptions/extend/${subscription.SubID}`, { EndDate: subscription.EndDate }).catch(err => {alert(err);});
        fetchSubscriptions();
        setEditMode(null);
    };

    const handleEndSingleSubscription = async (id) => {
        await axios.put(`http://localhost:5000/subscriptions/end/${id}`);
        fetchSubscriptions();
        setEndMode(null);
    };

    const filteredSubscriptions = subscriptions.filter(subscription =>
        (subscription.CustID && subscription.CustID.toLowerCase().includes(search.toLowerCase())) ||
        (subscription.ProdName && subscription.ProdName.toLowerCase().includes(search.toLowerCase())) || (subscription.Name && subscription.Name.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        
        <div className="flex flex-col items-center p-4">
            

            <Typography variant="h4" className="mb-4 text-center">Subscriptions</Typography>

            <div className="flex flex-col md:flex-row items-center justify-between mb-4 w-full max-w-4xl">
                {!multiExtendMode && !multiEndMode && (
                    <>
                        <TextField
                            label="Search"
                            variant="outlined"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="mb-4 md:mb-0 md:mr-4 w-full md:w-1/2 "
                        />
                        <div className="m-2 space-x-2 flex flex-col md:flex-row w-full md:w-auto">
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Add />}
                                onClick={() => setModalIsOpen(true)}
                                className="mb-2 md:mb-0"
                            >
                                Add Subscription
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => setMultiExtendMode(true)}
                                className="mb-2 md:mb-0"
                            >
                                Multi Extend Subscription
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => setMultiEndMode(true)}
                            >
                                Multi End Subscription
                            </Button>
                        </div>
                    </>
                )}

                {multiExtendMode && (
                    <div className="flex flex-col md:flex-row items-center space-x-2 w-full">
                        <TextField
                            type="date"
                            value={extendDate}
                            onChange={(e) => setExtendDate(e.target.value)}
                            className="mb-4 md:mb-0 md:mr-4 w-full md:w-1/3"
                        />
                        <Typography variant='p' > or </Typography>
                        <FormControl variant="outlined" className="mb-4 md:mb-0 md:mr-4 w-full md:w-1/3">
                            <InputLabel>Period</InputLabel>
                            <Select
                                value={extendPeriod}
                                onChange={(e) => setExtendPeriod(e.target.value)}
                                label="Period"
                            >
                                <MenuItem value={30}>30 days</MenuItem>
                                <MenuItem value={90}>3 months</MenuItem>
                                <MenuItem value={180}>6 months</MenuItem>
                                <MenuItem value={365}>1 year</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="contained" color="primary" onClick={handleExtendSubscription} className="mb-2 md:mb-0">
                            Done
                        </Button>
                        <Button variant="contained" onClick={() => setMultiExtendMode(false)}>
                            Cancel
                        </Button>
                    </div>
                )}

                {multiEndMode && (
                    <div className="flex items-center space-x-2 w-full">
                        <Button variant="contained" color="primary" onClick={handleEndSubscription} className="mb-2 md:mb-0">
                            Done
                        </Button>
                        <Button variant="contained" onClick={() => setMultiEndMode(false)}>
                            Cancel
                        </Button>
                    </div>
                )}
            </div>

            <TableContainer component={Paper} className="w-full max-w-4xl">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Customer ID</TableCell>
                            <TableCell>Customer Name</TableCell>
                            <TableCell>Product</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>No. of Users</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSubscriptions.map((subscription) => (
                            <TableRow key={subscription.SubID}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedSubscriptions.includes(subscription.SubID)}
                                        onChange={() => handleSelectSubscription(subscription.SubID)}
                                    />
                                </TableCell>
                                <TableCell>{subscription.CustID}</TableCell>
                                <TableCell>{subscription.Name}</TableCell>
                                <TableCell>{subscription.ProdName}</TableCell>
                                <TableCell>{subscription.StartDate}</TableCell>
                                <TableCell>
                                    {editMode === subscription.SubID ? (
                                        <TextField
                                            type="date"
                                            value={subscription.EndDate}
                                            onChange={(e) => setSubscriptions(subscriptions.map(sub => sub.SubID === subscription.SubID ? { ...sub, EndDate: e.target.value } : sub))}
                                            
                                        />
                                    ) : (
                                        subscription.EndDate
                                    )}
                                </TableCell>
                                <TableCell>{subscription.NoUsers}</TableCell>
                                <TableCell>
                                    {editMode === subscription.SubID ? (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleSaveSubscription(subscription)}
                                            >
                                                Done
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={() => setEditMode(null)}
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    ) : endMode === subscription.SubID ? (
                                        <>
                                            <Typography>Are you sure?</Typography>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleEndSingleSubscription(subscription.SubID)}
                                            >
                                                Yes
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={() => setEndMode(null)}
                                            >
                                                No
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Tooltip title="Extend Subscription">
                                                <IconButton onClick={() => handleEditSubscription(subscription.SubID)}>
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="End Subscription">
                                                <IconButton onClick={() => setEndMode(subscription.SubID)}>
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
                <DialogTitle>Add Subscription</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Fill out the form to add a new subscription.
                    </DialogContentText>
                    <form onSubmit={handleAddSubscription} className="space-y-4">
                        <FormControl fullWidth variant="outlined" error={Boolean(formErrors.CustID)}>
                            <InputLabel>Customer</InputLabel>
                            <Select
                                value={newSubscription.CustID}
                                onChange={(e) => setNewSubscription({ ...newSubscription, CustID: e.target.value })}
                                label="Customer"
                            >
                                {customers.map((customer) => (
                                    <MenuItem key={customer.CustID} value={customer.CustID}>
                                        {customer.Name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formErrors.CustID && <Typography color="error">{formErrors.CustID}</Typography>}
                        </FormControl>

                        <FormControl fullWidth variant="outlined" error={Boolean(formErrors.ProdName)}>
                            <InputLabel>Product</InputLabel>
                            <Select
                                value={newSubscription.ProdName}
                                onChange={(e) => setNewSubscription({ ...newSubscription, ProdName: e.target.value })}
                                label="Product"
                            >
                                {products.map((product) => (
                                    <MenuItem key={product.ProdName} value={product.ProdName}>
                                        {product.ProdName}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formErrors.ProdName && <Typography color="error">{formErrors.ProdName}</Typography>}
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Start Date"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={newSubscription.StartDate}
                            onChange={(e) => setNewSubscription({ ...newSubscription, StartDate: e.target.value })}
                            error={Boolean(formErrors.StartDate)}
                            helperText={formErrors.StartDate}
                        />

                        <TextField
                            fullWidth
                            label="End Date"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={newSubscription.EndDate}
                            onChange={(e) => setNewSubscription({ ...newSubscription, EndDate: e.target.value })}
                            error={Boolean(formErrors.EndDate)}
                            helperText={formErrors.EndDate}
                        />

                        <TextField
                            fullWidth
                            label="No. Users"
                            type="number"
                            value={newSubscription.NoUsers}
                            onChange={(e) => setNewSubscription({ ...newSubscription, NoUsers: parseInt(e.target.value, 10) })}
                            error={Boolean(formErrors.NoUsers)}
                            helperText={formErrors.NoUsers}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalIsOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddSubscription} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Subscription;
