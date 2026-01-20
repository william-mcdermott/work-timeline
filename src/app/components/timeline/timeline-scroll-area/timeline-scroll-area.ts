import { CommonModule } from '@angular/common';
import { Component, Input, TrackByFunction } from '@angular/core';
import { DateColumn } from '../timeline';

@Component({
  selector: 'app-timeline-scroll-area',
  imports: [CommonModule],
  templateUrl: './timeline-scroll-area.html',
  styleUrl: './timeline-scroll-area.scss',
})
export class TimelineScrollArea {
  constructor() {}
  @Input() dateColumns!: DateColumn[];
  @Input() columnWidth!: number;
  
  trackByColumn(index: number, item: DateColumn): string {
    return item.date;
  }
}
