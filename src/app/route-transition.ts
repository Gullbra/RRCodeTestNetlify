import { animate, query, style, transition, trigger, group } from "@angular/animations";

export const routeTransitions  = trigger('routeTransitions', [
  // transition('* <=> *', [
  //   // Set initial state of entering element
  //   query(':enter', [
  //     style({ opacity: 0, transform: 'scale(0.9)' })
  //   ], { optional: true }),
    
  //   // Animate both leaving and entering elements in parallel
  //   group([
  //     // Animate leaving element
  //     query(':leave', [
  //       animate('300ms ease-in', style({ 
  //         opacity: 0, 
  //         transform: 'scale(0.9)' 
  //       }))
  //     ], { optional: true }),
      
  //     // Animate entering element with slight delay
  //     query(':enter', [
  //       animate('300ms 150ms ease-out', style({ 
  //         opacity: 1, 
  //         transform: 'scale(1)' 
  //       }))
  //     ], { optional: true })
  //   ])
  // ])



  // transition('* <=> *', [
  //   // Position elements for sliding
  //   query(':enter, :leave', [
  //     style({
  //       // position: 'absolute',
  //       // top: 0,
  //       // left: 0,
  //       width: '100%'
  //     })
  //   ], { optional: true }),
    

  //   // Set initial state - entering element starts from right
  //   query(':enter', [
  //     style({ 
  //       // opacity: 0,
  //       transform: 'translateX(100%)' 
  //     })
  //   ], { optional: true }),
    

  //   // Slide both elements simultaneously
  //   group([
  //     // Slide out leaving element to the left /* */
  //     query(':leave', [
  //       animate('600ms ease-in', style({ 
  //         // opacity: 0,
  //         transform: 'translateX(-100%)' 
  //       }))
  //     ], { optional: true }),
      
  //     // Slide in entering element from the right
  //     query(':enter', [
  //       animate('600ms ease-in', style({ 
  //         // opacity: 1,
  //         transform: 'translateX(0%)' 
  //       }))
  //     ], { optional: true })
  //   ])
  // ])


  transition('booksList => quotes', [
    // Set initial styles for new page
    query(':enter', [
      style({ position: 'relative', left: '100%', top: 0 })
    ], { optional: true }),
    query(':leave', [
      style({ position: 'relative', left: 0, top: 0 })
    ], { optional: true }),
    
    // Animate both pages simultaneously
    group([
      // Slide out the current page to the right
      query(':leave', [
        animate('1s ease-in-out', style({ left: '-100%' }))
      ], { optional: true }),
      
      // Slide in the new page from the right
      query(':enter', [
        animate('1s ease-in-out', style({ left: '0%' }))
      ], { optional: true })
    ])
  ]),
  transition('quotes => booksList', [
    // Set initial styles for new page
    query(':enter', [
      style({ position: 'relative', right: '100%', top: 0 })
    ], { optional: true }),
    query(':leave', [
      style({ position: 'relative', right: 0, top: 0 })
    ], { optional: true }),
    
    // Animate both pages simultaneously
    group([
      // Slide out the current page to the right
      query(':leave', [
        animate('1s ease-in-out', style({ right: '-100%' }))
      ], { optional: true }),
      
      // Slide in the new page from the right
      query(':enter', [
        animate('1s ease-in-out', style({ right: '0%' }))
      ], { optional: true })
    ])
  ])
]);



/*
Nice.  I'd like the new component to "move in from the  right" when switching to "quotes" and "move in from the  left" when switching to "book-list". Can you write me such an animation?

cubic-bezier(0.25, 0.8, 0.25, 1)
cubic-bezier(0.25, 0.8, 0.25, 1)
*/
