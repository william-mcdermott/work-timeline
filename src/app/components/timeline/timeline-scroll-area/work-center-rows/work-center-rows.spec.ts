import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkCenterRows } from './work-center-rows';

describe('WorkCenterRows', () => {
  let component: WorkCenterRows;
  let fixture: ComponentFixture<WorkCenterRows>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkCenterRows]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkCenterRows);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
