import React, { useState, useEffect } from 'react';
import { Typography ,FormControl,InputLabel,Select,MenuItem } from '@mui/material';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const RevenueReport = () => {
    const [filter, setFilter] = useState('all');
    const [total, setTatal] = useState(0);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReport();
    }, [filter]);

    const fetchReport = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:5000/report/revenue?filter=${filter}`);
            
            prepareChartData(response.data);
        } catch (error) {
            setError('Error fetching report data');
            console.error('Error fetching report data:', error);
        } finally {
            setLoading(false);
        }
    };

    const prepareChartData = (data) => {
        if (!data || data.length === 0) {
            setChartData({
                labels: [],
                datasets: [],
            });
            return;
        }

        const labels = data.map(item => item.ProdName);
        const revenues = data.map(item => item.Revenue);
        setTatal(revenues.reduce((sum, value) => sum + value, 0));
        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Revenue',
                    data: revenues,
                    backgroundColor: 'rgba(75,192,192,0.6)',
                },
            ],
        });
    };

    return (
        <div className="flex flex-col items-center justify-center mb-4 w-full gap-4 p-4" >
            <Typography variant="h4" className="mb-4 text-center">Revenue Report</Typography>
            
            <FormControl variant="outlined" className="mb-4 md:mb-0 md:mr-4 w-full md:w-[13%] h-1/2 ">
                            <InputLabel>Filter:</InputLabel>
                            <Select
                                value={filter} 
                                onChange={(e) => setFilter(e.target.value)}
                                label="Filter"
                            >
                                <MenuItem value={"all"}>All Dates</MenuItem>
                                <MenuItem value={"3_months"}>Last 3 Months</MenuItem>
                                <MenuItem value={"1_month"}>Last 1 Month</MenuItem>
                                
                            </Select>

                            <Typography variant="h6" className="mb-4 text-center">Total: {total}</Typography>
                        </FormControl>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && chartData.labels.length > 0 && <Bar className="max-w-4xl h-1/2"data={chartData} />}
            {!loading && !error && chartData.labels.length === 0 && <p>No data available for the selected filter.</p>}
        </div>
    );
};

export default RevenueReport;
