
import React, { useState, useEffect } from 'react';
import { Ticket, TicketStatus, GeoLocation } from '../types';
import { suggestOptimizedSolution } from '../services/geminiService';

interface TicketExecutionProps {
  ticket: Ticket;
  onSave: (updated: Ticket) => void;
  onCancel: () => void;
}

const TicketExecution: React.FC<TicketExecutionProps> = ({ ticket, onSave, onCancel }) => {
  const isClosed = ticket.status === TicketStatus.CLOSED;
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [failure, setFailure] = useState(ticket.failureLocated || '');
  const [solution, setSolution] = useState(ticket.solutionApplied || '');
  const [observations, setObservations] = useState(ticket.observations || '');
  const [photos, setPhotos] = useState<string[]>(ticket.evidencePhotos || []);
  const [reportEvidence, setReportEvidence] = useState<string>(ticket.reportEvidencePhoto || '');
  const [isSaving, setIsSaving] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isClosed) return;
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setPhotos([...photos, event.target.result as string]);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleReportEvidenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isClosed) return;
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setReportEvidence(event.target.result as string);
          setValidationError(null);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getAiHelp = async () => {
    if (isClosed || !failure) return;
    setAiLoading(true);
    const suggestions = await suggestOptimizedSolution(failure);
    setAiSuggestions(suggestions);
    setAiLoading(false);
  };

  const handleFinalize = async () => {
    if (isClosed) return;
    
    // VALIDACIÓN OBLIGATORIA: Evidencia del reporte
    if (!reportEvidence) {
      setValidationError("DEBE SUBIR LA FOTO DE LA EVIDENCIA DEL REPORTE PARA CERRAR EL FOLIO");
      const element = document.getElementById('report-evidence-section');
      element?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setIsSaving(true);
    let location: GeoLocation | undefined;
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) => 
        navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true, timeout: 5000 })
      );
      location = { latitude: pos.coords.latitude, longitude: pos.coords.longitude, timestamp: pos.timestamp };
    } catch (e) { console.warn(e); }

    const updatedTicket: Ticket = {
      ...ticket,
      status: TicketStatus.CLOSED, 
      failureLocated: failure,
      solutionApplied: solution,
      observations,
      evidencePhotos: photos,
      reportEvidencePhoto: reportEvidence, 
      attendedAt: new Date().toISOString(), 
      locationAtClosure: location
    };

    onSave(updatedTicket);
    setIsSaving(false);
  };

  const handleDownloadPdf = () => {
    if (ticket.serviceSheetUrl) {
      const link = document.createElement('a');
      link.href = ticket.serviceSheetUrl;
      link.download = `Reporte_${ticket.folio}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDownloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-32">
      {/* PDF Viewer Modal */}
      {showPdfViewer && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex flex-col p-4 sm:p-8 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-4 bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-2xl">
            <div className="flex items-center gap-3">
              <i className="fas fa-file-pdf text-rose-500 text-2xl"></i>
              <div>
                <p className="text-white font-black text-sm uppercase tracking-tighter">Visor de Documento</p>
                <p className="text-emerald-400 text-[10px] font-bold uppercase">{ticket.folio}</p>
              </div>
            </div>
            <div className="flex gap-2">
               <button onClick={handleDownloadPdf} className="w-10 h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-xl flex items-center justify-center transition-all">
                <i className="fas fa-download"></i>
              </button>
              <button onClick={() => setShowPdfViewer(false)} className="w-10 h-10 bg-rose-600 hover:bg-rose-500 text-white rounded-xl flex items-center justify-center transition-all">
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
          <div className="flex-1 bg-white rounded-3xl overflow-hidden shadow-2xl relative">
            <iframe 
              src={`${ticket.serviceSheetUrl}#toolbar=0`} 
              className="w-full h-full border-none"
              title="Visor de Reporte"
            />
          </div>
        </div>
      )}

      <div className="lg:col-span-2 space-y-6">
        
        {/* Folio Header */}
        <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl border-b-4 border-emerald-500 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
            <div className="text-center sm:text-left">
              <p className="text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em]">Orden de Servicio</p>
              <h3 className="text-3xl font-black tracking-tighter">{ticket.folio}</h3>
              <div className="flex flex-col gap-1 mt-2">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <i className="fas fa-calendar-alt text-emerald-500"></i> Asignado: {new Date(ticket.assignedAt).toLocaleString()}
                </p>
                {ticket.attendedAt && (
                  <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <i className="fas fa-check-double text-emerald-400"></i> CERRADO: {new Date(ticket.attendedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button 
                onClick={() => setShowPdfViewer(true)} 
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
              >
                <i className="fas fa-eye"></i> Ver PDF
              </button>
              <button 
                onClick={handleDownloadPdf} 
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black border border-slate-700 transition-all active:scale-95"
              >
                <i className="fas fa-download text-emerald-400"></i> Reporte PDF
              </button>
            </div>
          </div>
        </div>

        {/* Ficha Tecnica */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
          <h4 className="font-black text-slate-800 uppercase text-[10px] tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-4 bg-emerald-600 rounded-full"></span>
            Datos Técnicos del Equipo
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Modelo</p>
              <p className="text-sm font-black text-slate-800">{ticket.model}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Serie</p>
              <p className="text-sm font-black text-slate-800">{ticket.serialNumber}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Folio Reporte</p>
              <p className="text-sm font-black text-slate-800">{ticket.reportFolio}</p>
            </div>
          </div>
          <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
            <h5 className="text-[9px] font-black text-emerald-700 uppercase mb-2 tracking-widest">Falla Reportada</h5>
            <p className="text-xs font-bold text-emerald-900 leading-relaxed italic">"{ticket.description}"</p>
          </div>
        </div>

        {/* Ejecucion Tecnica */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-black text-slate-800 uppercase text-[10px] tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-600 rounded-full"></span>
              Reporte de Ejecución {isClosed && <span className="ml-2 bg-slate-100 text-slate-400 px-2 py-0.5 rounded text-[8px] tracking-normal">(Sólo Lectura)</span>}
            </h4>
            <select 
              disabled={isClosed}
              value={status} 
              onChange={(e) => setStatus(e.target.value as TicketStatus)} 
              className={`p-2 border-2 rounded-xl text-[10px] font-black outline-none transition-all ${isClosed ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
            >
              {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black text-slate-500 uppercase">Falla Localizada</label>
                {!isClosed && (
                  <button onClick={getAiHelp} disabled={!failure || aiLoading} className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-[9px] font-black flex items-center gap-1.5">
                    <i className={`fas ${aiLoading ? 'fa-spinner fa-spin' : 'fa-brain'}`}></i> IA Help
                  </button>
                )}
              </div>
              <textarea 
                disabled={isClosed}
                value={failure} 
                onChange={(e) => setFailure(e.target.value)} 
                rows={3} 
                className={`w-full p-4 border rounded-2xl text-xs font-bold outline-none transition-all ${isClosed ? 'bg-slate-50 border-slate-100 text-slate-500' : 'bg-slate-50 border-slate-200 focus:border-emerald-500'}`} 
                placeholder="Diagnóstico final..." 
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-2">Solución Aplicada</label>
              <textarea 
                disabled={isClosed}
                value={solution} 
                onChange={(e) => setSolution(e.target.value)} 
                rows={3} 
                className={`w-full p-4 border rounded-2xl text-xs font-bold outline-none transition-all ${isClosed ? 'bg-slate-50 border-slate-100 text-slate-500' : 'bg-slate-50 border-slate-200 focus:border-emerald-500'}`} 
                placeholder="Pasos de solución..." 
              />
            </div>
          </div>
        </div>

        {/* Fotos de Evidencia del Trabajo */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-black text-slate-800 uppercase text-[10px] tracking-widest">Fotos de Trabajo Realizado</h4>
            {!isClosed && (
              <label className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black cursor-pointer shadow-lg">
                <i className="fas fa-camera mr-1"></i> Añadir Foto
                <input type="file" className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
              </label>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {photos.map((src, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-md group">
                <img src={src} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    onClick={() => handleDownloadImage(src, `evidencia_${ticket.folio}_${idx+1}.png`)}
                    className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center hover:bg-emerald-500"
                    title="Descargar Foto"
                  >
                    <i className="fas fa-download text-xs"></i>
                  </button>
                  {!isClosed && (
                    <button 
                      onClick={() => setPhotos(photos.filter((_, i) => i !== idx))} 
                      className="w-8 h-8 bg-rose-500 text-white rounded-lg flex items-center justify-center hover:bg-rose-400"
                      title="Eliminar Foto"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {photos.length === 0 && <div className="col-span-full py-10 text-center text-slate-300 border-2 border-dashed border-slate-50 rounded-2xl"><i className="fas fa-images text-3xl opacity-20"></i><p className="text-[10px] font-bold mt-2">Sin fotos</p></div>}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* EVIDENCIA REPORTE (Obligatoria) */}
        <div id="report-evidence-section" className={`bg-white p-6 rounded-[2rem] border-4 transition-all ${validationError ? 'border-rose-500 animate-bounce' : 'border-slate-200'} shadow-sm`}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-black text-slate-800 uppercase text-[10px] tracking-widest">Evidencia Reporte (Físico)</h4>
            <div className="flex gap-2">
              {reportEvidence && (
                <button 
                  onClick={() => handleDownloadImage(reportEvidence, `reporte_firmado_${ticket.folio}.png`)}
                  className="bg-emerald-50 text-emerald-600 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-emerald-100 transition-colors"
                  title="Descargar Reporte"
                >
                  <i className="fas fa-download text-xs"></i>
                </button>
              )}
              {!isClosed && (
                <label className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[9px] font-black cursor-pointer">
                  <i className="fas fa-camera mr-1"></i> Capturar
                  <input type="file" className="hidden" accept="image/*" capture="environment" onChange={handleReportEvidenceChange} />
                </label>
              )}
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-2xl border-2 border-slate-100 aspect-[4/3] flex items-center justify-center overflow-hidden relative group">
            {reportEvidence ? (
              <>
                <img src={reportEvidence} className="w-full h-full object-cover" alt="Evidencia Reporte" />
                {isClosed && (
                  <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => handleDownloadImage(reportEvidence, `reporte_firmado_${ticket.folio}.png`)}
                      className="bg-white text-slate-900 px-4 py-2 rounded-xl font-black text-[10px] uppercase shadow-xl"
                    >
                      <i className="fas fa-download mr-1"></i> Descargar Original
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center p-6">
                <i className="fas fa-file-signature text-4xl text-slate-200 mb-3"></i>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Suba la foto del reporte firmado para poder cerrar</p>
              </div>
            )}
          </div>
          {validationError && (
            <p className="mt-4 text-rose-500 text-[10px] font-black uppercase text-center bg-rose-50 py-2 rounded-lg border border-rose-200">
              <i className="fas fa-exclamation-triangle mr-1"></i> {validationError}
            </p>
          )}
        </div>

        {/* Global Action Card */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl space-y-6 sticky top-24 border-t-8 border-emerald-500">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isClosed ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
            <span className="text-xs font-black text-white uppercase tracking-widest">{isClosed ? 'SERVICIO FINALIZADO' : status}</span>
          </div>
          
          <div className="space-y-3">
            {!isClosed ? (
              <button 
                onClick={handleFinalize} 
                disabled={isSaving} 
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 py-5 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95 disabled:opacity-50"
              >
                {isSaving ? 'Guardando...' : 'Finalizar Servicio'}
              </button>
            ) : (
              <div className="w-full bg-slate-800 text-emerald-400 py-5 rounded-2xl font-black text-center flex items-center justify-center gap-2 border border-emerald-900/50">
                <i className="fas fa-lock"></i> ORDEN CERRADA
              </div>
            )}
            <button onClick={onCancel} className="w-full bg-slate-800 text-slate-400 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
              Volver a Lista
            </button>
          </div>
          
          <div className="pt-6 border-t border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><i className="fas fa-shield-alt"></i></div>
            <p className="text-[9px] text-slate-500 font-bold leading-tight">Certificación DOPAJ: Los activos descargables mantienen la trazabilidad del servicio técnico.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketExecution;
