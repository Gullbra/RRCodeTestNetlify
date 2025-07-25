import { animate, query, style, transition, trigger, group } from "@angular/animations";

export const routeTransitions  = trigger('routeTransitions', [

  transition('* => quotes', [
    // init styles
    query(':enter', [style({ position: 'relative', left: '100%', top: 0 })], { optional: true }),
    query(':leave', [style({ position: 'relative', left: 0, top: 0 })], { optional: true }),
    
    // Animate both pages simultaneously
    // slide to right
    group([
      query(':leave', [animate('0.6s ease-in-out', style({ left: '-100%' }))], { optional: true }),
      query(':enter', [animate('0.6s ease-in-out', style({ left: '0%' }))], { optional: true })
    ])
  ]),
  

  transition('* => booksList', [
    // init styles
    query(':enter', [style({ position: 'relative', right: '100%', top: 0 })], { optional: true }),
    query(':leave', [style({ position: 'relative', right: 0, top: 0 })], { optional: true }),
    
    // Animate both pages simultaneously
    // slide to left
    group([
      query(':leave', [animate('0.6s ease-in-out', style({ right: '-100%' }))], { optional: true }),
      query(':enter', [animate('0.6s ease-in-out', style({ right: '0%' }))], { optional: true })
    ])
  ])
]);



/*
cubic-bezier(0.25, 0.8, 0.25, 1)
cubic-bezier(0.25, 0.8, 0.25, 1)
*/
