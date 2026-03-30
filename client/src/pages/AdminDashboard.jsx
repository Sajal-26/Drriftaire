import { useEffect, useState } from 'react';
import useAdminStore from '../store/useAdminStore';
import { 
  LogOut, 
  LayoutDashboard, 
  Droplets, 
  Users, 
  CheckCircle2, 
  Clock, 
  XOctagon, 
  Loader2, 
  Wind 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
  // Grab all state and actions from our centralized Zustand brain
  const { adminToken, login, logout, bookings, analytics, fetchBookings, fetchAnalytics, updateBookingStatus, isLoading, error, clearError } = useAdminStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [pendingRemarks, setPendingRemarks] = useState({});

  // Global Error Toaster
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Bootup Fetch (Only fires if we hold a valid token)
  useEffect(() => {
    if (adminToken) {
      fetchBookings();
      fetchAnalytics();
    }
  }, [adminToken, fetchBookings, fetchAnalytics]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const result = await login(email, password);
    if (result.success) {
      toast.success('Access Granted - Welcome back Commander');
    }
    setIsLoggingIn(false);
  };

  const handleRemarkChange = (id, text) => {
    setPendingRemarks(prev => ({ ...prev, [id]: text }));
  };

  const handleUpdateStatus = async (id, status) => {
    const remarkToSend = pendingRemarks[id] || "";
    toast.promise(updateBookingStatus(id, status, remarkToSend), {
      loading: 'Transmitting command...',
      success: `Mission officially updated to ${status}! 🚁`,
      error: 'Transmission failed',
    });
  };

  // ---------------------------------------------------------------------------
  // VIEW: SECURE LOGIN TERMINAL
  // ---------------------------------------------------------------------------
  if (!adminToken) {
    return (
      <div className="min-h-screen bg-[#060b13] flex items-center justify-center p-4 overflow-hidden relative selection:bg-blue-500/30">
        {/* Background Ambient Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Glassmorphism Card */}
        <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] z-10 transition-all duration-500 hover:border-white/20">
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-5 inline-flex items-center justify-center ring-1 ring-inset ring-white/10 shadow-inner">
              <Wind className="w-10 h-10 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent tracking-tight">Admin Terminal</h1>
            <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Secure Protocol Active
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Terminal ID (Email)" 
                required
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-5 py-4 placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 backdrop-blur-sm"
              />
            </div>
            <div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Passcode" 
                required
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-5 py-4 placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 backdrop-blur-sm"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full mt-2 relative group overflow-hidden bg-blue-600 text-white font-semibold tracking-wide rounded-xl px-4 py-4 transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border border-blue-400/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/20 to-blue-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              {isLoggingIn ? <Loader2 className="w-5 h-5 mx-auto animate-spin" /> : 'AUTHENTICATE'}
            </button>
          </form>
        </div>
        <Toaster position="bottom-center" toastOptions={{ style: { background: '#0f172a', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)' } }} />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // VIEW: DASHBOARD
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 selection:bg-blue-500/30 pb-20 font-sans relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute -top-60 -right-60 w-[50rem] h-[50rem] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)' } }} />
      
      {/* Premium Dark Top Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0B1120]/80 backdrop-blur-xl border-b border-white/5 px-8 py-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-gradient-to-br from-blue-500/20 to-indigo-500/10 rounded-xl border border-blue-500/20 text-blue-400 shadow-inner">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">Mission Control</span>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all duration-300 border border-transparent hover:border-white/10 active:scale-95 group"
        >
          <span className="text-sm font-semibold tracking-wide">SHUT DOWN</span>
          <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 mt-10 space-y-10 relative z-10">
        
        {/* KPI Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Requests', value: analytics.total || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/5', border: 'border-blue-400/20' },
            { label: 'Pending Assessment', value: analytics.pending || 0, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/5', border: 'border-amber-400/20' },
            { label: 'Drones Deployed', value: analytics.accept || 0, icon: Droplets, color: 'text-emerald-400', bg: 'bg-emerald-400/5', border: 'border-emerald-400/20' },
            { label: 'Missions Completed', value: analytics.completed || 0, icon: CheckCircle2, color: 'text-indigo-400', bg: 'bg-indigo-400/5', border: 'border-indigo-400/20' }
          ].map((stat, i) => (
            <div key={i} className={`p-7 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md relative overflow-hidden group hover:border-white/10 transition-all duration-300 hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)]`}>
              {/* Decorative radial gradient corner */}
              <div className={`absolute top-0 right-0 p-32 bg-gradient-to-br from-white/[0.03] to-transparent rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-110`} />
              
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-slate-400 text-sm font-medium tracking-wide">{stat.label}</p>
                  <p className="text-4xl font-bold text-white mt-3 items-baseline flex gap-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.border} border ring-1 ring-inset ring-white/5 shadow-inner`}>
                  <stat.icon className={`w-6 h-6 ${stat.color} drop-shadow-[0_0_8px_currentColor]`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Dispatches Table Container */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
          {/* Table Header block */}
          <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-black/20">
            <h2 className="text-lg font-semibold text-white flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              Live Grid Feed
            </h2>
            <button onClick={fetchBookings} className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-colors group flex items-center gap-2 active:scale-95 text-sm font-medium text-slate-300">
              <Loader2 className={`w-4 h-4 text-blue-400 ${isLoading ? 'animate-spin cursor-not-allowed' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              SYNC FEED
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.01] border-b border-white/5 text-slate-400 text-xs uppercase tracking-widest font-semibold">
                  <th className="px-8 py-5">Intel / Timestamp</th>
                  <th className="px-8 py-5">Client Profile</th>
                  <th className="px-8 py-5">Farm Telemetry</th>
                  <th className="px-8 py-5">Status Plaque</th>
                  <th className="px-8 py-5 text-right">Command Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[...bookings].reverse().map((booking) => (
                  <tr key={booking.id} className="hover:bg-white/[0.03] transition-colors duration-300 group">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-cyan-400 font-mono text-xs mb-1">ID: {booking.id.toString().padStart(4, '0')}</div>
                      <div className="text-sm text-slate-400">{booking.Timestamp?.split(',')[0]}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-semibold text-slate-200 text-base">{booking.Name}</div>
                      <div className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                        {booking.Email}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{booking.Phone}</div>
                    </td>
                    <td className="px-8 py-6 text-sm">
                      <div className="text-slate-300 font-medium">{booking.State}, {booking.District}</div>
                      <div className="text-slate-400 text-xs mt-0.5">PIN: {booking['Pin Code']}</div>
                      <div className="text-xs text-blue-400 mt-2 font-mono bg-blue-500/10 inline-block px-2.5 py-1 rounded-md border border-blue-500/20">{booking.Acres} Acres</div>
                      <div className="text-xs text-emerald-400 mt-1 font-medium bg-emerald-500/10 inline-block px-2.5 py-1 rounded-md border border-emerald-500/20 ml-2">{booking['Crop Type']}</div>
                      <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> For: {booking.Date}</div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm
                        ${booking.Status === 'Completed' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
                          booking.Status === 'Accept' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          booking.Status === 'Reject' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'} 
                          ${(!booking.Status || booking.Status === 'Pending') && 'shadow-[0_0_15px_rgba(251,191,36,0.2)]'}`}>
                        {booking.Status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {(!booking.Status || booking.Status === 'Pending') && <Clock className="w-3.5 h-3.5" />}
                        {booking.Status === 'Accept' && <Wind className="w-3.5 h-3.5" />}
                        {booking.Status || 'Pending'}
                      </span>
                      {booking.Remarks && (
                        <div className="mt-3 text-xs italic text-slate-400 border-l-2 border-slate-700 pl-3">
                           "{booking.Remarks}"
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right">
                      {/* Interactive Buttons trigger on row hover! */}
                      {(!booking.Status || booking.Status === 'Pending') ? (
                        <div className="flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                          <input 
                            type="text" 
                            placeholder="Add remarks..." 
                            value={pendingRemarks[booking.id] || ""}
                            onChange={(e) => handleRemarkChange(booking.id, e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-blue-500/50 w-full max-w-[150px] transition-all backdrop-blur-md"
                          />
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleUpdateStatus(booking.id, 'Accept')} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 rounded-xl transition-all shadow-sm font-semibold tracking-wide text-xs active:scale-95" title="Deploy Fleet">
                              <Wind className="w-4 h-4" /> ACCEPT
                            </button>
                            <button onClick={() => handleUpdateStatus(booking.id, 'Reject')} className="p-1.5 text-red-400 hover:bg-red-500 hover:text-white border border-transparent hover:border-red-500 rounded-xl transition-all active:scale-95" title="Abort Mission">
                              <XOctagon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : booking.Status === 'Accept' ? (
                        <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                           <button onClick={() => handleUpdateStatus(booking.id, 'Completed')} className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:bg-opacity-20 border border-indigo-500/20 hover:border-indigo-500/40 rounded-xl transition-all font-bold tracking-widest text-xs shadow-sm active:scale-95" title="Mark as Completed">
                            <CheckCircle2 className="w-4 h-4" /> RECALL FLEET (COMPLETE)
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600 font-medium tracking-wider uppercase">Mission Locked</span>
                      )}
                    </td>
                  </tr>
                ))}
                
                {(!bookings || bookings.length === 0) && !isLoading && (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center text-slate-500">
                      <Wind className="w-16 h-16 mx-auto mb-6 opacity-20" />
                      <p className="text-lg">Radar clear. No pending structural assessments.</p>
                      <button onClick={fetchBookings} className="mt-4 px-4 py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors">Manual Sweep</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
