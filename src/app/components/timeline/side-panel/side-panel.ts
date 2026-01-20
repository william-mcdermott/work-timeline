import { Component, computed, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

  statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'complete', label: 'Complete' },
    { value: 'blocked', label: 'Blocked' },
  ];

  constructor() {
    // Initialize form
    this.workOrderForm = this.fb.group({
      name: ['', Validators.required],
      status: ['open', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
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
      this.localFormError = 'Please fill in all required fields';
    }
  }
}
