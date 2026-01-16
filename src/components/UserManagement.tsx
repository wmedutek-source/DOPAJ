import React, { useState } from 'react';
import { User, UserRole } from '../types.ts';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (uid: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onAddUser, onUpdateUser, onDeleteUser }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.ENGINEER
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: UserRole.ENGINEER });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({ 
      name: user.name, 
      email: user.email, 
      password: user.password || '', 
      role: user.role 
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return;

    if (editingUser) {
      onUpdateUser({
        ...editingUser,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
    } else {
      const newUser: User = {
        uid: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };
      onAddUser(newUser);
    }
    
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const engineers = users.filter(u => u.role === UserRole.ENGINEER);
  const admins = users.filter(u => u.role === UserRole.ADMIN);

  const UserCard = ({ user, colorClass }: { user: User, colorClass: string }) => (
    <div key={user.uid} className={`bg-white p-6 rounded-[2rem] border-2 transition-all group relative overflow-hidden ${colorClass === 'green' ? 'border-emerald-100 hover:border-emerald-300 shadow-emerald-50' : 'border-slate-200 hover:border-slate-800 shadow-slate-50'}`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg ${colorClass === 'green' ? 'bg-emerald-600' : 'bg-slate-900'}`}>
          {user.name.charAt(0)}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => handleOpenEdit(user)}
            className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center"
          >
            <i className="fas fa-edit text-xs"></i>
          </button>
          {user.email !== 'admin@dopaj.com' && (
            <button 
              onClick={() => onDeleteUser(user.uid)}
              className="w-8 h-8 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
            >
              <i className="fas fa-trash-alt text-xs"></i>
            </button>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h5 className="font-black text-slate-800 tracking-tight truncate">{user.name}</h5>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.email}</p>
        </div>
        <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${colorClass === 'green' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
            {user.role}
          </span>
          <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-300">
            <i className="fas fa-key"></i> {user.password ? 'PASS SET' : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-32">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tighter">Directorio de Personal</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Gestión corporativa de accesos</p>
        </div>
        {!isFormOpen && (
          <button 
            onClick={handleOpenAdd}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 transition-all flex items-center gap-3"
          >
            <i className="fas fa-user-plus"></i> Dar de Alta
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
              <h4 className="font-black text-2xl tracking-tighter">{editingUser ? 'Actualizar Perfil' : 'Nuevo Registro'}</h4>
            </div>
            <button onClick={() => setIsFormOpen(false)} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-rose-500 transition-all">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <input 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-800 border-2 border-slate-700 p-4 rounded-2xl text-sm font-bold outline-none focus:border-emerald-500" 
              placeholder="Nombre Completo"
            />
            <input 
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-slate-800 border-2 border-slate-700 p-4 rounded-2xl text-sm font-bold outline-none focus:border-emerald-500" 
              placeholder="Usuario (Login)"
            />
            <input 
              required
              type="text"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full bg-slate-800 border-2 border-slate-700 p-4 rounded-2xl text-sm font-bold outline-none focus:border-emerald-500" 
              placeholder="Contraseña"
            />
            <select 
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
              className="w-full bg-slate-800 border-2 border-slate-700 p-4 rounded-2xl text-sm font-bold outline-none focus:border-emerald-500 appearance-none"
            >
              <option value={UserRole.ENGINEER}>INGENIERO</option>
              <option value={UserRole.ADMIN}>ADMINISTRADOR</option>
            </select>
            <button type="submit" className="md:col-span-2 bg-emerald-500 text-slate-900 font-black py-5 rounded-2xl text-lg uppercase shadow-xl shadow-emerald-900/40">
              {editingUser ? 'Guardar Cambios' : 'Confirmar Alta'}
            </button>
          </form>
        </div>
      )}

      <section className="space-y-6">
        <h4 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em]">Ingenieros ({engineers.length})</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {engineers.map(user => <UserCard key={user.uid} user={user} colorClass="green" />)}
        </div>
      </section>

      <section className="space-y-6 pt-12 border-t border-slate-200">
        <h4 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em]">Administradores ({admins.length})</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {admins.map(user => <UserCard key={user.uid} user={user} colorClass="black" />)}
        </div>
      </section>
    </div>
  );
};

export default UserManagement;
