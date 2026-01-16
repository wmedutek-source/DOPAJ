import React, { useState } from 'react';
import { User, UserRole, TicketStatus } from './types';

const App: React.FC = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950 px-4 text-white">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-slate-900">
        <h1 className="text-4xl font-black text-center mb-6">DOPAJ Pro</h1>
        <p className="text-center mb-8 text-slate-500">PRUEBA DE CARGA - MODO SEGURO</p>
        
        <input 
          type="text" 
          placeholder="Usuario"
          className="w-full p-4 mb-4 bg-slate-100 rounded-xl border-2 border-slate-200"
          value={loginEmail}
          onChange={e => setLoginEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Contraseña"
          className="w-full p-4 mb-6 bg-slate-100 rounded-xl border-2 border-slate-200"
          value={loginPass}
          onChange={e => setLoginPass(e.target.value)}
        />
        
        <button className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl">
          PROBAR ACCESO
        </button>
      </div>
    </div>
  );
};

export default App;
