import React, { useState, useEffect } from 'react';
import { User, UserRole, Ticket, TicketStatus } from './types.ts';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import OfflineStatus from './components/OfflineStatus';

const INITIAL_USERS: User[] = [
  { uid: 'admin-1', email: 'admin@dopaj.com', name: 'Admin Principal', role: UserRole.ADMIN, password: '123' },
  { uid: 'e1', email: 'juan.perez@dopaj.com', name: 'Juan Pérez', role: UserRole.ENGINEER, password: '123' },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'dashboard' | 'tickets' | 'create' | 'execution' | 'users'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = INITIAL_USERS.find(u => u.email === loginEmail && u.password === loginPass);
    if (user) setCurrentUser(user);
  };

  if (!currentUser) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950 px-4">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-8">DOPAJ Pro</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" placeholder="admin@dopaj.com" className="w-full p-4 bg-slate-100 rounded-xl" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
          <input type="password" placeholder="123" className="w-full p-4 bg-slate-100 rounded-xl" value={loginPass} onChange={e => setLoginPass(e.target.value)} />
          <button type="submit" className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl">INGRESAR</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar role={currentUser.role} activeView={view} setView={setView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} onLogout={() => setCurrentUser(null)} tickets={[]} />
      <main className={`flex-1 p-8 transition-all ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black">Panel de Control</h2>
          <OfflineStatus />
        </header>
        {view === 'dashboard' && <Dashboard tickets={[]} />}
        {view !== 'dashboard' && <div className="p-10 bg-white rounded-2xl">Componente en pausa para pruebas...</div>}
      </main>
    </div>
  );
};

export default App;
