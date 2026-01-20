import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayIndicator } from './today-indicator';

describe('TodayIndicator', () => {
  let component: TodayIndicator;
  let fixture: ComponentFixture<TodayIndicator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayIndicator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayIndicator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
