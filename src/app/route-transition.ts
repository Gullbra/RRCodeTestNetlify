import { animate, query, style, transition, trigger, group } from "@angular/animations";

export const routeTransitions  = trigger('routeTransitions', [
  transition('* <=> *', [
    // Set initial state of entering element
    query(':enter', [
      style({ opacity: 0, transform: 'scale(0.9)' })
    ], { optional: true }),
    
    // Animate both leaving and entering elements in parallel
    group([
      // Animate leaving element
      query(':leave', [
        animate('300ms ease-in', style({ 
          opacity: 0, 
          transform: 'scale(0.9)' 
        }))
      ], { optional: true }),
      
      // Animate entering element with slight delay
      query(':enter', [
        animate('300ms 150ms ease-out', style({ 
          opacity: 1, 
          transform: 'scale(1)' 
        }))
      ], { optional: true })
    ])
  ])
]);
