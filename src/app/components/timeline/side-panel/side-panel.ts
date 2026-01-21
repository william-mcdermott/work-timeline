import { Component, computed, effect, inject, input, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WorkOrderStatus } from '../../../models/work-order.model';

interface WorkOrderFormData {
  name: string;
  status: WorkOrderStatus;
  startDate: string;
  endDate: string;
  workCenterId?: string;
}

@Component({
  selector: 'app-side-panel',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './side-panel.html',
  styleUrl: './side-panel.scss',
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

  statusOptions = [
    { value: 'open', label: 'Open', color: '#e0e7ff' },
    { value: 'in-progress', label: 'In Progress', color: '#ddd6fe' },
    { value: 'complete', label: 'Complete', color: '#d1fae5' },
    { value: 'blocked', label: 'Blocked', color: '#fef3c7' },
  ];

  // Custom validator to ensure end date is after start date
  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;

    if (!startDate || !endDate) {
      return null;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

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
        this.workOrderForm.patchValue(data);
        this.localFormError = '';
      }
    });
  }

  onSubmit() {
    if (this.workOrderForm.valid) {
      this.submitForm.emit(this.workOrderForm.value);
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
