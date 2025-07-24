import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `
    <div class="row border">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
          
    
          <h1 (click)="router.navigate(['/'])"><i class="fas fa-book me-2"></i>My Books</h1>
          

          <h2 (click)="router.navigate(['/quotes'])">Quotes</h2>
          
          <button class="btn btn-primary" (click)="router.navigate(['/books/add'])">
            <i class="fas fa-plus me-2"></i>Add Book
          </button>
        </div>
        
        <!-- Router outlet for child routes -->
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class HomeComponent {
  constructor(public router: Router) {}
}
