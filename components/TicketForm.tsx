
import React, { useState } from 'react';
import { User, Ticket, TicketStatus } from '../types';
import { GoogleGenAI } from "@google/genai";

interface TicketFormProps {
  engineers: User[];
  onSubmit: (ticket: Ticket) => void;
  onCancel: () => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ engineers, onSubmit, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [formData, setFormData] = useState({
    folio: '',
    serialNumber: '',
    model: '',
    clientName: '',
    responsiblePerson: '',
    phone: '',
    description: '',
    engineerId: ''
  });
  const [filePreview, setFilePreview] = useState<{ name: string; url: string; type: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const extractDataWithIA = async (base64Data: string, mimeType: string) => {
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analiza este documento (PDF o imagen) de un reporte de servicio técnico y extrae con extrema precisión los siguientes campos en formato JSON: 
      {
        "folio": "el REPORTE-FOLIO",
        "serialNumber": "el Número de Serie",
        "model": "el Modelo",
        "clientName": "el Cliente",
        "responsiblePerson": "el Responsable",
        "phone": "el Teléfono",
        "description": "la Descripción completa de la Falla Reportada"
      }. 
      REGLAS:
      1. Si un campo no es visible o está vacío, devuelve un string vacío.
      2. El folio suele estar precedido por 'REPORTE-FOLIO:'.
      3. Extrae solo el texto solicitado.
      4. Solo responde el objeto JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { inlineData: { data: base64Data.split(',')[1], mimeType } },
              { text: prompt }
            ]
          }
        ],
        config: { 
          responseMimeType: "application/json",
          temperature: 0.1 
        }
      });

      const text = response.text || '{}';
      const extracted = JSON.parse(text);
      
      setFormData(prev => ({
        ...prev,
        folio: extracted.folio || '',
        serialNumber: extracted.serialNumber || '',
        model: extracted.model || '',
        clientName: extracted.clientName || '',
        responsiblePerson: extracted.responsiblePerson || '',
        phone: extracted.phone || '',
        description: extracted.description || '',
      }));
      setHasData(true);
    } catch (error) {
      console.error("Error extrayendo datos con IA:", error);
      setErrors({ api: 'No se pudo procesar el documento automáticamente. Por favor complete los campos de forma manual.' });
      setHasData(true); 
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64 = event.target.result as string;
          setFilePreview({ name: file.name, url: base64, type: file.type });
          setErrors({});
          
          if (file.type.startsWith('image/') || file.type === 'application/pdf') {
            extractDataWithIA(base64, file.type);
          } else {
            setHasData(true);
            setIsProcessing(false);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.folio) newErrors.folio = 'Folio requerido';
    if (!formData.engineerId) newErrors.engineerId = 'Asigne un técnico';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const engineer = engineers.find(e => e.uid === formData.engineerId);
    
    const newTicket: Ticket = {
      id: Math.random().toString(36).substr(2, 9),
      folio: formData.folio,
      reportFolio: formData.folio,
      serialNumber: formData.serialNumber,
      model: formData.model,
      clientName: formData.clientName,
      responsiblePerson: formData.responsiblePerson,
      phone: formData.phone,
      description: formData.description,
      engineerId: formData.engineerId,
      engineerName: engineer?.name || '',
      assignedAt: new Date().toISOString(),
      status: TicketStatus.PENDING_ATTENTION,
      evidencePhotos: [],
      serviceSheetUrl: filePreview?.url,
      createdAt: new Date().toISOString(),
    };

    onSubmit(newTicket);
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl max-w-3xl mx-auto overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-slate-900 px-8 py-10 text-white border-b-8 border-emerald-500 relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <i className="fas fa-file-invoice text-7xl"></i>
        </div>
        <h3 className="text-3xl font-black tracking-tighter">Nueva Orden de Servicio</h3>
        <p className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mt-2">DOPAJ Pro | Extracción IA Vision</p>
      </div>
      
      <div className="p-8 space-y-8">
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-lg shadow-emerald-200">1</span>
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Cargar Reporte (PDF o Imagen)</h4>
          </div>

          {!filePreview ? (
            <div className={`relative border-4 border-dashed rounded-[2rem] p-12 transition-all group flex flex-col items-center justify-center text-center ${errors.pdf ? 'border-rose-200 bg-rose-50' : 'border-slate-100 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/30'}`}>
              <input type="file" accept="application/pdf,image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-transform text-slate-300 group-hover:text-emerald-500">
                <i className="fas fa-file-upload text-3xl"></i>
              </div>
              <p className="text-lg font-black text-slate-700 tracking-tight">Selecciona el reporte técnico</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Sube un PDF o foto para extracción automática con IA</p>
            </div>
          ) : (
            <div className="bg-emerald-600 p-6 rounded-[2rem] flex items-center justify-between text-white shadow-xl shadow-emerald-200 animate-in slide-in-from-top-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                  <i className={`fas ${filePreview.type.includes('pdf') ? 'fa-file-pdf' : 'fa-image'}`}></i>
                </div>
                <div className="overflow-hidden max-w-[200px]">
                  <p className="text-sm font-black leading-none truncate">{filePreview.name}</p>
                  <p className="text-[10px] font-bold opacity-60 mt-1 uppercase">Vínculo establecido</p>
                </div>
              </div>
              <button onClick={() => {setFilePreview(null); setHasData(false); setFormData({...formData, folio: ''})}} className="text-white/60 hover:text-white transition-colors">
                <i className="fas fa-times-circle text-xl"></i>
              </button>
            </div>
          )}
        </section>

        {(isProcessing || hasData) && (
          <section className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-lg shadow-emerald-200">2</span>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Datos del Servicio</h4>
            </div>

            {isProcessing ? (
              <div className="py-20 flex flex-col items-center justify-center bg-slate-50 rounded-[2rem] border-2 border-slate-100">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                  <i className="fas fa-eye absolute inset-0 flex items-center justify-center text-emerald-600/30 text-xl"></i>
                </div>
                <p className="mt-6 text-sm font-black text-emerald-800 uppercase tracking-widest animate-pulse">Escaneando con Gemini IA...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-200 relative">
                {filePreview && (
                  <div className="absolute -top-3 right-8 bg-emerald-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                    <i className="fas fa-robot mr-1"></i> Extraído Automáticamente
                  </div>
                )}
                
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-tighter">REPORTE-FOLIO</label>
                    <input name="folio" value={formData.folio} onChange={handleInputChange} className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-emerald-800 shadow-sm focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-tighter">NÚMERO DE SERIE</label>
                    <input name="serialNumber" value={formData.serialNumber} onChange={handleInputChange} className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-700 shadow-sm focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-tighter">MODELO</label>
                    <input name="model" value={formData.model} onChange={handleInputChange} className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-700 shadow-sm focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-tighter">CLIENTE / UBICACIÓN</label>
                  <input name="clientName" value={formData.clientName} onChange={handleInputChange} className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-tighter">RESPONSABLE</label>
                  <input name="responsiblePerson" value={formData.responsiblePerson} onChange={handleInputChange} className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 shadow-sm" />
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-tighter">FALLA REPORTADA (DESCRIPCIÓN)</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows={2} className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 shadow-sm resize-none" />
                </div>
              </div>
            )}
          </section>
        )}

        {hasData && !isProcessing && (
          <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-lg shadow-emerald-200">3</span>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Asignar Ingeniero Responsable</h4>
            </div>

            <div className={`p-6 rounded-[2rem] border-4 transition-all ${errors.engineerId ? 'border-rose-200 bg-rose-50' : 'border-slate-900 bg-slate-900 shadow-xl'}`}>
              <select 
                name="engineerId" 
                value={formData.engineerId} 
                onChange={handleInputChange} 
                className="w-full p-5 bg-slate-800 text-white border-2 border-slate-700 rounded-2xl outline-none font-black appearance-none"
              >
                <option value="">-- SELECCIONAR TÉCNICO --</option>
                {engineers.map(eng => <option key={eng.uid} value={eng.uid}>{eng.name}</option>)}
              </select>
              {errors.engineerId && <p className="text-rose-500 text-[10px] font-black uppercase mt-2 ml-1">Error: {errors.engineerId}</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button 
                onClick={handleSubmit}
                className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white font-black py-6 rounded-3xl text-xl shadow-2xl shadow-emerald-200 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                CREAR ORDEN DE TRABAJO <i className="fas fa-check-circle"></i>
              </button>
              <button 
                type="button" 
                onClick={onCancel} 
                className="flex-1 px-8 py-6 text-slate-400 font-black hover:bg-slate-50 rounded-2xl transition-all uppercase text-[10px] tracking-widest border border-slate-100"
              >
                Cerrar
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TicketForm;
