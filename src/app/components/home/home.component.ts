
import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { routeTransitions } from 'src/app/route-transition';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row ">
      <div class="col-12" >
        <div class="d-flex justify-content-around align-items-center mb-4">
          <div>
            <h2 (click)="router.navigate(['/'])"><i class="fas fa-book me-2"></i>My Books</h2>
            <div class="underline" [ngClass]="{'path-active': this.router.url === '/'}"></div>
          </div>

          <div>            
            <h2 (click)="router.navigate(['/quotes'])"><i class="fas fa-quote-left me-2"></i>My Quotes</h2>
            <div class="underline" [ngClass]="{'path-active': this.router.url === '/quotes'}" ></div>
          </div>
        </div>
       
        <!-- "Routing wrapper"  -->
        <div
          [@routeTransitions]="getRouteAnimationData(outlet)"
          class="child-route-outlet-wrapper-wrapper m-0 p-0"
          id="lvl_0"
        >
          <!-- Router outlet for child routes -->
          <div id="lvl_1" class="child-route-outlet-wrapper m-0 p-0" style="display: space;">
            <router-outlet class="m-0 p-0" id="lvl_2" #outlet="outlet"></router-outlet>
          </div>
        </div>
      </div>
    </div>

    <style>
      .underline {
        margin-top: 20px;
        height: 2px;
        border-radius: 4px;
      }
    </style>
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
    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd),
    //   map(() => this.route.firstChild?.snapshot.data?.['animation'] || ''),
    //   takeUntil(this.destroy$)
    // ).subscribe(animation => {
    //   console.log('Route animation data:', animation);
    //   this.currentRoute = animation;
    // });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getRouteAnimationData(outlet: RouterOutlet) {
    const animationData = outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
    return animationData || '';
  }
}

