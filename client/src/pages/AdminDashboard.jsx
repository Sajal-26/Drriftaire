import { useEffect, useMemo, useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import useAdminStore from '../store/useAdminStore';
import {
  CheckCircle2,
  Clock,
  Download,
  Droplets,
  ExternalLink,
  LayoutDashboard,
  Loader2,
  LogOut,
  TrendingUp,
  DollarSign,
  Users,
  Wind,
  XOctagon,
} from 'lucide-react';

const ADMIN_EMAIL = 'drriftaire@gmail.com';

const formatDateTime = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value || '-';
  return parsed.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export default function AdminDashboard() {
  const {
    adminToken,
    login,
    logout,
    bookings,
    analytics,
    health,
    fetchBookings,
    fetchAnalytics,
    updateBookingStatus,
    checkHealth,
    isLoading,
    error,
    clearError,
  } = useAdminStore();

  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [pendingRemarks, setPendingRemarks] = useState({});
  const [pendingFinancials, setPendingFinancials] = useState({}); // { [id]: { sales: '', profit: '' } }
  const [sortConfig, setSortConfig] = useState({ key: 'Timestamp', direction: 'desc' });
  const [statusFilter, setStatusFilter] = useState('All');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, status: null });


  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  useEffect(() => {
    if (adminToken) {
      fetchBookings();
      fetchAnalytics();
    }
  }, [adminToken, fetchBookings, fetchAnalytics]);

  const sortedBookings = useMemo(() => {
    let list = [...bookings];

    // 1. Filter by Status
    if (statusFilter !== 'All') {
      list = list.filter((b) => (b.Status || 'Pending') === statusFilter);
    }

    // 2. Sort
    const { key, direction } = sortConfig;

    return list.sort((a, b) => {
      let valA = a[key];
      let valB = b[key];

      // Numeric parsing for financials
      if (key === 'Sales' || key === 'Profit' || key === 'Acres') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      }

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [bookings, sortConfig, statusFilter]);

  const exportRows = useMemo(
    () =>
      sortedBookings.map((booking) => ({
        id: booking.id,
        bookingId: booking['Booking ID'] || booking.id,
        requestDate: formatDateTime(booking.Timestamp),
        name: booking.Name || '',
        email: booking.Email || '',
        phone: booking.Phone || '',
        state: booking.State || '',
        district: booking.District || '',
        pinCode: booking['Pin Code'] || '',
        acres: booking.Acres || '',
        cropType: booking['Crop Type'] || '',
        preferredDate: booking.Date || '',
        status: booking.Status || 'Pending',
        remarks: booking.Remarks || '',
        sales: booking.Sales || 0,
        profit: booking.Profit || 0,
      })),
    [sortedBookings]
  );

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoggingIn(true);
    const result = await login(ADMIN_EMAIL, password);
    if (result.success) {
      toast.success('Welcome back');
    }
    setIsLoggingIn(false);
  };

  const toggleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const handleRemarkChange = (id, text) => {
    setPendingRemarks((prev) => ({ ...prev, [id]: text }));
  };

  const handleFinancialChange = (id, field, value) => {
    setPendingFinancials((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || { sales: '', profit: '' }), [field]: value },
    }));
  };

  const handleUpdateStatus = async (id, status) => {
    setConfirmModal({ isOpen: true, id, status });
  };

  const executeUpdateStatus = async () => {
    const { id, status } = confirmModal;
    const remarkToSend = pendingRemarks[id] || '';
    const financials = pendingFinancials[id] || {};
    
    setConfirmModal({ isOpen: false, id: null, status: null });
    
    toast.promise(updateBookingStatus(id, status, remarkToSend, financials.sales, financials.profit), {
      loading: 'Updating record...',
      success: `Record updated to ${status}`,
      error: 'Update failed',
    });
  };

  const handleDownloadCsv = async () => {
    if (!exportRows.length) {
      toast.error('No bookings to export');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Bookings');

    const columns = [
      { header: 'Booking ID', key: 'bookingId' },
      { header: 'Request Date', key: 'requestDate' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Phone', key: 'phone' },
      { header: 'State', key: 'state' },
      { header: 'District', key: 'district' },
      { header: 'Pin Code', key: 'pinCode' },
      { header: 'Acres', key: 'acres' },
      { header: 'Crop Type', key: 'cropType' },
      { header: 'Preferred Date', key: 'preferredDate' },
      { header: 'Status', key: 'status' },
      { header: 'Remarks', key: 'remarks' },
      { header: 'Sales (₹)', key: 'sales' },
      { header: 'Profit (₹)', key: 'profit' },
    ];

    worksheet.columns = columns;
    worksheet.addRows(exportRows);

    // Generate CSV
    const buffer = await workbook.csv.writeBuffer();
    const blob = new Blob([buffer], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `bookings-report-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleDownloadExcel = async () => {
    if (!exportRows.length) {
      toast.error('No bookings to export');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Bookings');

    // Define Columns
    const columns = [
      { header: 'Booking ID', key: 'bookingId', width: 25 },
      { header: 'Request Date', key: 'requestDate', width: 20 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'State', key: 'state', width: 15 },
      { header: 'District', key: 'district', width: 15 },
      { header: 'Pin Code', key: 'pinCode', width: 10 },
      { header: 'Acres', key: 'acres', width: 10 },
      { header: 'Crop Type', key: 'cropType', width: 15 },
      { header: 'Preferred Date', key: 'preferredDate', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Remarks', key: 'remarks', width: 30 },
      { header: 'Sales (₹)', key: 'sales', width: 15 },
      { header: 'Profit (₹)', key: 'profit', width: 15 },
    ];

    worksheet.columns = columns;

    // Add Table
    worksheet.addTable({
      name: 'BookingsTable',
      ref: 'A1',
      headerRow: true,
      totalsRow: false,
      style: {
        theme: 'TableStyleMedium2',
        showRowStripes: true,
      },
      columns: columns.map(c => ({ name: c.header, filterButton: true })),
      rows: exportRows.map(row => [
        row.bookingId,
        row.requestDate,
        row.name,
        row.email,
        row.phone,
        row.state,
        row.district,
        row.pinCode,
        row.acres,
        row.cropType,
        row.preferredDate,
        row.status,
        row.remarks,
        row.sales,
        row.profit,
      ]),
    });

    // Style the header row (Deep Green & White)
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1B4A36' }, // Brand Deep Green
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' },
        size: 11,
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Style Status column based on content
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip header
        const statusCell = row.getCell(12); // L column
        const status = statusCell.value;
        
        let color = 'FF60796D'; // Default Gray
        if (status === 'Accept') color = 'FF10B981'; // Emerald
        if (status === 'Completed') color = 'FF6366F1'; // Indigo
        if (status === 'Reject') color = 'FFEF4444'; // Red
        if (status === 'Pending') color = 'FFF59E0B'; // Amber

        statusCell.font = { color: { argb: color }, bold: true };
      }
    });

    // Write to buffer and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `bookings-report-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };


  if (!adminToken) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f4ee] p-4 selection:bg-green-200">
        <div className="pointer-events-none absolute left-1/4 top-1/4 h-[30rem] w-[30rem] rounded-full bg-green-600/10 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[30rem] w-[30rem] rounded-full bg-lime-600/10 blur-[120px]" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="z-10 w-full max-w-md rounded-3xl border border-green-900/10 bg-white/60 p-8 shadow-[0_8px_32px_0_rgba(29,78,59,0.18)] backdrop-blur-3xl sm:p-10"
        >
          <div className="mb-8 flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-5 inline-flex items-center justify-center rounded-2xl border border-green-900/10 bg-white/80 p-4 shadow-inner"
            >
              <Wind className="h-8 w-8 sm:h-10 sm:w-10 text-green-700" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1b4a36] text-center">Administrator Access</h1>
            <p className="mt-2 flex items-center gap-2 text-[10px] sm:text-sm font-semibold uppercase tracking-widest text-[#5d7365]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-600" />
              Authorized Personnel Only
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Administrator Password"
              required
              className="w-full rounded-xl border border-green-900/10 bg-white px-5 py-4 text-sm text-[#1b4a36] placeholder-[#8aa095] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-700/30"
            />
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoggingIn}
              className="relative mt-2 w-full overflow-hidden rounded-xl border border-green-900/10 bg-[#2f6a47] px-4 py-4 font-semibold tracking-wide text-white transition-all duration-300 hover:bg-[#245a3d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoggingIn ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : 'SIGN IN'}
            </motion.button>
          </form>
        </motion.div>

        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#1b4a36',
              border: '1px solid rgba(47,106,71,0.2)',
            },
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6f4ee] pb-20 font-sans text-[#243328] selection:bg-green-200">
      <div className="pointer-events-none absolute -right-60 -top-60 h-[50rem] w-[50rem] rounded-full bg-green-500/10 blur-[100px]" />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#1b4a36',
            border: '1px solid rgba(47,106,71,0.2)',
            boxShadow: '0 20px 40px -10px rgba(22,60,47,0.25)',
          },
        }}
      />

      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-green-900/5 sm:border-green-900/10 bg-[#f6f4ee]/90 px-4 sm:px-8 py-3 sm:py-5 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="rounded-xl border border-green-700/10 sm:border-green-700/20 bg-gradient-to-br from-green-500/10 to-lime-500/5 p-2 sm:p-2.5 text-green-700">
            <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div>
            <span className="text-base sm:text-2xl font-bold tracking-tight text-[#1b4a36]">Admin Panel</span>
            <div className="hidden sm:flex mt-1 items-center gap-2 text-xs text-[#60796d]">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${
                  health.status === 'ok'
                    ? 'bg-emerald-400'
                    : health.status === 'checking'
                       ? 'animate-pulse bg-amber-400'
                       : 'bg-red-400'
                }`}
              />
              <span>
                {health.status === 'ok'
                  ? 'System Operational'
                  : health.status === 'checking'
                    ? 'Verifying Connection'
                    : 'System Offline'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={checkHealth}
            className="rounded-xl border border-green-900/10 bg-white p-2.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-[#355f48] transition-colors hover:bg-green-50 active:scale-95"
            title="Verify Status"
          >
            <span className="hidden sm:inline">VERIFY STATUS</span>
            <CheckCircle2 className="sm:hidden h-4 w-4" />
          </button>
          <button
            onClick={logout}
            className="group flex items-center gap-2 rounded-xl border border-transparent p-2.5 sm:px-5 sm:py-2.5 text-[#60796d] transition-all duration-300 hover:border-green-900/10 hover:bg-white hover:text-[#1b4a36] active:scale-95"
            title="Log Out"
          >
            <span className="hidden sm:inline text-sm font-semibold tracking-wide">LOG OUT</span>
            <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </nav>

      <main className="relative z-10 w-full mt-10 space-y-12 px-4 sm:px-10 lg:px-16">
        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
        >
          {[
            { label: 'Inquiries', value: analytics.total || 0, icon: Users, color: 'text-[#2f6a47]', bg: 'bg-green-100/70', border: 'border-green-700/20' },
            { label: 'Pending', value: analytics.pending || 0, icon: Clock, color: 'text-amber-700', bg: 'bg-amber-100/70', border: 'border-amber-700/20' },
            { label: 'Accepted', value: analytics.accept || 0, icon: Droplets, color: 'text-emerald-700', bg: 'bg-emerald-100/70', border: 'border-emerald-700/20' },
            { label: 'Finished', value: analytics.completed || 0, icon: CheckCircle2, color: 'text-lime-700', bg: 'bg-lime-100/70', border: 'border-lime-700/20' },
            { label: 'Total Sales', value: `₹${(analytics.totalSales || 0).toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-blue-700', bg: 'bg-blue-100/70', border: 'border-blue-700/20' },
            { label: 'Total Profit', value: `₹${(analytics.totalProfit || 0).toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-indigo-700', bg: 'bg-indigo-100/70', border: 'border-indigo-700/20' },
          ].map((stat) => (
            <motion.div 
              key={stat.label} 
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group relative overflow-hidden rounded-2xl border border-green-900/10 bg-white/70 p-4 sm:p-6 backdrop-blur-md transition-all duration-300 hover:border-green-900/20 hover:shadow-[0_8px_40px_-12px_rgba(22,60,47,0.28)]"
            >
              <div className="absolute -mr-16 -mt-16 rounded-full bg-gradient-to-br from-green-200/30 to-transparent p-32 transition-transform duration-700 group-hover:scale-110" />
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className={`w-fit rounded-lg border p-2 mb-4 ring-1 ring-inset ring-white/70 shadow-inner ${stat.bg} ${stat.border}`}>
                  <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#60796d]">{stat.label}</p>
                  <p className="mt-1 flex items-baseline gap-2 text-xl sm:text-2xl font-bold text-[#1b4a36]">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="border-t border-green-900/10 bg-white/40"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-green-900/10 bg-white/60 px-6 sm:px-8 py-5 sm:py-6 gap-4">
            <h2 className="flex items-center gap-3 text-base sm:text-lg font-semibold text-[#1b4a36]">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>
              Booking Records
            </h2>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button onClick={handleDownloadCsv} className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl border border-green-900/10 bg-white px-3 py-2.5 text-xs font-medium text-[#355f48] transition-colors hover:bg-green-50 shadow-sm">
                <Download className="h-4 w-4" />
                CSV
              </button>
              <button onClick={handleDownloadExcel} className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl border border-green-900/10 bg-white px-3 py-2.5 text-xs font-medium text-[#355f48] transition-colors hover:bg-green-50 shadow-sm">
                <Download className="h-4 w-4" />
                EXCEL
              </button>
              <button onClick={fetchBookings} className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl border border-green-900/10 bg-white px-4 py-2.5 text-xs font-medium text-[#355f48] transition-colors hover:bg-green-50 active:scale-95 shadow-sm">
                <Loader2 className={`h-4 w-4 text-green-700 ${isLoading ? 'animate-spin cursor-not-allowed' : 'transition-transform duration-500 group-hover:rotate-180'}`} />
                <span className="hidden sm:inline">REFRESH</span>
                <span className="sm:hidden text-[10px]">SYNC</span>
              </button>
            </div>
          </div>

          {/* Advanced Controls Bar */}
          <div className="flex flex-col gap-5 bg-white px-6 py-5 border-b border-green-900/10 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#60796d]">Filter Status</span>
              <div className="flex gap-1.5 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                {['All', 'Pending', 'Accept', 'Completed', 'Reject'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-[10px] font-bold tracking-wide transition-all ${
                      statusFilter === s
                        ? 'bg-[#1b4a36] text-white shadow-md'
                        : 'bg-white text-[#60796d] hover:bg-green-50 border border-green-900/5'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#60796d]">Order Records</span>
              <div className="flex gap-1.5 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                {[
                  { label: 'Name', key: 'Name' },
                  { label: 'Booking', key: 'Timestamp' },
                  { label: 'Schedule', key: 'Date' },
                  { label: 'Profit', key: 'Profit' },
                  { label: 'Acres', key: 'Acres' },
                ].map((sort) => (
                  <button
                    key={sort.key}
                    onClick={() => toggleSort(sort.key)}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-[10px] font-bold tracking-wide transition-all ${
                      sortConfig.key === sort.key
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white text-[#60796d] hover:bg-green-50 border border-green-900/5'
                    }`}
                  >
                    {sort.label}
                    {sortConfig.key === sort.key && (
                      <span className="text-[8px] opacity-70">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full">
            {/* Desktop Table */}
            <table className="hidden md:table w-full border-collapse text-left table-fixed">
              <thead>
                <tr className="border-b border-green-900/10 bg-white/50 text-[11px] font-bold uppercase tracking-widest text-[#60796d]">
                  <th className="px-6 py-5 w-[12%]">Ref No.</th>
                  <th className="px-6 py-5 w-[20%]">Customer</th>
                  <th className="px-6 py-5 w-[20%]">Details</th>
                  <th className="px-6 py-5 text-center w-[12%]">Status</th>
                  <th className="px-6 py-5 text-right w-[14%]">Finance</th>
                  <th className="px-6 py-5 text-right w-[22%]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-900/10">
                <AnimatePresence initial={false}>
                  {sortedBookings.map((booking) => (
                    <motion.tr 
                      key={booking.id} 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="transition-colors duration-300 hover:bg-green-50/50"
                    >
                    <td className="whitespace-nowrap px-6 py-6">
                      <div className="font-mono text-xs font-bold text-green-700/80">#{booking['Booking ID']?.split('-')[1] || booking.id.toString().slice(0, 5)}</div>
                      <div className="mt-1 text-[10px] text-[#76877d]">Req: {formatDateTime(booking.Timestamp)}</div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="font-bold text-[#243328] truncate">{booking.Name}</div>
                      <div className="mt-1 text-[11px] text-[#60796d] truncate">{booking.Email}</div>
                      <div className="mt-0.5 text-[10px] text-[#76877d]">{booking.Phone}</div>
                    </td>
                    <td className="px-6 py-6 text-sm">
                      <div className="font-bold text-[#355f48] truncate">{booking.District}</div>
                      <div className="text-[10px] text-[#76877d] truncate">{booking.State} • {booking['Pin Code']}</div>
                      <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                        <span className="rounded-md bg-blue-50 px-2 py-0.5 font-mono text-[9px] font-bold text-blue-600 border border-blue-100">{booking.Acres} AC</span>
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600 border border-emerald-100 uppercase">{booking['Crop Type']}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-6 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                            booking.Status === 'Completed'
                              ? 'border-indigo-500/20 bg-indigo-500/10 text-indigo-400'
                              : booking.Status === 'Accept'
                                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                                : booking.Status === 'Reject'
                                  ? 'border-red-500/20 bg-red-500/10 text-red-400'
                                  : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                          }`}
                        >
                          {booking.Status === 'Completed' && <CheckCircle2 className="h-3 w-3" />}
                          {(!booking.Status || booking.Status === 'Pending') && <Clock className="h-3 w-3" />}
                          {booking.Status === 'Accept' && <Wind className="h-3 w-3" />}
                          {booking.Status || 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <div className="text-[11px] font-bold text-[#1b4a36]">₹ {booking.Sales?.toLocaleString('en-IN') || 0}</div>
                        <div className={`text-[9px] font-bold ${booking.Profit > 0 ? 'text-emerald-600' : 'text-red-400'}`}>
                          P: ₹ {booking.Profit?.toLocaleString('en-IN') || 0}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-6 text-right">
                      {!booking.Status || booking.Status === 'Pending' ? (
                        <div className="flex flex-col items-end gap-2.5">
                          <input
                            type="text"
                            placeholder="Add remarks..."
                            value={pendingRemarks[booking.id] || ''}
                            onChange={(event) => handleRemarkChange(booking.id, event.target.value)}
                            className="w-full max-w-[160px] rounded-xl border border-green-900/10 bg-white px-3 py-2 text-[11px] text-[#243328] transition-all focus:ring-2 focus:ring-green-700/10"
                          />
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleUpdateStatus(booking.id, 'Accept')} className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-[10px] font-bold tracking-wider text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95">
                              <Wind className="h-3.5 w-3.5" /> ACCEPT
                            </button>
                            <button onClick={() => handleUpdateStatus(booking.id, 'Reject')} className="group rounded-xl border border-red-100 bg-red-50 p-2 text-red-500 transition-all hover:bg-red-500 hover:text-white active:scale-95">
                              <XOctagon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : booking.Status === 'Accept' ? (
                        <div className="flex flex-col items-end gap-2.5">
                           <div className="flex gap-1.5">
                             <input
                               type="number"
                               placeholder="Sales"
                               value={pendingFinancials[booking.id]?.sales || ''}
                               onChange={(e) => handleFinancialChange(booking.id, 'sales', e.target.value)}
                               className="w-20 rounded-lg border border-green-900/10 bg-white px-2.5 py-1.5 text-[10px] transition-all focus:ring-2 focus:ring-green-700/10"
                             />
                             <input
                               type="number"
                               placeholder="Profit"
                               value={pendingFinancials[booking.id]?.profit || ''}
                               onChange={(e) => handleFinancialChange(booking.id, 'profit', e.target.value)}
                               className="w-20 rounded-lg border border-green-900/10 bg-white px-2.5 py-1.5 text-[10px] transition-all focus:ring-2 focus:ring-green-700/10"
                             />
                           </div>
                           <button onClick={() => handleUpdateStatus(booking.id, 'Completed')} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-[10px] font-bold tracking-widest text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-95">
                             <CheckCircle2 className="h-3.5 w-3.5" /> FINISH
                           </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end opacity-40">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#76877d]">Records Locked</span>
                        </div>
                      )}
                    </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>

                {(!bookings || bookings.length === 0) && !isLoading && (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center text-[#76877d]">
                      <Wind className="mx-auto mb-6 h-16 w-16 opacity-20" />
                      <p className="text-lg">No active booking records found.</p>
                      <button onClick={fetchBookings} className="mt-4 rounded-lg border border-green-900/10 bg-white px-4 py-2 text-sm transition-colors hover:bg-green-50">
                        Refresh
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Mobile Card List */}
            <div className="md:hidden divide-y divide-green-900/10">
              {(!bookings || bookings.length === 0) && !isLoading ? (
                <div className="px-6 py-20 text-center text-[#76877d]">
                  <Wind className="mx-auto mb-6 h-16 w-16 opacity-20" />
                  <p className="text-lg">No records found.</p>
                </div>
              ) : (
                [...bookings].reverse().map((booking) => (
                  <div key={booking.id} className="p-6 space-y-4 hover:bg-green-50/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-mono text-[10px] text-green-700">REF: {booking['Booking ID'] || booking.id.toString().slice(0, 8)}</div>
                        <div className="text-xs text-[#60796d] mt-1">{formatDateTime(booking.Timestamp)}</div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                          booking.Status === 'Completed' ? 'border-indigo-500/20 bg-indigo-500/10 text-indigo-400' :
                          booking.Status === 'Accept' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' :
                          booking.Status === 'Reject' ? 'border-red-500/20 bg-red-500/10 text-red-400' :
                          'border-amber-500/20 bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {booking.Status || 'Pending'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-lg font-bold text-[#243328]">{booking.Name}</div>
                      <div className="text-sm text-[#60796d]">{booking.Email}</div>
                      <div className="text-sm text-[#76877d]">{booking.Phone}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-green-50/50 rounded-xl border border-green-900/5">
                        <div className="text-[10px] uppercase tracking-wider text-[#60796d] mb-1">Coverage</div>
                        <div className="font-mono text-sm font-bold text-[#28593b]">{booking.Acres} Acres</div>
                      </div>
                      <div className="p-3 bg-green-50/50 rounded-xl border border-green-900/5">
                        <div className="text-[10px] uppercase tracking-wider text-[#60796d] mb-1">Crop Type</div>
                        <div className="text-sm font-bold text-[#28593b]">{booking['Crop Type']}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-[#60796d]">
                      <Clock className="h-4 w-4" />
                      <span>{booking.State}, {booking.District}</span>
                    </div>

                    {booking.Remarks && (
                      <div className="rounded-xl bg-amber-50/50 border border-amber-500/10 p-3 text-xs italic text-[#76877d]">
                        "{booking.Remarks}"
                      </div>
                    )}

                    {(booking.Sales > 0 || booking.Profit > 0) && (
                      <div className="flex gap-4 p-3 bg-[#f6f4ee]/40 rounded-xl border border-green-900/5">
                        <div className="flex-1">
                          <div className="text-[10px] uppercase font-bold text-[#60796d]">Total Sales</div>
                          <div className="text-sm font-bold text-[#1b4a36]">₹ {booking.Sales?.toLocaleString('en-IN') || 0}</div>
                        </div>
                        <div className="flex-1">
                          <div className="text-[10px] uppercase font-bold text-[#60796d]">Net Profit</div>
                          <div className="text-sm font-bold text-emerald-600">₹ {booking.Profit?.toLocaleString('en-IN') || 0}</div>
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                       {!booking.Status || booking.Status === 'Pending' ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Add remarks..."
                            value={pendingRemarks[booking.id] || ''}
                            onChange={(event) => handleRemarkChange(booking.id, event.target.value)}
                            className="w-full rounded-xl border border-green-900/10 bg-white px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-green-700/10"
                          />
                          <div className="flex gap-2">
                            <button onClick={() => handleUpdateStatus(booking.id, 'Accept')} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 active:scale-95 transition-all">
                              <Wind className="h-4 w-4" /> ACCEPT
                            </button>
                            <button onClick={() => handleUpdateStatus(booking.id, 'Reject')} className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 active:scale-95 transition-all">
                               REJECT
                            </button>
                          </div>
                        </div>
                      ) : booking.Status === 'Accept' ? (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <input
                              type="number"
                              placeholder="Sales (₹)"
                              value={pendingFinancials[booking.id]?.sales || ''}
                              onChange={(e) => handleFinancialChange(booking.id, 'sales', e.target.value)}
                              className="w-full rounded-xl border border-green-900/10 bg-white px-4 py-3 text-sm transition-all focus:ring-2 focus:ring-green-700/10"
                            />
                            <input
                              type="number"
                              placeholder="Profit (₹)"
                              value={pendingFinancials[booking.id]?.profit || ''}
                              onChange={(e) => handleFinancialChange(booking.id, 'profit', e.target.value)}
                              className="w-full rounded-xl border border-green-900/10 bg-white px-4 py-3 text-sm transition-all focus:ring-2 focus:ring-green-700/10"
                            />
                          </div>
                          <button onClick={() => handleUpdateStatus(booking.id, 'Completed')} className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
                            <CheckCircle2 className="h-4 w-4" /> MARK COMPLETED
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-2 text-[10px] uppercase font-bold text-[#b0bcaf] tracking-widest bg-gray-50 rounded-lg border border-dashed border-gray-200">
                          Finalized / Closed
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1b4a36]/40 backdrop-blur-sm transition-opacity" 
              onClick={() => setConfirmModal({ isOpen: false, id: null, status: null })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-sm rounded-[2rem] border border-green-900/10 bg-white p-8 shadow-2xl transition-all"
            >
              <div className="mb-6 flex flex-col items-center text-center">
                <motion.div 
                  initial={{ rotate: -20, scale: 0.5 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${
                  confirmModal.status === 'Accept' ? 'bg-emerald-100 text-emerald-600' :
                  confirmModal.status === 'Reject' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'
                }`}>
                  {confirmModal.status === 'Accept' && <Wind className="h-8 w-8" />}
                  {confirmModal.status === 'Reject' && <XOctagon className="h-8 w-8" />}
                  {confirmModal.status === 'Completed' && <CheckCircle2 className="h-8 w-8" />}
                </motion.div>
                <h3 className="text-xl font-bold text-[#1b4a36]">Confirm Action</h3>
                <p className="mt-2 text-sm text-[#60796d]">
                  Are you sure you want to <strong>{confirmModal.status === 'Accept' ? 'CONFIRM' : confirmModal.status === 'Reject' ? 'DECLINE' : 'FINALIZE'}</strong> this booking? This action will update the system and notify the client.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={executeUpdateStatus}
                  className={`w-full rounded-xl py-3.5 text-sm font-bold tracking-wider text-white shadow-lg transition-all ${
                    confirmModal.status === 'Accept' ? 'bg-emerald-600 hover:bg-emerald-700' :
                    confirmModal.status === 'Reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  PROCEED
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setConfirmModal({ isOpen: false, id: null, status: null })}
                  className="w-full rounded-xl border border-green-900/10 bg-white py-3.5 text-sm font-bold tracking-wider text-[#60796d] transition-all hover:bg-green-50"
                >
                  CANCEL
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
