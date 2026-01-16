
import React from 'react';
import { TicketStatus } from './types';

export const STATUS_COLORS: Record<TicketStatus, string> = {
  [TicketStatus.PENDING_ATTENTION]: 'bg-amber-100 text-amber-700 border-amber-200',
  [TicketStatus.PENDING_PARTS]: 'bg-rose-100 text-rose-700 border-rose-200',
  [TicketStatus.PENDING_USER]: 'bg-blue-100 text-blue-700 border-blue-200',
  [TicketStatus.CLOSED]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export const STATUS_ICONS: Record<TicketStatus, React.ReactNode> = {
  [TicketStatus.PENDING_ATTENTION]: <i className="fas fa-clock"></i>,
  [TicketStatus.PENDING_PARTS]: <i className="fas fa-tools"></i>,
  [TicketStatus.PENDING_USER]: <i className="fas fa-user-clock"></i>,
  [TicketStatus.CLOSED]: <i className="fas fa-check-circle"></i>,
};
