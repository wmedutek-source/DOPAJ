
export enum UserRole {
  ADMIN = 'ADMIN',
  ENGINEER = 'ENGINEER'
}

export enum TicketStatus {
  PENDING_ATTENTION = 'Pendiente Atención',
  PENDING_PARTS = 'Pendiente Refacción',
  PENDING_USER = 'Pendiente Usuario',
  CLOSED = 'Cerrado'
}

export interface User {
  uid: string;
  email: string; // Usado como nombre de usuario/login
  name: string;
  role: UserRole;
  password?: string; // Requerido para el login
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface Ticket {
  id: string; // Interno
  folio: string; // Folio manual (Ej. FL040283)
  
  // Datos Técnicos (Extraídos del PDF)
  reportFolio: string; 
  serialNumber: string;
  model: string;
  clientName: string;
  responsiblePerson: string;
  phone: string;
  description: string; // Falla reportada inicial

  engineerId: string;
  engineerName: string;
  assignedAt: string;
  attendedAt?: string;
  status: TicketStatus;
  
  // Datos de campo (Capturados por el ingeniero)
  failureLocated?: string;
  solutionApplied?: string;
  observations?: string;
  
  // Assets
  serviceSheetUrl?: string; 
  evidencePhotos: string[]; 
  signatureUrl?: string;
  reportEvidencePhoto?: string; // Nueva evidencia obligatoria
  
  // Cumplimiento
  locationAtClosure?: GeoLocation;
  
  createdAt: string;
}

export interface DashboardStats {
  totalTickets: number;
  byStatus: Record<string, number>;
  byEngineer: Record<string, number>;
  avgAttentionTimeHours: number;
}
