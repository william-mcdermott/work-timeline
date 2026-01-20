export type WorkOrderStatus = 'open' | 'in-progress' | 'complete' | 'blocked';
export type ZoomLevel = 'day' | 'week' | 'month';

export interface WorkCenterDocument {
  docId: string;
  docType: 'workCenter';
  data: {
    name: string;
  };
}

export interface WorkOrderDocument {
  docId: string;
  docType: 'workOrder';
  data: {
    name: string;
    workCenterId: string;
    status: WorkOrderStatus;
    startDate: string;
    endDate: string;
  };
}

export const STATUS_CONFIG = {
  open: { label: 'Open', color: '#3B82F6' },
  'in-progress': { label: 'In Progress', color: '#8B5CF6' },
  complete: { label: 'Complete', color: '#10B981' },
  blocked: { label: 'Blocked', color: '#F59E0B' },
};
