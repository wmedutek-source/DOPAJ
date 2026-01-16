
import React from 'react';
import { Ticket, UserRole, TicketStatus } from '../types';
import { STATUS_COLORS, STATUS_ICONS } from '../constants';

interface TicketListProps {
  tickets: Ticket[];
  role: UserRole;
  userId: string;
  activeFilter: TicketStatus | 'All';
  onFilterChange: (f: TicketStatus | 'All') => void;
  onSelect: (id: string) => void;
}

const TicketList: React.FC<TicketListProps> = ({ 
  tickets, 
  role, 
  userId, 
  activeFilter, 
  onFilterChange, 
  onSelect 
}) => {
  
  const filteredTickets = tickets.filter(t => {
    const roleMatch = role === UserRole.ADMIN ? true : t.engineerId === userId;
    const statusMatch = activeFilter === 'All' ? true : t.status === activeFilter;
    return roleMatch && statusMatch;
  });

  return (
    <div className="space-y-6">
      {/* Visual Status Pills (Quick mobile touch) */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => onFilterChange('All')}
          className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border ${
            activeFilter === 'All' 
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-200' 
              : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-200'
          }`}
        >
          Todos ({tickets.length})
        </button>
        {Object.values(TicketStatus).map(s => {
          const count = tickets.filter(t => t.status === s).length;
          return (
            <button
              key={s}
              onClick={() => onFilterChange(s)}
              className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border ${
                activeFilter === s 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-200' 
                  : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-200'
              }`}
            >
              {s} ({count})
            </button>
          );
        })}
      </div>

      {/* Ticket Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {filteredTickets.map(ticket => (
          <div 
            key={ticket.id}
            onClick={() => onSelect(ticket.id)}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer group animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Folio del Servicio</p>
                <h4 className="text-xl font-black text-emerald-800 tracking-tighter group-hover:text-emerald-600 transition-colors">{ticket.folio}</h4>
              </div>
              <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 flex items-center gap-2 ${STATUS_COLORS[ticket.status]}`}>
                {STATUS_ICONS[ticket.status]}
                {ticket.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-emerald-50/50 transition-colors">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Técnico Asignado</p>
                <p className="text-xs font-bold text-slate-700 truncate">{ticket.engineerName}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-emerald-50/50 transition-colors">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Asignación</p>
                <p className="text-xs font-bold text-slate-700">{new Date(ticket.assignedAt).toLocaleDateString()}</p>
              </div>
              {ticket.attendedAt && (
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 lg:col-span-1 col-span-2">
                  <p className="text-[9px] font-black text-emerald-600 uppercase mb-1">Fecha de Cierre</p>
                  <p className="text-xs font-black text-emerald-900">{new Date(ticket.attendedAt).toLocaleString()}</p>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                  {ticket.engineerName.charAt(0)}
                </div>
                <div className="w-8 h-8 rounded-xl bg-slate-800 border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                  <i className="fas fa-print text-[8px]"></i>
                </div>
              </div>
              <button className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                Abrir Orden <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        ))}
        
        {filteredTickets.length === 0 && (
          <div className="py-24 text-center bg-white rounded-3xl border-4 border-dashed border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-search text-3xl text-slate-200"></i>
            </div>
            <p className="text-slate-400 font-black italic tracking-tight text-lg">No hay tickets en este estatus</p>
            <button 
              onClick={() => onFilterChange('All')}
              className="mt-4 text-emerald-600 font-black text-xs uppercase tracking-widest hover:underline"
            >
              Ver todos los servicios
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketList;
