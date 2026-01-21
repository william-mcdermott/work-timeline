import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ZoomLevel } from '../../../models/work-order.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  zoomLevel = input.required<ZoomLevel>();
  readonly zoomLevelChange = output<ZoomLevel>();

  onZoomChange(newZoomLevel: ZoomLevel): void {
    this.zoomLevelChange.emit(newZoomLevel);
  }
}
