// import { Component } from '@angular/core';
// import { ActivatedRoute, Router, RouterOutlet  } from '@angular/router';
// import { routeTransitions } from 'src/app/route-transition';

// import {
//   trigger, transition, style, query, group, animate
// } from '@angular/animations';
// import { RouterOutlet } from '@angular/router';


import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { routeTransitions  } from 'src/app/route-transition';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
        <!-- style="display: contents;" -->
        <div
          [@routeTransitions]="getRouteAnimationData(outlet)"
          class="d-block position-relative overflow-hidden animated-router"
        >
          <router-outlet #outlet="outlet"></router-outlet>
        </div>
      </div>
    </div>
  `,
  animations: [
    routeTransitions 
  ]
})
export class HomeComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  currentRoute = '';

  constructor(
    public router: Router, 
    protected route: ActivatedRoute
  ) {
    // Track route changes for debugging
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route.firstChild?.snapshot.data?.['animation'] || ''),
      takeUntil(this.destroy$)
    ).subscribe(animation => {
      console.log('Route animation data:', animation);
      this.currentRoute = animation;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getRouteAnimationData(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
