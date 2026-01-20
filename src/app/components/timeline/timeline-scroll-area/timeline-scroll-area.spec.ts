import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineScrollArea } from './timeline-scroll-area';

describe('TimelineScrollArea', () => {
  let component: TimelineScrollArea;
  let fixture: ComponentFixture<TimelineScrollArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineScrollArea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelineScrollArea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
