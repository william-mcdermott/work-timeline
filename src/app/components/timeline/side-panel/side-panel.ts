import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-panel',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './side-panel.html',
  styleUrl: './side-panel.scss',
})
export class SidePanel implements OnInit {
  private fb = inject(FormBuilder);

  isPanelOpen = input<boolean>(false);
  closePanel = input.required<() => void>();

  workOrderForm!: FormGroup;
  panelMode: 'create' | 'edit' = 'create';
  formError = '';

  statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'complete', label: 'Complete' },
    { value: 'blocked', label: 'Blocked' },
  ];

  ngOnInit() {
    this.workOrderForm = this.fb.group({
      name: ['', Validators.required],
      status: ['open', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.workOrderForm.valid) {
      // Handle form submission
      console.log('Form submitted:', this.workOrderForm.value);
      this.closePanel()();
    } else {
      this.formError = 'Please fill in all required fields';
    }
  }
}
