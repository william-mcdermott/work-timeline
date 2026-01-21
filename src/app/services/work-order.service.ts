import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WorkCenterDocument, WorkOrderDocument } from '../models/work-order.model';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  private readonly STORAGE_KEY = 'workOrderTimeline_workOrders';

  private workCenters: WorkCenterDocument[] = [
    { docId: 'wc1', docType: 'workCenter', data: { name: 'Extrusion Line A' } },
    { docId: 'wc2', docType: 'workCenter', data: { name: 'CNC Machine 1' } },
    { docId: 'wc3', docType: 'workCenter', data: { name: 'Assembly Station' } },
    { docId: 'wc4', docType: 'workCenter', data: { name: 'Quality Control' } },
    { docId: 'wc5', docType: 'workCenter', data: { name: 'Packaging Line' } },
  ];

  private defaultWorkOrders: WorkOrderDocument[] = [
    {
      docId: 'wo1',
      docType: 'workOrder',
      data: {
        name: 'Widget Production #1001',
        workCenterId: 'wc1',
        status: 'complete',
        startDate: '2026-01-15',
        endDate: '2026-01-20',
      },
    },
    {
      docId: 'wo2',
      docType: 'workOrder',
      data: {
        name: 'Component Assembly #2005',
        workCenterId: 'wc3',
        status: 'in-progress',
        startDate: '2026-01-18',
        endDate: '2026-01-25',
      },
    },
    {
      docId: 'wo3',
      docType: 'workOrder',
      data: {
        name: 'Quality Inspection Batch A',
        workCenterId: 'wc4',
        status: 'blocked',
        startDate: '2026-01-16',
        endDate: '2026-01-28',
      },
    },
    {
      docId: 'wo4',
      docType: 'workOrder',
      data: {
        name: 'Extrusion Run #45',
        workCenterId: 'wc1',
        status: 'open',
        startDate: '2026-01-22',
        endDate: '2026-01-27',
      },
    },
    {
      docId: 'wo5',
      docType: 'workOrder',
      data: {
        name: 'Final Assembly #3002',
        workCenterId: 'wc3',
        status: 'open',
        startDate: '2026-01-27',
        endDate: '2026-02-03',
      },
    },
    {
      docId: 'wo6',
      docType: 'workOrder',
      data: {
        name: 'CNC Machining Job #78',
        workCenterId: 'wc2',
        status: 'in-progress',
        startDate: '2026-01-20',
        endDate: '2026-01-24',
      },
    },
    {
      docId: 'wo7',
      docType: 'workOrder',
      data: {
        name: 'Package & Ship Order #500',
        workCenterId: 'wc5',
        status: 'complete',
        startDate: '2026-01-10',
        endDate: '2026-01-17',
      },
    },
    {
      docId: 'wo8',
      docType: 'workOrder',
      data: {
        name: 'Packaging Batch #501',
        workCenterId: 'wc5',
        status: 'open',
        startDate: '2026-01-19',
        endDate: '2026-01-23',
      },
    },
  ];

  private workOrdersSubject = new BehaviorSubject<WorkOrderDocument[]>(this.loadFromStorage());
  workOrders$: Observable<WorkOrderDocument[]> = this.workOrdersSubject.asObservable();

  constructor() {
    // Subscribe to changes and save to localStorage
    this.workOrders$.subscribe(orders => {
      this.saveToStorage(orders);
    });
  }

  private loadFromStorage(): WorkOrderDocument[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate that it's an array
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error loading work orders from localStorage:', error);
    }
    // Return default data if nothing in storage or error occurred
    return this.defaultWorkOrders;
  }

  private saveToStorage(orders: WorkOrderDocument[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving work orders to localStorage:', error);
    }
  }

  getWorkCenters(): WorkCenterDocument[] {
    return this.workCenters;
  }

  getWorkOrders(): WorkOrderDocument[] {
    return this.workOrdersSubject.value;
  }

  addWorkOrder(order: WorkOrderDocument): void {
    const current = this.workOrdersSubject.value;
    this.workOrdersSubject.next([...current, order]);
  }

  updateWorkOrder(order: WorkOrderDocument): void {
    const current = this.workOrdersSubject.value;
    const updated = current.map(wo => wo.docId === order.docId ? order : wo);
    this.workOrdersSubject.next(updated);
  }

  deleteWorkOrder(orderId: string): void {
    const current = this.workOrdersSubject.value;
    this.workOrdersSubject.next(current.filter(wo => wo.docId !== orderId));
  }

  checkOverlap(workCenterId: string, startDate: string, endDate: string, excludeId?: string): boolean {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.workOrdersSubject.value.some(wo => {
      if (wo.docId === excludeId) return false;
      if (wo.data.workCenterId !== workCenterId) return false;

      const woStart = new Date(wo.data.startDate);
      const woEnd = new Date(wo.data.endDate);

      return (start <= woEnd && end >= woStart);
    });
  }

  resetToDefaults(): void {
    this.workOrdersSubject.next([...this.defaultWorkOrders]);
  }

  clearAll(): void {
    this.workOrdersSubject.next([]);
  }
}
