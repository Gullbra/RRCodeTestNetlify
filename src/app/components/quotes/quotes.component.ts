import { Component, inject } from '@angular/core';
import { IQuote } from 'src/app/models/quote.model';
import { QuoteService } from 'src/app/services/quote.service';


@Component({
  selector: 'app-quotes',
  template: `
    <div class="route-container" >
      <div class="col-12"> 

        <div class="row" *ngIf="!quoteService.loading() && (quoteService.quotes().length > 0); else noQuotes">
          <div class="col-md-6 col-lg-4 mb-4" *ngFor="let quote of quoteService.quotes(); let i = index">
            <div class="card h-100 quote-card">
              <div class="card-body d-flex flex-column">
                <!-- <div class="quote-number">{{ i + 1 }}</div> -->
                <blockquote class="blockquote flex-grow-1">
                  <p class="mb-0">"{{ quote.text }}"</p>
                </blockquote>
                <footer class="blockquote-footer mt-auto">
                  <cite title="Source Title">{{ quote.author }}</cite>
                  <small *ngIf="quote.source" class="d-block text-muted">{{ quote.source }}</small>
                </footer>
              </div>
            </div>
          </div>
        </div>

        <ng-template #noQuotes>
          <div class="text-center py-5">
            <i class="fas fa-book-open fa-3x text-muted mb-3"></i>
            <h3>No quotes yet</h3>
            <!-- <p class="text-muted">Add your first book to get started!</p>
            <button class="btn btn-primary" (click)="router.navigate(['/books/add'])">
              <i class="fas fa-plus me-2"></i>Add Your First Book
            </button> -->
          </div>
        </ng-template>

      </div>
    </div>
    
    <style>
      .quote-card {
        border-left: 4px solid #007bff;
        transition: transform 0.2s ease-in-out;
      }
      
      .quote-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
      
      .quote-number {
        position: absolute;
        top: -10px;
        right: 15px;
        background: #007bff;
        color: white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        font-weight: bold;
      }
      
      .blockquote {
        font-size: 1rem;
        font-style: italic;
      }
      
      [data-bs-theme="dark"] .quote-card {
        border-left-color: #0d6efd;
      }
      
      [data-bs-theme="dark"] .quote-number {
        background: #0d6efd;
      }
    </style>
  `
})
export class QuotesComponent {
  quoteService = inject(QuoteService);

  ngOnInit() {
    console.log("quote init")
    this.quoteService.loadQuotes();
    console.log("quotes loaded", this.quoteService.quotes());
  }
}

/*
  quotes: Partial<IQuote>[] = [
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    },
    {
      text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
      author: "George R.R. Martin",
      source: "A Dance with Dragons"
    },
    {
      text: "So many sources, so little time.",
      author: "Frank Zappa"
    },
    {
      text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
      author: "Dr. Seuss",
      source: "I Can Read With My Eyes Shut!"
    },
    {
      text: "Books are a uniquely portable magic.",
      author: "Stephen King",
      source: "On Writing"
    }
  ];
*/
