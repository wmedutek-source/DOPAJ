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
        <div className="
