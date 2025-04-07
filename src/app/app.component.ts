import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent {
  constructor(private apollo: Apollo) {
    console.log('✅ Apollo injected successfully:', apollo);
  }
}
