import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridLines } from './grid-lines';

describe('GridLines', () => {
  let component: GridLines;
  let fixture: ComponentFixture<GridLines>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridLines]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridLines);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
