import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  template: `
    <div [attr.data-bs-theme]="themeService.currentTheme()">
      <nav class="navbar navbar-expand-md navbar-dark bg-primary">
        <div class="container">
          <a class="navbar-brand" href="#" (click)="navigate('/')">
            <i class="fas fa-book me-2"></i>BookManager
          </a>

          <!-- Hamburger Menu Button -->
          <button 
            class="navbar-toggler" 
            type="button" 
            (click)="toggleMobileMenu()"
            [attr.aria-expanded]="isMobileMenuOpen"
            aria-controls="navbar"
            aria-label="Toggle navigation">
            <i class="fas" [class.fa-bars]="!isMobileMenuOpen" [class.fa-times]="isMobileMenuOpen"></i>
          </button>
          
          <!-- Responsive Menu -->
           <div 
            class="collapse navbar-collapse"
            id="navbar" 
            [class.show]="isMobileMenuOpen"
           >

            <div class="navbar-nav ms-auto d-flex align-items-center">
              <ng-container *ngIf="authService.isAuthenticated(); else loginButtons">
                <span class="nav-item navbar-text">Welcome, {{ authService.getCurrentUser()?.email }}</span>
  
                <button 
                  class="nav-item btn btn-outline-light" 
                  (click)="themeService.toggleTheme()"
                  [title]="themeService.currentTheme() === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
                  <i [class]="themeService.currentTheme() === 'dark' ? 'fas fa-sun' : 'fas fa-moon'"></i>
                </button>
  
                <button class="nav-item btn btn-outline-light" (click)="logout()">
                  <i class="fas fa-sign-out-alt me-1"></i>Logout
                </button>
              </ng-container>
              
              <ng-template #loginButtons>
                <button 
                  class="nav-item btn btn-outline-light" 
                  (click)="themeService.toggleTheme()"
                  [title]="themeService.currentTheme() === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
                  <i [class]="themeService.currentTheme() === 'dark' ? 'fas fa-sun' : 'fas fa-moon'"></i>
                </button>
  
                <button class="nav-item btn btn-outline-light" (click)="navigate('/login')">Login</button>
                <button class="nav-item btn btn-light me-0" (click)="navigate('/register')">Register</button>
              </ng-template>
            </div>
           </div>
        </div>
      </nav>
      
      <main class="container mt-4">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  /* last-minute styles for a responsive menu*/
  styles: [`

    .navbar-nav {
      display: flex;
    }

    .nav-item {
      margin-right: 1rem;
    }
    
    /* Custom styles for better mobile experience */
    @media (max-width: 767.98px) {
      .navbar-nav {
        flex-direction: column;

        justify-content: center;
        align-items: center;
        text-align: center;

        padding-top: 1rem;
        padding-bottom: 1rem;
      }
      
      .nav-item {
        display: flex;

        justify-content: center;
        align-items: center;
        text-align: center;

        margin-right: 0rem;
        margin-bottom: 1rem;
        width: 100%;
      }
      
      .nav-item .btn {
        width: 100%;
        justify-content: center;
      }
      
      .navbar-text {
        display: block;
        padding: 0.5rem 0;
        color: rgba(255, 255, 255, 0.75) !important;
      }
    }
    
    /* Custom toggler icon styling */
    .navbar-toggler {
      border: none;
      padding: 0.25rem 0.5rem;
    }
    
    .navbar-toggler:focus {
      box-shadow: none;
    }
    
    .navbar-toggler i {
      color: white;
      font-size: 1.2rem;
    }
  `]
})
export class AppComponent implements OnInit {
  isMobileMenuOpen = false;

  constructor(
    public authService: AuthService,
    public themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.themeService.initializeTheme();
  }

  navigate(path: string) {
    this.router.navigate([path]);
    this.isMobileMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.isMobileMenuOpen = false;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
