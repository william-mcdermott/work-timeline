import { Component } from '@angular/core';
import { Header } from './header/header';
import { TimelineGrid } from './timeline-grid/timeline-grid';

@Component({
  selector: 'app-timeline',
  imports: [Header, TimelineGrid],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
})
export class Timeline {

}
