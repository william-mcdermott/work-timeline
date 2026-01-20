import { Component, Input } from '@angular/core';
import { ZoomLevel } from '../../../models/work-order.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  constructor() {}
  @Input() zoomLevel: ZoomLevel = 'month';
  @Input() onZoomChange!: Function

}
