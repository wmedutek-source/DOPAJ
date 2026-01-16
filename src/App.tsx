
import React, { useState, useEffect } from 'react';
import { User, UserRole, Ticket, TicketStatus } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TicketList from './components/TicketList';
import TicketForm from './components/TicketForm';
import TicketExecution from './components/TicketExecution';
import UserManagement from './components/UserManagement';
import OfflineStatus from './components/OfflineStatus';

const INITIAL_USERS: User[] = [
  { uid: 'admin-1', email: 'admin@dopaj.com', name: 'Admin Principal', role: UserRole.ADMIN, password: '123' },
  { uid: 'e1', email: 'juan.perez@dopaj.com', name: 'Juan Pérez', role: UserRole.ENGINEER, password: '123' },
  { uid: 'e2', email: 'maria.gomez@dopaj.com', name: 'María Gómez', role: UserRole.ENGINEER, password: '123' },
];

const INITIAL_TICKETS: Ticket[] = [
  {
    id: 't1',
    folio: 'FL040283',
    reportFolio: 'FL040283',
    serialNumber: '33005460',
    model: 'MXB376WH',
    clientName: 'CFE2024 - Servicios de Atención a Clientes',
    responsiblePerson: 'Cruz Gabriela Naranjo Román',
    phone: '3143310017',
    description: 'Falla en tarjeta de red. 3143310017 / Ext. 21217',
    engineerId: 'e1',
    engineerName: 'Juan Pérez',
    assignedAt: new Date(Date.now() - 86400000).toISOString(),
    status: TicketStatus.PENDING_ATTENTION,
    evidencePhotos: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    serviceSheetUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'dashboard' | 'tickets' | 'create' | 'execution' | 'users'>('dashboard');
  const [ticketFilter, setTicketFilter] = useState<TicketStatus | 'All'>('All');
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(INITIAL_USERS);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (currentUser?.role === UserRole.ENGINEER) setView('tickets');
    else if (currentUser?.role === UserRole.ADMIN) setView('dashboard');
  }, [currentUser]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = registeredUsers.find(u => u.email === loginEmail && u.password === loginPass);
    if (user) {
      setCurrentUser(user);
      setLoginError('');
    } else {
      setLoginError('Usuario o contraseña incorrectos');
    }
  };

  const handleCreateTicket = (newTicket: Ticket) => {
    setTickets([newTicket, ...tickets]);
    setView('tickets');
    setTicketFilter('All');
  };

  const handleUpdateTicket = (updatedTicket: Ticket) => {
    setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    setView('tickets');
  };

  const handleAddUser = (user: User) => {
    setRegisteredUsers([...registeredUsers, user]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setRegisteredUsers(registeredUsers.map(u => u.uid === updatedUser.uid ? updatedUser : u));
    // If the updated user is the current user, update the state
    if (currentUser?.uid === updatedUser.uid) {
      setCurrentUser(updatedUser);
    }
  };

  const handleDeleteUser = (uid: string) => {
    setRegisteredUsers(registeredUsers.filter(u => u.uid !== uid));
  };

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  if (!currentUser) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950 px-4">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-8 text-center">
          <div className="inline-flex p-5 bg-emerald-50 rounded-[2rem] mb-6 shadow-inner">
            <i className="fas fa-print text-6xl text-emerald-600"></i>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">DOPAJ Pro</h1>
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] mt-2">Enterprise Support System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre de Usuario</label>
            <div className="relative">
              <i className="fas fa-user absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
              <input 
                type="text"
                required
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold text-slate-700 transition-all"
                placeholder="jperez.dopaj"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
            <div className="relative">
              <i className="fas fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
              <input 
                type="password"
                required
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold text-slate-700 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {loginError && (
            <p className="text-rose-500 text-[10px] font-black uppercase text-center bg-rose-50 py-2 rounded-xl border border-rose-100 animate-bounce">
              <i className="fas fa-exclamation-circle mr-1"></i> {loginError}
            </p>
          )}
          
          <button 
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-emerald-100 active:scale-95 text-lg"
          >
            INGRESAR AL SISTEMA
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">Acceso Seguro para Personal Autorizado</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        role={currentUser.role} 
        activeView={view} 
        setView={setView} 
        activeFilter={ticketFilter}
        setFilter={setTicketFilter}
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        onLogout={() => {
          setCurrentUser(null);
          setLoginPass('');
        }}
        tickets={tickets}
      />

      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0 md:ml-20'}`}>
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sticky top-0 z-10 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-slate-500 text-xl p-2">
              <i className="fas fa-bars"></i>
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-800 leading-tight">
                {view === 'dashboard' && 'Panel Gerencial'}
                {view === 'tickets' && (ticketFilter === 'All' ? 'Todos los Servicios' : `Servicios: ${ticketFilter}`)}
                {view === 'create' && 'Nueva Orden'}
                {view === 'execution' && `${selectedTicket?.folio}`}
                {view === 'users' && 'Directorio Corporativo'}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <OfflineStatus />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-700 leading-none">{currentUser.name}</p>
              <p className="text-[9px] font-black uppercase tracking-widest mt-1 text-emerald-600">
                {currentUser.role}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shadow-lg ${currentUser.role === UserRole.ADMIN ? 'bg-slate-900' : 'bg-emerald-600'}`}>
              {currentUser.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
          {view === 'dashboard' && <Dashboard tickets={tickets} />}
          {view === 'tickets' && (
            <TicketList 
              tickets={tickets} 
              role={currentUser.role} 
              userId={currentUser.uid}
              activeFilter={ticketFilter}
              onFilterChange={setTicketFilter}
              onSelect={(id) => {
                setSelectedTicketId(id);
                setView('execution');
              }}
            />
          )}
          {view === 'create' && (
            <TicketForm 
              engineers={registeredUsers.filter(u => u.role === UserRole.ENGINEER)} 
              onSubmit={handleCreateTicket} 
              onCancel={() => setView('tickets')} 
            />
          )}
          {view === 'execution' && selectedTicket && (
            <TicketExecution 
              ticket={selectedTicket} 
              onSave={handleUpdateTicket} 
              onCancel={() => setView('tickets')} 
            />
          )}
          {view === 'users' && (
            <UserManagement 
              users={registeredUsers}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
