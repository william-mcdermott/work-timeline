import { Component, computed, effect, inject, input, output, Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDatepickerModule, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { WorkOrderStatus } from '../../../models/work-order.model';

@Injectable()
class CustomDateParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct | null {
    if (!value) return null;
    const parts = value.trim().split('.');
    if (parts.length !== 3) return null;
    return {
      month: parseInt(parts[0], 10),
      day: parseInt(parts[1], 10),
      year: parseInt(parts[2], 10)
    };
  }

  format(date: NgbDateStruct | null): string {
    if (!date) return '';
    const month = date.month.toString().padStart(2, '0');
    const day = date.day.toString().padStart(2, '0');
    return `${month}.${day}.${date.year}`;
  }
}

interface WorkOrderFormData {
  name: string;
  status: WorkOrderStatus;
  startDate: string;
  endDate: string;
  workCenterId?: string;
}

@Component({
  selector: 'app-side-panel',
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, NgbDatepickerModule],
  templateUrl: './side-panel.html',
  styleUrl: './side-panel.scss',
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class SidePanel {
  private fb = inject(FormBuilder);

  // Inputs
  isPanelOpen = input<boolean>(false);
  panelMode = input<'create' | 'edit'>('create');
  initialData = input<WorkOrderFormData | null>(null);
  formError = input<string>('');

  // Outputs
  closePanel = input.required<() => void>();
  readonly submitForm = output<WorkOrderFormData>();

  // Form state
  workOrderForm!: FormGroup;
  localFormError = '';

  // Computed combined error message
  displayError = computed(() => this.formError() || this.localFormError);

  // Get current status color
  getCurrentStatusColor(): string {
    const currentStatus = this.workOrderForm.get('status')?.value;
    const statusOption = this.statusOptions.find(opt => opt.value === currentStatus);
    return statusOption?.color || '#e0e7ff';
  }

  // Get current status label
  getCurrentStatusLabel(): string {
    const currentStatus = this.workOrderForm.get('status')?.value;
    const statusOption = this.statusOptions.find(opt => opt.value === currentStatus);
    return statusOption?.label || 'Open';
  }

  statusOptions = [
    { value: 'open', label: 'Open', color: '#e0e7ff' },
    { value: 'in-progress', label: 'In Progress', color: '#ddd6fe' },
    { value: 'complete', label: 'Complete', color: '#d1fae5' },
    { value: 'blocked', label: 'Blocked', color: '#fef3c7' },
  ];

  // Helper to convert NgbDateStruct to ISO string (YYYY-MM-DD)
  private ngbDateToString(date: NgbDateStruct | null): string {
    if (!date) return '';
    const year = date.year.toString();
    const month = date.month.toString().padStart(2, '0');
    const day = date.day.toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Helper to convert ISO string to NgbDateStruct
  private stringToNgbDate(dateStr: string): NgbDateStruct | null {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    return {
      year: parseInt(parts[0], 10),
      month: parseInt(parts[1], 10),
      day: parseInt(parts[2], 10)
    };
  }

  // Custom validator to ensure end date is after start date
  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;

    if (!startDate || !endDate) {
      return null;
    }

    // Handle NgbDateStruct format
    const start = typeof startDate === 'string'
      ? new Date(startDate)
      : new Date(startDate.year, startDate.month - 1, startDate.day);
    const end = typeof endDate === 'string'
      ? new Date(endDate)
      : new Date(endDate.year, endDate.month - 1, endDate.day);

    return end >= start ? null : { dateRange: true };
  }

  constructor() {
    // Initialize form
    this.workOrderForm = this.fb.group({
      name: ['', Validators.required],
      status: ['open', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    }, {
      validators: this.dateRangeValidator
    });

    // Watch for initial data changes and populate form
    effect(() => {
      const data = this.initialData();
      if (data) {
        // Convert string dates to NgbDateStruct for the datepicker
        this.workOrderForm.patchValue({
          name: data.name,
          status: data.status,
          startDate: this.stringToNgbDate(data.startDate),
          endDate: this.stringToNgbDate(data.endDate)
        });
        this.localFormError = '';
      }
    });
  }

  onSubmit() {
    if (this.workOrderForm.valid) {
      const formValue = this.workOrderForm.value;
      // Convert NgbDateStruct back to string format for submission
      const submitData: WorkOrderFormData = {
        name: formValue.name,
        status: formValue.status,
        startDate: this.ngbDateToString(formValue.startDate),
        endDate: this.ngbDateToString(formValue.endDate)
      };
      this.submitForm.emit(submitData);
      this.localFormError = '';
    } else {
      if (this.workOrderForm.errors?.['dateRange']) {
        this.localFormError = 'End date must be on or after start date';
      } else {
        this.localFormError = 'Please fill in all required fields';
      }
    }
  }
}
