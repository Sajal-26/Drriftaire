import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Users, Droplets, Clock, IndianRupee, TrendingUp, XOctagon, CheckCircle2 } from 'lucide-react';

const BookingRow = memo(({ 
  booking, 
  formatDateTime, 
  formatDateOnly, 
  pendingRemarks, 
  handleRemarkChange, 
  handleUpdateStatus, 
  pendingFinancials, 
  handleFinancialChange 
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col lg:flex-row items-stretch lg:items-center gap-4 lg:gap-6 overflow-hidden rounded-[2rem] border border-green-900/10 bg-white/70 p-5 lg:p-4 backdrop-blur-3xl transition-all duration-300 hover:border-green-900/20 hover:shadow-[0_15px_40px_-10px_rgba(22,60,47,0.12)] hover:bg-white/90"
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
        <div className="flex h-10 w-10 lg:h-12 lg:w-12 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-700 transition-colors group-hover:bg-[#1b4a36] group-hover:text-white">
          <Users className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm lg:text-base font-bold tracking-tight text-[#1b4a36]">{booking.Name}</h3>
          <p className="truncate text-[10px] lg:text-[11px] text-[#60796d]">{booking.Email}</p>
          <a href={`tel:${booking.Phone}`} className="mt-0.5 lg:mt-1 block text-[10px] font-semibold text-[#76877d] hover:text-green-700">
            {booking.Phone}
          </a>
        </div>
      </div>

      {/* Mission Details */}
      <div className="lg:w-[25%] flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[#355f48]">
          <Droplets className="h-3.5 w-3.5 lg:h-4 lg:w-4 opacity-50 shrink-0" />
          <span className="text-[11px] lg:text-xs font-bold truncate">{booking.District}, {booking.State}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
          <div className="flex items-center gap-1.5 rounded-lg bg-green-50/50 px-2.5 py-1 text-[9px] lg:text-[10px] font-bold text-green-700 border border-green-900/5">
            {booking.Acres} AC
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-[#f6f4ee] px-2.5 py-1 text-[9px] lg:text-[10px] font-bold text-[#60796d] border border-green-900/5 uppercase">
            {booking['Crop Type']}
          </div>
          <div className="flex items-center gap-1.5 text-[9px] lg:text-[10px] text-[#8aa095] font-medium">
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
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Brief remarks..."
              value={pendingRemarks[booking.id] || ''}
              onChange={(event) => handleRemarkChange(booking.id, event.target.value)}
              className="w-full rounded-xl border border-green-900/10 bg-white/80 px-3 py-2 text-[10px] lg:text-[11px] transition-all focus:ring-4 focus:ring-green-700/5 outline-none"
            />
            <div className="flex gap-2">
              <button 
                onClick={() => handleUpdateStatus(booking.id, 'Accept')}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#2f6a47] py-2 lg:py-2.5 text-[9px] lg:text-[10px] font-bold tracking-widest text-white shadow-lg shadow-green-900/10 hover:bg-[#1b4a36] transition-all active:scale-95"
              >
                ACCEPT
              </button>
              <button 
                onClick={() => handleUpdateStatus(booking.id, 'Reject')}
                className="px-3 rounded-xl border border-red-50 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95"
              >
                <XOctagon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : booking.Status === 'Accept' ? (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Sales"
                value={pendingFinancials[booking.id]?.sales || ''}
                onChange={(e) => handleFinancialChange(booking.id, 'sales', e.target.value)}
                className="flex-1 min-w-0 rounded-xl border border-green-900/10 bg-white px-2.5 py-2 text-[10px] lg:text-[11px] focus:ring-4 focus:ring-indigo-700/5 outline-none"
              />
              <input
                type="number"
                placeholder="Profit"
                value={pendingFinancials[booking.id]?.profit || ''}
                onChange={(e) => handleFinancialChange(booking.id, 'profit', e.target.value)}
                className="flex-1 min-w-0 rounded-xl border border-green-900/10 bg-white px-2.5 py-2 text-[10px] lg:text-[11px] focus:ring-4 focus:ring-indigo-700/5 outline-none"
              />
            </div>
            <button 
              onClick={() => handleUpdateStatus(booking.id, 'Completed')}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2 lg:py-2.5 text-[9px] lg:text-[10px] font-bold tracking-widest text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95"
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
  );
});

export default BookingRow;
