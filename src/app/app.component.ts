import { Component } from '@angular/core';
import { Timeline } from '../app/components/timeline/timeline'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ Timeline ],
  templateUrl: './app.html',
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent {}
