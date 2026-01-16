
import React from 'react';
import { Ticket, TicketStatus } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface DashboardProps {
  tickets: Ticket[];
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#34d399'];

const Dashboard: React.FC<DashboardProps> = ({ tickets }) => {
  const total = tickets.length;
  const closed = tickets.filter(t => t.status === TicketStatus.CLOSED).length;

  const statusData = Object.values(TicketStatus).map(status => ({
    name: status,
    value: tickets.filter(t => t.status === status).length
  }));

  const workloadData = [
    { name: 'Juan P.', tickets: 4 },
    { name: 'Maria G.', tickets: 7 },
    { name: 'Pedro S.', tickets: 2 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-emerald-600 p-6 rounded-3xl shadow-xl shadow-emerald-100 text-white">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Total DOPAJ</p>
          <p className="text-4xl font-black">{total}</p>
          <div className="mt-4 flex items-center text-[10px] font-black bg-white/20 w-fit px-2 py-1 rounded-lg">
            SOPORTE ACTIVO
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Efectividad</p>
          <p className="text-4xl font-black text-emerald-600">{total > 0 ? ((closed / total) * 100).toFixed(0) : 0}%</p>
          <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">{closed} servicios finalizados</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pendientes</p>
          <p className="text-4xl font-black text-amber-500">{tickets.filter(t => t.status !== TicketStatus.CLOSED).length}</p>
          <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">Atención en proceso</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-3xl shadow-xl text-white">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">SLA Promedio</p>
          <p className="text-4xl font-black text-emerald-400">3.8h</p>
          <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-tighter">Tiempo de respuesta</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-[350px] flex flex-col">
          <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-6">Estado de Servicios</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-[350px] flex flex-col">
          <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-6">Carga por Técnico</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                <YAxis hide />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="tickets" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
