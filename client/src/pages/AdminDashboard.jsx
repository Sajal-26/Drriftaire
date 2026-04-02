import { useEffect, useMemo, useState, useRef } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import useAdminStore from '../store/useAdminStore';
import {
  CheckCircle2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Droplets,
  ExternalLink,
  LayoutDashboard,
  Loader2,
  LogOut,
  Search,
  TrendingUp,
  IndianRupee,
  Users,
  Wind,
  XOctagon,
  FilterX,
} from 'lucide-react';

const ADMIN_EMAIL = 'drriftaire@gmail.com';

const formatDateTime = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value || '-';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
};

const formatDateOnly = (value) => {
  if (!value) return '-';
  // Handles both YYYY-MM-DD and ISO strings
  const d = new Date(value.includes('T') ? value : `${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [dateFilterType, setDateFilterType] = useState('Scheduling'); // 'Scheduling' or 'Booking'
  const calendarRef = useRef(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
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

    // 2. Filter by Search Query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((b) => {
        return (
          (b.Name || '').toLowerCase().includes(q) ||
          (b.Email || '').toLowerCase().includes(q) ||
          (b.Phone || '').toLowerCase().includes(q) ||
          (b.State || '').toLowerCase().includes(q) ||
          (b.District || '').toLowerCase().includes(q) ||
          (b['Crop Type'] || '').toLowerCase().includes(q) ||
          (b.Remarks || '').toLowerCase().includes(q) ||
          (b['Booking ID'] || '').toLowerCase().includes(q)
        );
      });
    }

    // 3. Filter by Date Range
    if (dateRange.start) {
      const start = new Date(dateRange.start);
      start.setHours(0, 0, 0, 0);
      const end = dateRange.end ? new Date(dateRange.end) : new Date(start);
      end.setHours(23, 59, 59, 999);

      list = list.filter((b) => {
        let target;
        if (dateFilterType === 'Scheduling') {
          // booking.Date is YYYY-MM-DD
          target = new Date(`${b.Date}T00:00:00`);
        } else {
          // booking.Timestamp is ISO
          target = new Date(b.Timestamp);
        }
        return target >= start && target <= end;
      });
    }

    // 4. Sort
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
  }, [bookings, sortConfig, statusFilter, searchTerm, dateRange, dateFilterType]);

  const scheduledDatesSet = useMemo(() => {
    return new Set(bookings.filter(b => b.Date).map(b => b.Date));
  }, [bookings]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    }
    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCalendarOpen]);

  const handleDateSelect = (date) => {
    const dStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    if (!dateRange.start || (dateRange.start && dateRange.end)) {
      setDateRange({ start: dStr, end: null });
    } else {
      const start = new Date(dateRange.start);
      if (date < start) {
        setDateRange({ start: dStr, end: dateRange.start });
      } else {
        setDateRange({ start: dateRange.start, end: dStr });
      }
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setSortConfig({ key: 'Timestamp', direction: 'desc' });
    setDateRange({ start: null, end: null });
  };

  const getCalendarDays = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    // Padding for first week
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    // Days of month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

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
        preferredDate: formatDateOnly(booking.Date),
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
            { label: 'Total Sales', value: `₹${(analytics.totalSales || 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-blue-700', bg: 'bg-blue-100/70', border: 'border-blue-700/20' },
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
          className="relative rounded-[3rem] border border-green-900/10 bg-white/40 shadow-xl shadow-green-900/5 overflow-visible"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-green-900/10 bg-white/60 px-6 sm:px-8 py-5 sm:py-6 gap-4 rounded-t-[3rem]">
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
          <div className="relative z-20 flex flex-col gap-6 bg-white px-6 py-6 border-b border-green-900/10 lg:px-8 overflow-visible">
            {/* Row 1: Search & Date */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
              
              {/* Search Bar */}
              <div className="relative group min-w-0 w-full md:w-96 flex-shrink-0">
                <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6b7c72] transition-colors group-focus-within:text-green-700" />
                <input
                  type="text"
                  placeholder="Seach by name, phone, crop..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-green-900/10 bg-[#f9faf9] pl-10 pr-4 py-2.5 text-[10px] font-bold tracking-wide text-[#1b4a36] placeholder-[#8aa095] transition-all focus:border-green-900/20 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-900/5"
                />
              </div>

              {/* Actions: Clear & Date */}
              <div className="flex items-center gap-3">
                {(searchTerm || statusFilter !== 'All' || dateRange.start || sortConfig.key !== 'Timestamp' || sortConfig.direction !== 'desc') && (
                  <button
                    onClick={handleClearFilters}
                    title="Clear All Filters"
                    className="flex items-center justify-center gap-2 rounded-xl border border-rose-900/10 bg-white px-3 py-2.5 text-[10px] font-bold tracking-wide text-rose-500 transition-colors hover:bg-rose-50 hover:border-rose-200 active:scale-95 shadow-sm"
                  >
                    <FilterX className="h-4 w-4" />
                    <span className="hidden sm:inline">CLEAR</span>
                  </button>
                )}

                {/* Date Filter & Calendar */}
                <div className="relative z-30">
                <button
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-[10px] font-bold tracking-wide transition-all ${
                    dateRange.start 
                      ? 'border-green-700/30 bg-green-50 text-green-800' 
                      : 'border-green-900/10 bg-white text-[#60796d] hover:bg-green-50'
                  }`}
                >
                  <Calendar className="h-4 w-4 opacity-70" />
                  <span>
                    {dateRange.start 
                      ? `${formatDateOnly(dateRange.start)}${dateRange.end ? ` to ${formatDateOnly(dateRange.end)}` : ''}` 
                      : 'FILTER BY DATE'}
                  </span>
                  {dateRange.start && (
                    <div 
                      onClick={(e) => { e.stopPropagation(); setDateRange({ start: null, end: null }); }}
                      className="ml-1 rounded-full bg-green-800/10 p-0.5 hover:bg-green-800/20"
                    >
                      <XOctagon className="h-3 w-3" />
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {isCalendarOpen && (
                    <motion.div
                      ref={calendarRef}
                      initial={{ opacity: 0, y: 30, scale: 0.8, rotate: 2 }}
                      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, y: 20, scale: 0.8, rotate: -2 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      className="absolute right-0 sm:-right-4 md:right-0 origin-bottom-right bottom-full z-[100] mb-3 w-72 rounded-3xl border border-green-900/10 bg-white/95 p-4 shadow-[0_20px_50px_-12px_rgba(27,74,54,0.25)] backdrop-blur-3xl"
                    >
                        <div className="flex items-center justify-between mb-3 px-1">
                          <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}>
                            <ChevronLeft className="h-4 w-4 text-[#1b4a36]" />
                          </button>
                          <span className="text-[11px] font-black uppercase tracking-widest text-[#1b4a36]">
                            {calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                          </span>
                          <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}>
                            <ChevronRight className="h-4 w-4 text-[#1b4a36]" />
                          </button>
                        </div>

                        <div className="mb-3 flex gap-1 rounded-xl bg-[#f6f4ee] p-1">
                          {['Scheduling', 'Booking'].map(type => (
                            <button
                              key={type}
                              onClick={() => setDateFilterType(type)}
                              className={`flex-1 rounded-lg py-1.5 text-[9px] font-black uppercase tracking-tighter transition-all ${
                                dateFilterType === type ? 'bg-[#1b4a36] text-white shadow-sm' : 'text-[#60796d]'
                              }`}
                            >
                              {type} DATE
                            </button>
                          ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center mb-1">
                          {['S','M','T','W','T','F','S'].map(d => (
                            <span key={d} className="text-[8px] font-black text-[#8aa095] uppercase">{d}</span>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {getCalendarDays().map((day, idx) => {
                            if (!day) return <div key={`pad-${idx}`} />;
                            const dStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
                            const isScheduled = scheduledDatesSet.has(dStr);
                            const isSelected = dateRange.start === dStr || dateRange.end === dStr;
                            const isInRange = dateRange.start && dateRange.end && dStr > dateRange.start && dStr < dateRange.end;
                            
                            return (
                              <button
                                key={dStr}
                                onClick={() => handleDateSelect(day)}
                                className={`group relative h-8 w-8 rounded-lg text-[10px] font-bold transition-all ${
                                  isSelected ? 'bg-[#1b4a36] text-white' : 
                                  isInRange ? 'bg-green-100 text-green-800' :
                                  'text-[#1b4a36] hover:bg-green-50'
                                }`}
                              >
                                {day.getDate()}
                                {isScheduled && !isSelected && (
                                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.6)]" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                  )}
                </AnimatePresence>
              </div>
              </div>
            </div>

            {/* Row 2: Status & Sorting */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 w-full">
              {/* Status Filters */}
              <div className="flex items-center gap-3 w-full xl:w-auto min-w-0 flex-1">
                <span className="hidden xl:inline text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#60796d]">Status:</span>
                <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 no-scrollbar w-full">
                  {['All', 'Pending', 'Accept', 'Completed', 'Reject'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-[9px] font-black tracking-widest transition-all uppercase ${
                        statusFilter === s
                          ? 'bg-[#1b4a36] text-white shadow-sm'
                          : 'bg-white text-[#60796d] hover:bg-green-50 border border-green-900/5'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

            {/* Sorting Controls */}
            <div className="flex items-center gap-3 w-full xl:w-auto xl:justify-end min-w-0">
              <span className="hidden xl:inline text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#60796d]">Order by:</span>
              <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 no-scrollbar w-full">
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
                    className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-[9px] font-black tracking-widest transition-all uppercase ${
                      sortConfig.key === sort.key
                        ? 'bg-emerald-600 text-white shadow-sm'
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
          </div>

          <div className="w-full lg:px-8 lg:py-8">
            {/* Premium Horizontal List Layout */}
            <div className="flex flex-col gap-5">
              <AnimatePresence mode="popLayout">
                {sortedBookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="group relative flex flex-col lg:flex-row items-stretch lg:items-center gap-6 overflow-hidden rounded-[2rem] border border-green-900/10 bg-white/70 p-5 lg:p-4 backdrop-blur-3xl transition-all duration-500 hover:border-green-900/20 hover:shadow-[0_15px_40px_-10px_rgba(22,60,47,0.12)] hover:bg-white/90"
                  >
                    {/* ID & Status Section */}
                    <div className="flex lg:flex-col items-center lg:items-start justify-between lg:justify-center gap-3 lg:w-[12%] lg:pl-4 border-b lg:border-b-0 lg:border-r border-green-900/5 pb-4 lg:pb-0">
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] font-bold text-green-700/60 uppercase tracking-tighter">
                          Ref: {booking['Booking ID']?.split('-')[1] || booking.id.toString().slice(0, 5)}
                        </span>
                        <span className="text-[10px] text-[#76877d] mt-0.5">{formatDateTime(booking.Timestamp)}</span>
                      </div>
                      <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] shadow-sm bg-white ${
                        booking.Status === 'Completed' ? 'border-indigo-500/20 text-indigo-500' :
                        booking.Status === 'Accept' ? 'border-emerald-500/20 text-emerald-500' :
                        booking.Status === 'Reject' ? 'border-red-500/20 text-red-500' :
                        'border-amber-500/20 text-amber-500'
                      }`}>
                        {booking.Status || 'Pending'}
                      </div>
                    </div>

                    {/* Customer Section */}
                    <div className="flex items-center gap-4 lg:w-[22%] min-w-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-700 transition-colors group-hover:bg-[#1b4a36] group-hover:text-white">
                        <Users className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-bold tracking-tight text-[#1b4a36]">{booking.Name}</h3>
                        <p className="truncate text-[11px] text-[#60796d]">{booking.Email}</p>
                        <a href={`tel:${booking.Phone}`} className="mt-1 block text-[10px] font-semibold text-[#76877d] hover:text-green-700">
                          {booking.Phone}
                        </a>
                      </div>
                    </div>

                    {/* Mission Details */}
                    <div className="lg:w-[25%] flex flex-col gap-2.5">
                      <div className="flex items-center gap-2 text-[#355f48]">
                        <Droplets className="h-4 w-4 opacity-50 shrink-0" />
                        <span className="text-xs font-bold truncate">{booking.District}, {booking.State}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 rounded-lg bg-green-50/50 px-2.5 py-1 text-[10px] font-bold text-green-700 border border-green-900/5">
                           {booking.Acres} AC
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg bg-[#f6f4ee] px-2.5 py-1 text-[10px] font-bold text-[#60796d] border border-green-900/5 uppercase">
                           {booking['Crop Type']}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-[#8aa095] font-medium">
                           <Clock className="h-3 w-3" /> {formatDateOnly(booking.Date)}
                        </div>
                      </div>
                    </div>

                    {/* Financials & Remarks */}
                    <div className="lg:w-[18%] flex flex-col justify-center gap-2">
                       {booking.Sales > 0 ? (
                         <div className="space-y-1.5">
                           <div className="flex justify-between items-center px-3 py-1.5 rounded-xl bg-[#1b4a36] text-[10px] font-bold text-white shadow-sm">
                              <span>SALES</span>
                              <span className="font-mono">₹{booking.Sales.toLocaleString('en-IN')}</span>
                           </div>
                           <div className="flex justify-between items-center px-3 py-1.5 rounded-xl bg-white border border-green-900/5 text-[10px] font-bold">
                              <span className="text-[#60796d]">PROFIT</span>
                              <span className="text-emerald-600 font-mono">₹{booking.Profit.toLocaleString('en-IN')}</span>
                           </div>
                         </div>
                       ) : booking.Remarks ? (
                         <div className="rounded-xl bg-amber-50/50 border border-amber-500/10 p-2.5 italic text-[10px] text-[#76877d] line-clamp-2">
                           "{booking.Remarks}"
                         </div>
                       ) : (
                         <div className="text-[10px] text-[#b0bcaf] font-medium uppercase tracking-widest text-center">No Activity</div>
                       )}
                    </div>

                    {/* Action Bar */}
                    <div className="lg:w-[23%] lg:pl-4 border-t lg:border-t-0 lg:border-l border-green-900/5 pt-4 lg:pt-0">
                      {!booking.Status || booking.Status === 'Pending' ? (
                        <div className="flex flex-col gap-2.5">
                          <input
                            type="text"
                            placeholder="Brief remarks..."
                            value={pendingRemarks[booking.id] || ''}
                            onChange={(event) => handleRemarkChange(booking.id, event.target.value)}
                            className="w-full rounded-xl border border-green-900/10 bg-white/80 px-3 py-2 text-[11px] transition-all focus:ring-4 focus:ring-green-700/5"
                          />
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleUpdateStatus(booking.id, 'Accept')}
                              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#2f6a47] py-2.5 text-[10px] font-bold tracking-widest text-white shadow-lg shadow-green-900/10 hover:bg-[#1b4a36] transition-all"
                            >
                              ACCEPT
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(booking.id, 'Reject')}
                              className="px-3 rounded-xl border border-red-50 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                            >
                              <XOctagon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : booking.Status === 'Accept' ? (
                        <div className="flex flex-col gap-2.5">
                           <div className="flex gap-2">
                            <input
                              type="number"
                              placeholder="Sales"
                              value={pendingFinancials[booking.id]?.sales || ''}
                              onChange={(e) => handleFinancialChange(booking.id, 'sales', e.target.value)}
                              className="flex-1 min-w-0 rounded-xl border border-green-900/10 bg-white px-2.5 py-2 text-[11px] focus:ring-4 focus:ring-indigo-700/5"
                            />
                            <input
                              type="number"
                              placeholder="Profit"
                              value={pendingFinancials[booking.id]?.profit || ''}
                              onChange={(e) => handleFinancialChange(booking.id, 'profit', e.target.value)}
                              className="flex-1 min-w-0 rounded-xl border border-green-900/10 bg-white px-2.5 py-2 text-[11px] focus:ring-4 focus:ring-indigo-700/5"
                            />
                           </div>
                           <button 
                            onClick={() => handleUpdateStatus(booking.id, 'Completed')}
                            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-[10px] font-bold tracking-widest text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
                          >
                            FINALIZE
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-2 opacity-50">
                           <CheckCircle2 className="h-4 w-4 text-[#8aa095] mb-1" />
                           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8aa095]">Locked</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {(!bookings || bookings.length === 0) && !isLoading && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <Wind className="mb-6 h-12 w-12 text-green-700/10" />
                  <p className="text-sm font-bold text-[#243328]/40">No records found.</p>
                </div>
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
