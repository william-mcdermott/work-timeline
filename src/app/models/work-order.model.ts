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
  open: { label: 'Open', color: '#e0e7ff' },
  'in-progress': { label: 'In progress', color: '#ddd6fe' },
  complete: { label: 'Complete', color: '#d1fae5' },
  blocked: { label: 'Blocked', color: '#fef3c7' },
};
