import React, { useState } from 'react';
import { User, UserRole } from './types.ts'; // Aseguramos el .ts
import OfflineStatus from './components/OfflineStatus';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === 'admin@dopaj.com' && loginPass === '123') {
       alert('Login exitoso');
    }
  };

  if (!currentUser) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 px-4">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-center">
        <div className="inline-flex p-5 bg-emerald-50 rounded-[2rem] mb-6">
          <i className="fas fa-print text-6xl text-emerald-600"></i>
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-8">DOPAJ Pro</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="text" 
            placeholder="Usuario"
            className="w-full p-4 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            value={loginEmail}
            onChange={e => setLoginEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Contraseña"
            className="w-full p-4 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            value={loginPass}
            onChange={e => setLoginPass(e.target.value)}
          />
          <button type="submit" className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl shadow-lg">
            INGRESAR
          </button>
        </form>
        <div className="mt-6">
          <OfflineStatus />
        </div>
      </div>
    </div>
  );

  return <div className="p-20">Bienvenido, ya pasaste el login.</div>;
};

export default App;
