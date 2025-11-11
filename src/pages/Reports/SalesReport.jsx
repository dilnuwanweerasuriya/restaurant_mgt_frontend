import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaDownload, FaChartBar, FaCalendarAlt, FaMoneyBillWave, FaUtensils, FaShoppingBag, FaUsers, FaArrowUp, FaArrowDown, FaFilter } from "react-icons/fa";
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function SalesReports() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        orderType: 'all',
        paymentStatus: 'all',
        period: 'daily' // daily, weekly, monthly, yearly
    });

    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        totalTax: 0,
        totalServiceCharge: 0,
        dineInRevenue: 0,
        takeawayRevenue: 0,
        paidOrders: 0,
        unpaidOrders: 0,
        topSellingItems: [],
        dailySales: [],
        hourlySales: [],
        monthlyRevenue: 0,
        previousMonthRevenue: 0,
        growthRate: 0
    });

    const [showFilters, setShowFilters] = useState(false);
    const token = localStorage.getItem("token");

    // Fetch orders data
    useEffect(() => {
        fetchOrders();
    }, []);

    // Apply filters when orders or filters change
    useEffect(() => {
        applyFilters();
    }, [orders, filters]);

    // Calculate stats when filtered orders change
    useEffect(() => {
        calculateStats();
    }, [filteredOrders]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/orders`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to fetch sales data");
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...orders];

        // Date filter
        if (filters.startDate) {
            filtered = filtered.filter(order =>
                new Date(order.createdAt) >= new Date(filters.startDate)
            );
        }
        if (filters.endDate) {
            filtered = filtered.filter(order =>
                new Date(order.createdAt) <= new Date(filters.endDate + 'T23:59:59')
            );
        }

        // Order type filter
        if (filters.orderType !== 'all') {
            filtered = filtered.filter(order => order.orderType === filters.orderType);
        }

        // Payment status filter
        if (filters.paymentStatus !== 'all') {
            filtered = filtered.filter(order => order.paymentStatus === filters.paymentStatus);
        }

        // Only include completed orders for revenue calculation
        filtered = filtered.filter(order =>
            order.status !== 'cancelled'
        );

        setFilteredOrders(filtered);
    };

    const calculateStats = () => {
        if (filteredOrders.length === 0) {
            setStats({
                totalRevenue: 0,
                totalOrders: 0,
                averageOrderValue: 0,
                totalTax: 0,
                totalServiceCharge: 0,
                dineInRevenue: 0,
                takeawayRevenue: 0,
                paidOrders: 0,
                unpaidOrders: 0,
                topSellingItems: [],
                dailySales: [],
                hourlySales: [],
                monthlyRevenue: 0,
                previousMonthRevenue: 0,
                growthRate: 0
            });
            return;
        }

        // Basic stats
        const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        const totalOrders = filteredOrders.length;
        const averageOrderValue = totalRevenue / totalOrders;
        const totalTax = filteredOrders.reduce((sum, order) => sum + (order.tax || 0), 0);
        const totalServiceCharge = filteredOrders.reduce((sum, order) => sum + (order.serviceCharge || 0), 0);

        // Order type revenue
        const dineInRevenue = filteredOrders
            .filter(order => order.orderType === 'dine-in')
            .reduce((sum, order) => sum + (order.total || 0), 0);
        const takeawayRevenue = filteredOrders
            .filter(order => order.orderType === 'takeaway')
            .reduce((sum, order) => sum + (order.total || 0), 0);

        // Payment status
        const paidOrders = filteredOrders.filter(order => order.paymentStatus === 'paid').length;
        const unpaidOrders = filteredOrders.filter(order => order.paymentStatus === 'unpaid').length;

        // Top selling items
        const itemsMap = {};
        filteredOrders.forEach(order => {
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    const itemName = item.name || 'Unknown Item';
                    if (!itemsMap[itemName]) {
                        itemsMap[itemName] = {
                            name: itemName,
                            quantity: 0,
                            revenue: 0
                        };
                    }
                    itemsMap[itemName].quantity += item.qty || 0;
                    itemsMap[itemName].revenue += (item.price || 0) * (item.qty || 0);
                });
            }
        });
        const topSellingItems = Object.values(itemsMap)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Daily sales for chart
        const dailySalesMap = {};
        filteredOrders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString();
            if (!dailySalesMap[date]) {
                dailySalesMap[date] = 0;
            }
            dailySalesMap[date] += order.total || 0;
        });
        const dailySales = Object.entries(dailySalesMap)
            .map(([date, revenue]) => ({ date, revenue }))
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(-30); // Last 30 days

        // Hourly distribution
        const hourlySalesMap = {};
        for (let i = 0; i < 24; i++) {
            hourlySalesMap[i] = 0;
        }
        filteredOrders.forEach(order => {
            const hour = new Date(order.createdAt).getHours();
            hourlySalesMap[hour] += order.total || 0;
        });
        const hourlySales = Object.entries(hourlySalesMap)
            .map(([hour, revenue]) => ({ hour: `${hour}:00`, revenue }));

        // Calculate growth rate
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const currentMonthOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate.getMonth() === currentMonth &&
                orderDate.getFullYear() === currentYear &&
                order.status !== 'cancelled';
        });
        const previousMonthOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            return orderDate.getMonth() === prevMonth &&
                orderDate.getFullYear() === prevYear &&
                order.status !== 'cancelled';
        });
        const monthlyRevenue = currentMonthOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        const previousMonthRevenue = previousMonthOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        const growthRate = previousMonthRevenue > 0
            ? ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
            : 0;

        setStats({
            totalRevenue,
            totalOrders,
            averageOrderValue,
            totalTax,
            totalServiceCharge,
            dineInRevenue,
            takeawayRevenue,
            paidOrders,
            unpaidOrders,
            topSellingItems,
            dailySales,
            hourlySales,
            monthlyRevenue,
            previousMonthRevenue,
            growthRate
        });
    };

    // Chart configurations
    const lineChartData = {
        labels: stats.dailySales.map(item => item.date),
        datasets: [
            {
                label: 'Daily Revenue',
                data: stats.dailySales.map(item => item.revenue),
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgb(59, 130, 246)',
                tension: 0.4
            }
        ]
    };

    const barChartData = {
        labels: stats.hourlySales.map(item => item.hour),
        datasets: [
            {
                label: 'Revenue by Hour',
                data: stats.hourlySales.map(item => item.revenue),
                backgroundColor: 'rgba(34, 197, 94, 0.5)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1
            }
        ]
    };

    const doughnutChartData = {
        labels: ['Dine-In', 'Takeaway'],
        datasets: [
            {
                data: [stats.dineInRevenue, stats.takeawayRevenue],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(59, 130, 246, 0.8)'
                ],
                borderWidth: 0
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#e4e4e7'
                }
            },
            title: {
                display: false
            }
        },
        scales: {
            x: {
                ticks: { color: '#a1a1aa' },
                grid: { color: 'rgba(161, 161, 170, 0.1)' }
            },
            y: {
                ticks: { color: '#a1a1aa' },
                grid: { color: 'rgba(161, 161, 170, 0.1)' }
            }
        }
    };

    // Export functions
    const exportToExcel = () => {
        const exportData = filteredOrders.map(order => ({
            'Order ID': order._id,
            'Date': new Date(order.createdAt).toLocaleDateString(),
            'Time': new Date(order.createdAt).toLocaleTimeString(),
            'Order Type': order.orderType,
            'Customer': order.customerName || 'Walk-in',
            'Items': order.items?.map(item => `${item.name} x${item.qty}`).join(', '),
            'Subtotal': order.subtotal,
            'Tax': order.tax,
            'Service Charge': order.serviceCharge,
            'Total': order.total,
            'Payment Status': order.paymentStatus,
            'Order Status': order.status
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');

        // Add summary sheet
        const summaryData = [
            ['Sales Report Summary'],
            [''],
            ['Period', `${filters.startDate} to ${filters.endDate}`],
            ['Total Revenue', `LKR ${stats.totalRevenue.toFixed(2)}`],
            ['Total Orders', stats.totalOrders],
            ['Average Order Value', `LKR ${stats.averageOrderValue.toFixed(2)}`],
            ['Total Tax Collected', `LKR ${stats.totalTax.toFixed(2)}`],
            ['Total Service Charge', `LKR ${stats.totalServiceCharge.toFixed(2)}`],
            [''],
            ['Order Type Breakdown'],
            ['Dine-In Revenue', `LKR ${stats.dineInRevenue.toFixed(2)}`],
            ['Takeaway Revenue', `LKR ${stats.takeawayRevenue.toFixed(2)}`],
            [''],
            ['Payment Status'],
            ['Paid Orders', stats.paidOrders],
            ['Unpaid Orders', stats.unpaidOrders]
        ];
        const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

        XLSX.writeFile(wb, `sales_report_${new Date().toISOString().split('T')[0]}.xlsx`);
        toast.success('Report exported to Excel');
    };

    const exportToPDF = () => {
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(20);
        doc.text('Sales Report', 14, 22);

        // Add date range
        doc.setFontSize(10);
        doc.text(`Period: ${filters.startDate} to ${filters.endDate}`, 14, 30);

        // Add summary
        doc.setFontSize(12);
        doc.text('Summary', 14, 40);
        doc.setFontSize(10);
        doc.text(`Total Revenue: LKR ${stats.totalRevenue.toFixed(2)}`, 14, 48);
        doc.text(`Total Orders: ${stats.totalOrders}`, 14, 55);
        doc.text(`Average Order Value: LKR ${stats.averageOrderValue.toFixed(2)}`, 14, 62);
        doc.text(`Dine-In Revenue: LKR ${stats.dineInRevenue.toFixed(2)}`, 14, 69);
        doc.text(`Takeaway Revenue: LKR ${stats.takeawayRevenue.toFixed(2)}`, 14, 76);

        // Add orders table
        const tableData = filteredOrders.map(order => [
            order._id.slice(-6),
            new Date(order.createdAt).toLocaleDateString(),
            order.orderType,
            order.customerName || 'Walk-in',
            `LKR ${order.total.toFixed(2)}`,
            order.paymentStatus
        ]);

        doc.autoTable({
            startY: 85,
            head: [['Order ID', 'Date', 'Type', 'Customer', 'Total', 'Payment']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [39, 39, 42] },
            styles: { fontSize: 8 }
        });

        doc.save(`sales_report_${new Date().toISOString().split('T')[0]}.pdf`);
        toast.success('Report exported to PDF');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-zinc-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
                            <FaChartBar className="text-blue-500" />
                            Sales Reports
                        </h1>
                        <p className="text-zinc-400 mt-2">
                            Track your restaurant's performance and revenue
                        </p>
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-4 py-2 bg-zinc-800 text-zinc-100 rounded-lg hover:bg-zinc-700 transition flex items-center gap-2"
                        >
                            <FaFilter />
                            Filters
                        </button>
                        <button
                            onClick={exportToExcel}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                        >
                            <FaDownload />
                            Excel
                        </button>
                        <button
                            onClick={exportToPDF}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                        >
                            <FaDownload />
                            PDF
                        </button>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-zinc-900 rounded-xl p-6 mb-6 border border-zinc-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={filters.startDate}
                                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-800 text-zinc-100 rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={filters.endDate}
                                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-800 text-zinc-100 rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Order Type
                                </label>
                                <select
                                    value={filters.orderType}
                                    onChange={(e) => setFilters({ ...filters, orderType: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-800 text-zinc-100 rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none cursor-pointer"
                                >
                                    <option value="all">All Types</option>
                                    <option value="dine-in">Dine-In</option>
                                    <option value="takeaway">Takeaway</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Payment Status
                                </label>
                                <select
                                    value={filters.paymentStatus}
                                    onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-800 text-zinc-100 rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none cursor-pointer"
                                >
                                    <option value="all">All</option>
                                    <option value="paid">Paid</option>
                                    <option value="unpaid">Unpaid</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Period
                                </label>
                                <select
                                    value={filters.period}
                                    onChange={(e) => setFilters({ ...filters, period: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-800 text-zinc-100 rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none cursor-pointer"
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Revenue */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-zinc-400 text-sm">Total Revenue</p>
                                <p className="text-2xl font-bold text-zinc-100 mt-2">
                                    LKR {stats.totalRevenue.toFixed(2)}
                                </p>
                                <div className="flex items-center mt-2">
                                    {stats.growthRate >= 0 ? (
                                        <FaArrowUp className="text-green-500 text-sm mr-1" />
                                    ) : (
                                        <FaArrowDown className="text-red-500 text-sm mr-1" />
                                    )}
                                    <span className={`text-sm ${stats.growthRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {Math.abs(stats.growthRate).toFixed(1)}%
                                    </span>
                                    <span className="text-zinc-500 text-sm ml-1">vs last month</span>
                                </div>
                            </div>
                            <div className="bg-blue-500/10 p-3 rounded-lg">
                                <FaMoneyBillWave className="text-2xl text-blue-500" />
                            </div>
                        </div>
                    </div>

                    {/* Total Orders */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-zinc-400 text-sm">Total Orders</p>
                                <p className="text-2xl font-bold text-zinc-100 mt-2">
                                    {stats.totalOrders}
                                </p>
                                <p className="text-zinc-500 text-sm mt-2">
                                    Avg: LKR {stats.averageOrderValue.toFixed(2)}
                                </p>
                            </div>
                            <div className="bg-green-500/10 p-3 rounded-lg">
                                <FaShoppingBag className="text-2xl text-green-500" />
                            </div>
                        </div>
                    </div>

                    {/* Dine-In Revenue */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-zinc-400 text-sm">Dine-In</p>
                                <p className="text-2xl font-bold text-zinc-100 mt-2">
                                    LKR {stats.dineInRevenue.toFixed(2)}
                                </p>
                                <p className="text-zinc-500 text-sm mt-2">
                                    {stats.totalRevenue > 0
                                        ? `${((stats.dineInRevenue / stats.totalRevenue) * 100).toFixed(1)}% of total`
                                        : '0% of total'}
                                </p>
                            </div>
                            <div className="bg-red-500/10 p-3 rounded-lg">
                                <FaUtensils className="text-2xl text-red-500" />
                            </div>
                        </div>
                    </div>

                    {/* Takeaway Revenue */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-zinc-400 text-sm">Takeaway</p>
                                <p className="text-2xl font-bold text-zinc-100 mt-2">
                                    LKR {stats.takeawayRevenue.toFixed(2)}
                                </p>
                                <p className="text-zinc-500 text-sm mt-2">
                                    {stats.totalRevenue > 0
                                        ? `${((stats.takeawayRevenue / stats.totalRevenue) * 100).toFixed(1)}% of total`
                                        : '0% of total'}
                                </p>
                            </div>
                            <div className="bg-purple-500/10 p-3 rounded-lg">
                                <FaShoppingBag className="text-2xl text-purple-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Sales Trend Chart */}
                    <div className="lg:col-span-2 bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
                            Revenue Trend
                        </h3>
                        <div className="h-64">
                            <Line data={lineChartData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Order Type Distribution */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
                            Order Type Distribution
                        </h3>
                        <div className="h-64">
                            <Doughnut
                                data={doughnutChartData}
                                options={{
                                    ...chartOptions,
                                    scales: undefined
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Additional Stats Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Top Selling Items */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
                            Top Selling Items
                        </h3>
                        <div className="space-y-3">
                            {stats.topSellingItems.length > 0 ? (
                                stats.topSellingItems.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <span className="text-zinc-500 text-sm w-6">
                                                #{index + 1}
                                            </span>
                                            <div>
                                                <p className="text-zinc-100 font-medium">{item.name}</p>
                                                <p className="text-zinc-500 text-sm">
                                                    {item.quantity} orders
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-zinc-300 font-medium">
                                            LKR {item.revenue.toFixed(2)}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-zinc-500 text-center py-4">
                                    No data available
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Hourly Sales Distribution */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
                            Peak Hours
                        </h3>
                        <div className="h-64">
                            <Bar
                                data={barChartData}
                                options={{
                                    ...chartOptions,
                                    scales: {
                                        ...chartOptions.scales,
                                        x: {
                                            ...chartOptions.scales.x,
                                            ticks: {
                                                ...chartOptions.scales.x.ticks,
                                                maxRotation: 45,
                                                minRotation: 45
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Financial Breakdown */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                    <h3 className="text-lg font-semibold text-zinc-100 mb-4">
                        Financial Breakdown
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex justify-between items-center p-4 bg-zinc-800/50 rounded-lg">
                            <div>
                                <p className="text-zinc-400 text-sm">Subtotal</p>
                                <p className="text-xl font-semibold text-zinc-100">
                                    LKR {(stats.totalRevenue - stats.totalTax - stats.totalServiceCharge).toFixed(2)}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-zinc-800/50 rounded-lg">
                            <div>
                                <p className="text-zinc-400 text-sm">Tax Collected (13%)</p>
                                <p className="text-xl font-semibold text-zinc-100">
                                    LKR {stats.totalTax.toFixed(2)}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-zinc-800/50 rounded-lg">
                            <div>
                                <p className="text-zinc-400 text-sm">Service Charge (10%)</p>
                                <p className="text-xl font-semibold text-zinc-100">
                                    LKR {stats.totalServiceCharge.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Status */}
                    <div className="grid grid-cols-2 gap-6 mt-6">
                        <div className="flex justify-between items-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                            <div>
                                <p className="text-green-400 text-sm">Paid Orders</p>
                                <p className="text-xl font-semibold text-green-500">
                                    {stats.paidOrders}
                                </p>
                            </div>
                            <div className="text-green-500 text-2xl">
                                ✓
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                            <div>
                                <p className="text-red-400 text-sm">Unpaid Orders</p>
                                <p className="text-xl font-semibold text-red-500">
                                    {stats.unpaidOrders}
                                </p>
                            </div>
                            <div className="text-red-500 text-2xl">
                                ⚠
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}