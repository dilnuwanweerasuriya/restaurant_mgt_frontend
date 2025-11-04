import React, { useState } from 'react';
import { 
  FiHome, 
  FiUsers, 
  FiShoppingBag, 
  FiSettings, 
  FiMenu, 
  FiX,
  FiTrendingUp,
  FiDollarSign,
  FiPackage,
  FiClock,
  FiSearch,
  FiBell
} from 'react-icons/fi';

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const stats = [
    {
      id: 1,
      title: 'Total Revenue',
      value: '$12,426',
      change: '+12.5%',
      icon: <FiDollarSign className="w-6 h-6" />,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-500'
    },
    {
      id: 2,
      title: 'Orders Today',
      value: '145',
      change: '+8.2%',
      icon: <FiShoppingBag className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-500'
    },
    {
      id: 3,
      title: 'Active Tables',
      value: '23/40',
      change: '+5.1%',
      icon: <FiPackage className="w-6 h-6" />,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-500'
    },
    {
      id: 4,
      title: 'Avg Wait Time',
      value: '12 min',
      change: '-3.2%',
      icon: <FiClock className="w-6 h-6" />,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-500'
    }
  ];

  const recentOrders = [
    { id: '#ORD-001', table: 'Table 5', items: '3 items', status: 'Preparing', time: '5 min ago', amount: '$45.00' },
    { id: '#ORD-002', table: 'Table 12', items: '5 items', status: 'Ready', time: '8 min ago', amount: '$78.50' },
    { id: '#ORD-003', table: 'Table 3', items: '2 items', status: 'Delivered', time: '12 min ago', amount: '$32.00' },
    { id: '#ORD-004', table: 'Table 8', items: '4 items', status: 'Preparing', time: '15 min ago', amount: '$56.75' },
    { id: '#ORD-005', table: 'Table 15', items: '6 items', status: 'Ready', time: '18 min ago', amount: '$92.30' }
  ];

  const popularDishes = [
    { name: 'Grilled Salmon', orders: 45, revenue: '$675', trend: 'up' },
    { name: 'Pasta Carbonara', orders: 38, revenue: '$456', trend: 'up' },
    { name: 'Caesar Salad', orders: 32, revenue: '$288', trend: 'down' },
    { name: 'Beef Burger', orders: 28, revenue: '$364', trend: 'up' }
  ];

  const chartData = [
    { day: 'Mon', value: 65 },
    { day: 'Tue', value: 45 },
    { day: 'Wed', value: 78 },
    { day: 'Thu', value: 52 },
    { day: 'Fri', value: 88 },
    { day: 'Sat', value: 63 },
    { day: 'Sun', value: 71 }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Preparing': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Ready': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Delivered': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Restaurant
          </h2>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-zinc-400 hover:text-white"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-white bg-zinc-800 rounded-lg border-l-4 border-indigo-500 transition-all">
            <FiHome className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg border-l-4 border-transparent hover:border-indigo-500 transition-all">
            <FiShoppingBag className="w-5 h-5" />
            <span className="font-medium">Orders</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg border-l-4 border-transparent hover:border-indigo-500 transition-all">
            <FiUsers className="w-5 h-5" />
            <span className="font-medium">Customers</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg border-l-4 border-transparent hover:border-indigo-500 transition-all">
            <FiPackage className="w-5 h-5" />
            <span className="font-medium">Menu</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg border-l-4 border-transparent hover:border-indigo-500 transition-all">
            <FiTrendingUp className="w-5 h-5" />
            <span className="font-medium">Analytics</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg border-l-4 border-transparent hover:border-indigo-500 transition-all">
            <FiSettings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <FiMenu className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 w-80 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                <FiBell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3 cursor-pointer hover:bg-zinc-800 rounded-lg p-2 transition-colors">
                <img 
                  src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff" 
                  alt="User" 
                  className="w-10 h-10 rounded-full ring-2 ring-indigo-500"
                />
                <span className="hidden md:block text-white font-medium">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 lg:p-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
            <p className="text-zinc-400">Welcome back! Here's what's happening today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map(stat => (
              <div 
                key={stat.id} 
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-zinc-400 text-sm mb-2">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                    <span className={`text-sm font-medium ${
                      stat.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      {stat.change} from yesterday
                    </span>
                  </div>
                  <div className={`${stat.bgColor} ${stat.textColor} p-3 rounded-xl`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts and Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                <h3 className="text-xl font-semibold text-white">Recent Orders</h3>
                <button className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg hover:bg-zinc-700 hover:border-indigo-500 transition-all">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Table</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {recentOrders.map(order => (
                      <tr key={order.id} className="hover:bg-zinc-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-400">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">{order.table}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">{order.items}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">{order.time}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-500">{order.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Popular Dishes */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                <h3 className="text-xl font-semibold text-white">Popular Dishes</h3>
                <button className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg hover:bg-zinc-700 hover:border-indigo-500 transition-all text-sm">
                  View Menu
                </button>
              </div>
              <div className="p-4 space-y-3">
                {popularDishes.map((dish, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg hover:translate-x-1 transition-transform"
                  >
                    <div>
                      <h4 className="text-white font-medium mb-1">{dish.name}</h4>
                      <p className="text-zinc-400 text-sm">{dish.orders} orders</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-500 font-semibold">{dish.revenue}</span>
                      <FiTrendingUp className={`w-5 h-5 ${
                        dish.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-zinc-800 gap-4">
              <h3 className="text-xl font-semibold text-white">Sales Overview</h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors">
                  Day
                </button>
                <button className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-lg text-sm font-medium hover:bg-zinc-700 hover:text-white transition-all">
                  Week
                </button>
                <button className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-lg text-sm font-medium hover:bg-zinc-700 hover:text-white transition-all">
                  Month
                </button>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-end justify-around h-64 gap-4">
                {chartData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 group">
                    <div className="relative w-full">
                      <div 
                        className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg cursor-pointer hover:from-indigo-500 hover:to-purple-400 transition-all duration-300 relative"
                        style={{ height: `${item.value * 2.5}px` }}
                      >
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                          ${item.value * 10}
                        </span>
                      </div>
                    </div>
                    <span className="text-zinc-400 text-sm mt-3 font-medium">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardPage;