
import React from 'react';
import { UserRole, TicketStatus, Ticket } from '../types';

interface SidebarProps {
  role: UserRole;
  activeView: string;
  setView: (v: any) => void;
  activeFilter: TicketStatus | 'All';
  setFilter: (f: TicketStatus | 'All') => void;
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
  onLogout: () => void;
  tickets: Ticket[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
  role, 
  activeView, 
  setView, 
  activeFilter, 
  setFilter, 
  isOpen, 
  setIsOpen, 
  onLogout,
  tickets
}) => {
  const getCount = (status: TicketStatus | 'All') => {
    if (status === 'All') return tickets.length;
    return tickets.filter(t => t.status === status).length;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-10 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      
      <aside className={`fixed inset-y-0 left-0 bg-slate-950 text-white transition-all duration-300 z-20 shadow-2xl ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 w-20'}`}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/50">
              <i className="fas fa-print text-white text-xl"></i>
            </div>
            {isOpen && <span className="font-black text-2xl tracking-tighter italic">DOPAJ</span>}
          </div>

          <nav className="flex-1 mt-6 space-y-1 px-3 overflow-y-auto no-scrollbar">
            {/* Dashboard Link (Admin Only) */}
            {role === UserRole.ADMIN && (
              <button
                onClick={() => {
                  setView('dashboard');
                  if(window.innerWidth < 768) setIsOpen(false);
                }}
                className={`w-full flex items-center px-4 py-4 rounded-xl transition-all group mb-1 ${activeView === 'dashboard' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-900'}`}
              >
                <i className="fas fa-chart-pie text-lg w-8"></i>
                {isOpen && <span className="ml-2 font-bold tracking-tight">Dashboard</span>}
              </button>
            )}

            {/* Main Services Item */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  setView('tickets');
                  setFilter('All');
                  if(window.innerWidth < 768 && !isOpen) setIsOpen(false);
                }}
                className={`w-full flex items-center px-4 py-4 rounded-xl transition-all group ${activeView === 'tickets' && activeFilter === 'All' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-900'}`}
              >
                <i className="fas fa-ticket-alt text-lg w-8"></i>
                {isOpen && (
                  <div className="flex-1 flex justify-between items-center ml-2">
                    <span className="font-bold tracking-tight">Servicios</span>
                    <span className="bg-slate-800 text-[10px] px-2 py-0.5 rounded-full font-black">{getCount('All')}</span>
                  </div>
                )}
              </button>

              {/* Status Sub-buttons */}
              {isOpen && (
                <div className="ml-8 space-y-1 mt-1 animate-in fade-in slide-in-from-left-2">
                  {Object.values(TicketStatus).map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setView('tickets');
                        setFilter(status);
                        if(window.innerWidth < 768) setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${activeView === 'tickets' && activeFilter === status ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-600 hover:text-slate-300'}`}
                    >
                      <span>{status.split(' ')[1] || status}</span>
                      <span className={`w-5 h-5 flex items-center justify-center rounded-md ${activeView === 'tickets' && activeFilter === status ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-700'}`}>
                        {getCount(status)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Create Button (Admin Only) */}
            {role === UserRole.ADMIN && (
              <button
                onClick={() => {
                  setView('create');
                  if(window.innerWidth < 768) setIsOpen(false);
                }}
                className={`w-full flex items-center px-4 py-4 rounded-xl transition-all group mt-1 ${activeView === 'create' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-900'}`}
              >
                <i className="fas fa-plus-circle text-lg w-8"></i>
                {isOpen && <span className="ml-2 font-bold tracking-tight">Nueva Orden</span>}
              </button>
            )}

            {/* User Management (Admin Only) */}
            {role === UserRole.ADMIN && (
              <button
                onClick={() => {
                  setView('users');
                  if(window.innerWidth < 768) setIsOpen(false);
                }}
                className={`w-full flex items-center px-4 py-4 rounded-xl transition-all group mt-1 ${activeView === 'users' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-900'}`}
              >
                <i className="fas fa-users-cog text-lg w-8"></i>
                {isOpen && <span className="ml-2 font-bold tracking-tight">Usuarios</span>}
              </button>
            )}
          </nav>

          <div className="p-4 border-t border-slate-900 space-y-2">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="hidden md:flex w-full items-center px-4 py-3 text-slate-600 hover:text-emerald-400 transition-colors"
            >
              <i className={`fas ${isOpen ? 'fa-angle-left' : 'fa-angle-right'} w-8 text-center`}></i>
              {isOpen && <span className="ml-2 text-xs font-black uppercase tracking-widest">Colapsar</span>}
            </button>
            <button 
              onClick={onLogout}
              className="w-full flex items-center px-4 py-4 text-rose-400 hover:bg-rose-900/20 rounded-xl transition-all group"
            >
              <i className="fas fa-power-off w-8 text-center group-hover:scale-110"></i>
              {isOpen && <span className="ml-2 font-black text-sm uppercase tracking-widest text-left">Cerrar Sesión</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
