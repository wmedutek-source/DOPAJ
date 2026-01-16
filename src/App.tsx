import React, { useState, useEffect } from 'react';
import { User, UserRole, Ticket, TicketStatus } from './types.ts';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TicketList from './components/TicketList';
import TicketForm from './components/TicketForm';
import UserManagement from './components/UserManagement';
import OfflineStatus from './components/OfflineStatus';

// Nota: TicketExecution sigue en mantenimiento hasta el siguiente paso
const INITIAL_USERS: User[] = [
  { uid: 'admin-1', email: 'admin@dopaj.com', name: 'Admin Principal', role: UserRole.ADMIN, password: '123' },
  { uid: 'e1', email: 'juan.perez@dopaj.com', name: 'Juan Pérez', role: UserRole.ENGINEER, password: '123' },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'dashboard' | 'tickets' | 'create' | 'execution' | 'users'>('dashboard');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(INITIAL_USERS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = registeredUsers.find(u => u.email === loginEmail && u.password === loginPass);
    if (user) setCurrentUser(user);
  };

  if (!currentUser) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950 px-4">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tighter">DOPAJ Pro</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" placeholder="Usuario" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
          <input type="password" placeholder="Contraseña" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700" value={loginPass} onChange={e => setLoginPass(e.target.value)} />
          <button type="submit" className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl shadow-lg hover:bg-emerald-500 transition-all">INGRESAR</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        role={currentUser.role} 
        activeView={view} 
        setView={setView} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        onLogout={() => setCurrentUser(null)} 
        tickets={tickets}
        activeFilter="All"
        setFilter={() => {}}
      />

      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'ml-0 md:ml-64' : 'ml-0 md:ml-20'}`}>
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-500 text-xl p-2 md:hidden">
              <i className="fas fa-bars"></i>
            </button>
            <h2 className="text-xl font-black text-slate-800">
              {view === 'dashboard' && 'Panel Gerencial'}
              {view === 'tickets' && 'Servicios'}
              {view === 'create' && 'Nueva Orden'}
              {view === 'users' && 'Directorio de Personal'}
            </h2>
          </div>
          <OfflineStatus />
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {view === 'dashboard' && <Dashboard tickets={tickets} />}
          {view === 'tickets' && <TicketList tickets={tickets} role={currentUser.role} userId={currentUser.uid} onSelect={() => {}} activeFilter="All" onFilterChange={() => {}} />}
          {view === 'create' && <TicketForm engineers={registeredUsers.filter(u => u.role === UserRole.ENGINEER)} onSubmit={(t) => { setTickets([t, ...tickets]); setView('tickets'); }} onCancel={() => setView('tickets')} />}
          
          {view === 'users' && (
            <UserManagement 
              users={registeredUsers} 
              onAddUser={(u) => setRegisteredUsers([...registeredUsers, u])} 
              onUpdateUser={(u) => setRegisteredUsers(registeredUsers.map(old => old.uid === u.uid ? u : old))} 
              onDeleteUser={(id) => setRegisteredUsers(registeredUsers.filter(u => u.uid !== id))} 
            />
          )}

          {view === 'execution' && (
             <div className="p-20 text-center bg-white rounded-[3rem] shadow-xl border-2 border-dashed border-slate-200">
                <i className="fas fa-robot text-5xl text-emerald-300 mb-4"></i>
                <h3 className="text-xl font-bold text-slate-800">Módulo de IA en Revisión</h3>
                <p className="text-slate-500">Estamos optimizando el motor de Gemini.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
