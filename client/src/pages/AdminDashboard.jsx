import { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';
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
  Users,
  Wind,
  XOctagon,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

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

  const exportRows = useMemo(
    () =>
      [...bookings].reverse().map((booking) => ({
        bookingId: booking.id,
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
      })),
    [bookings]
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

  const handleRemarkChange = (id, text) => {
    setPendingRemarks((prev) => ({ ...prev, [id]: text }));
  };

  const handleUpdateStatus = async (id, status) => {
    setConfirmModal({ isOpen: true, id, status });
  };

  const executeUpdateStatus = async () => {
    const { id, status } = confirmModal;
    const remarkToSend = pendingRemarks[id] || '';
    
    setConfirmModal({ isOpen: false, id: null, status: null });
    
    toast.promise(updateBookingStatus(id, status, remarkToSend), {
      loading: 'Updating record...',
      success: `Record updated to ${status}`,
      error: 'Update failed',
    });
  };

  const handleDownloadCsv = () => {
    if (!exportRows.length) {
      toast.error('No bookings to export');
      return;
    }

    const headers = [
      'Booking ID',
      'Request Date',
      'Name',
      'Email',
      'Phone',
      'State',
      'District',
      'Pin Code',
      'Acres',
      'Crop Type',
      'Preferred Date',
      'Status',
      'Remarks',
    ];
    const escapeCsv = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

    const lines = [
      headers.join(','),
      ...exportRows.map((row) =>
        [
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
        ]
          .map(escapeCsv)
          .join(',')
      ),
    ];

    const blob = new Blob([`\uFEFF${lines.join('\n')}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadExcel = () => {
    if (!exportRows.length) {
      toast.error('No bookings to export');
      return;
    }

    // Prepare data for XLSX
    const wsData = [
      [
        'Booking ID',
        'Request Date',
        'Name',
        'Email',
        'Phone',
        'State',
        'District',
        'Pin Code',
        'Acres',
        'Crop Type',
        'Preferred Date',
        'Status',
        'Remarks',
      ],
      ...exportRows.map((row) => [
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
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bookings');

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `bookings-${new Date().toISOString().slice(0, 10)}.xlsx`);
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

      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-green-900/10 bg-[#f6f4ee]/90 px-4 sm:px-8 py-3 sm:py-5 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="rounded-xl border border-green-700/20 bg-gradient-to-br from-green-500/20 to-lime-500/10 p-2 sm:p-2.5 text-green-700 shadow-inner">
            <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div>
            <span className="text-lg sm:text-2xl font-bold tracking-tight text-[#1b4a36]">Admin Panel</span>
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

      <main className="relative z-10 mx-auto mt-10 max-w-7xl space-y-10 px-6 lg:px-8">
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
          className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {[
            { label: 'Inquiries', value: analytics.total || 0, icon: Users, color: 'text-[#2f6a47]', bg: 'bg-green-100/70', border: 'border-green-700/20' },
            { label: 'Pending', value: analytics.pending || 0, icon: Clock, color: 'text-amber-700', bg: 'bg-amber-100/70', border: 'border-amber-700/20' },
            { label: 'Accepted', value: analytics.accept || 0, icon: Droplets, color: 'text-emerald-700', bg: 'bg-emerald-100/70', border: 'border-emerald-700/20' },
            { label: 'Finished', value: analytics.completed || 0, icon: CheckCircle2, color: 'text-lime-700', bg: 'bg-lime-100/70', border: 'border-lime-700/20' },
          ].map((stat) => (
            <motion.div 
              key={stat.label} 
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-green-900/10 bg-white/70 p-4 sm:p-7 backdrop-blur-md transition-all duration-300 hover:border-green-900/20 hover:shadow-[0_8px_40px_-12px_rgba(22,60,47,0.28)]"
            >
              <div className="absolute -mr-16 -mt-16 rounded-full bg-gradient-to-br from-green-200/30 to-transparent p-32 transition-transform duration-700 group-hover:scale-110" />
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-[10px] sm:text-sm font-medium tracking-wide text-[#60796d]">{stat.label}</p>
                  <p className="mt-1 sm:mt-3 flex items-baseline gap-2 text-2xl sm:text-4xl font-bold text-[#1b4a36]">{stat.value}</p>
                </div>
                <div className={`rounded-lg sm:rounded-2xl border p-2 sm:p-4 ring-1 ring-inset ring-white/70 shadow-inner ${stat.bg} ${stat.border}`}>
                  <stat.icon className={`h-4 w-4 sm:h-6 sm:w-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="overflow-hidden rounded-[2rem] border border-green-900/10 bg-white/75 shadow-[0_20px_60px_-15px_rgba(22,60,47,0.28)] backdrop-blur-xl"
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

          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="hidden md:table w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-green-900/10 bg-white/50 text-xs font-semibold uppercase tracking-widest text-[#60796d]">
                  <th className="px-8 py-5">Reference No.</th>
                  <th className="px-8 py-5">Customer Information</th>
                  <th className="px-8 py-5">Service Requirements</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-900/10">
                <AnimatePresence initial={false}>
                  {[...bookings].reverse().map((booking) => (
                    <motion.tr 
                      key={booking.id} 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="transition-colors duration-300 hover:bg-green-50/50"
                    >
                    <td className="whitespace-nowrap px-8 py-6">
                      <div className="mb-1 font-mono text-xs text-green-700">Ref: {booking['Booking ID'] || booking.id.toString().slice(0, 8)}</div>
                      <div className="text-sm text-[#60796d]">Requested: {formatDateTime(booking.Timestamp)}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-base font-semibold text-[#243328]">{booking.Name}</div>
                      <div className="mt-1 text-sm text-[#60796d]">{booking.Email}</div>
                      <div className="mt-0.5 text-xs text-[#76877d]">{booking.Phone}</div>
                    </td>
                    <td className="px-8 py-6 text-sm">
                      <div className="font-medium text-[#355f48]">{booking.State}, {booking.District}</div>
                      <div className="mt-0.5 text-xs text-[#60796d]">PIN: {booking['Pin Code']}</div>
                      <div className="mt-2 inline-block rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 font-mono text-xs text-blue-500">{booking.Acres} Acres</div>
                      <div className="ml-2 mt-1 inline-block rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-500">{booking['Crop Type']}</div>
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-[#76877d]"><Clock className="h-3.5 w-3.5" /> For: {booking.Date}</div>
                    </td>
                    <td className="whitespace-nowrap px-8 py-6">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm ${
                          booking.Status === 'Completed'
                            ? 'border-indigo-500/20 bg-indigo-500/10 text-indigo-400'
                            : booking.Status === 'Accept'
                              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                              : booking.Status === 'Reject'
                                ? 'border-red-500/20 bg-red-500/10 text-red-400'
                                : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {booking.Status === 'Completed' && <CheckCircle2 className="h-3.5 w-3.5" />}
                        {(!booking.Status || booking.Status === 'Pending') && <Clock className="h-3.5 w-3.5" />}
                        {booking.Status === 'Accept' && <Wind className="h-3.5 w-3.5" />}
                        {booking.Status || 'Pending'}
                      </span>
                      {booking.Remarks && (
                        <div className="mt-3 border-l-2 border-green-900/20 pl-3 text-xs italic text-[#60796d]">
                          "{booking.Remarks}"
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-8 py-6 text-right">
                      {!booking.Status || booking.Status === 'Pending' ? (
                        <div className="flex flex-col items-end gap-2">
                          <input
                            type="text"
                            placeholder="Add remarks..."
                            value={pendingRemarks[booking.id] || ''}
                            onChange={(event) => handleRemarkChange(booking.id, event.target.value)}
                            className="w-full max-w-[170px] rounded-lg border border-green-900/10 bg-white px-3 py-1.5 text-xs text-[#243328] placeholder-[#8aa095] transition-all focus:outline-none focus:ring-1 focus:ring-green-700/40"
                          />
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleUpdateStatus(booking.id, 'Accept')} className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-emerald-400 shadow-sm transition-all hover:bg-emerald-500 hover:text-white active:scale-95" title="Confirm">
                              <Wind className="h-4 w-4" /> CONFIRM
                            </button>
                            <button onClick={() => handleUpdateStatus(booking.id, 'Reject')} className="rounded-xl border border-transparent p-1.5 text-red-400 transition-all hover:border-red-500 hover:bg-red-500 hover:text-white active:scale-95" title="Decline">
                              <XOctagon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : booking.Status === 'Accept' ? (
                        <div className="flex items-center justify-end">
                          <button onClick={() => handleUpdateStatus(booking.id, 'Completed')} className="flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-xs font-bold tracking-widest text-indigo-400 shadow-sm transition-all hover:border-indigo-500/40 hover:bg-indigo-500/20 active:scale-95" title="Mark as Finalized">
                            <CheckCircle2 className="h-4 w-4" /> FINALIZE
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-medium uppercase tracking-wider text-[#76877d]">Action Restricted</span>
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
                      <div className="rounded-xl bg-amber-50/50 border border-amber-500/10 p-3 text-xs italic text-[#7e604d]">
                        "{booking.Remarks}"
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
                            className="w-full rounded-xl border border-green-900/10 bg-white px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-green-700/20"
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
                        <button onClick={() => handleUpdateStatus(booking.id, 'Completed')} className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
                          <CheckCircle2 className="h-4 w-4" /> MARK COMPLETED
                        </button>
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
