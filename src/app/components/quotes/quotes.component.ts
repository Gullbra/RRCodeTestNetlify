import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { IQuote } from 'src/app/models/quote.model';
import { QuoteService } from 'src/app/services/quote.service';


@Component({
  selector: 'app-quotes',
  template: `
    <div class="route-container m-0 p-0 w-50">
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
            <div class="card-footer">
              <div class="btn-group w-100">
                <button 
                  class="btn btn-outline-primary"
                  (click)="router.navigate(['/quotes/edit', quote.id])">
                  <i class="fas fa-edit"></i> Edit
                </button>
                <button 
                  class="btn btn-outline-danger"
                  (click)="deleteQuote(quote)">
                  <i class="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="row align-items-center justify-content-center mt-4">
          <button style="width: fit-content;" class="btn btn-primary rounded" (click)="router.navigate(['/quotes/add'])">
            <i class="fas fa-plus me-2"></i>Add Quote
          </button>
        </div>
      </div>

      <ng-template #noQuotes>
        <div class="row m-0 p-0">
        <!-- <div class="row"> -->
          <div class="text-center py-5">
            <i class="fas fa-quote-left fa-3x text-muted mb-3"></i>
            <h3>No quotes yet</h3>
            <p class="text-muted">Add your first quote to get started!</p>
            <button class="btn btn-primary" (click)="router.navigate(['/quotes/add'])">
              <i class="fas fa-plus me-2"></i>Add Your First Quote
            </button>
          </div>
        </div>
      </ng-template>
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
export class QuotesComponent implements OnInit {
  quoteService = inject(QuoteService);
  quoteToDelete: IQuote | null = null;

  private renderer = inject(Renderer2);
  private modalElement: HTMLElement | null = null;

  constructor(public router: Router) {}


  ngOnInit() {
    this.quoteService.loadQuotes();
    this.createModal();
  }


  ngOnDestroy(): void {
    // Clean up modal when component is destroyed
    if (this.modalElement) {
      document.body.removeChild(this.modalElement);
    }
  }


  deleteQuote (quote: IQuote): void {
    this.quoteToDelete = quote;
    
    // Update modal text
    const modalText = document.getElementById('deleteModalText');
    if (modalText) {
      modalText.textContent = `Are you sure you want to delete "${quote.text}"?`;
    }
    
    const modal = new (window as any).bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  }


  confirmDelete(): void {
    if (this.quoteToDelete) {
      this.quoteService.deleteQuote(this.quoteToDelete.id).subscribe({
        next: (res) => {
          if(res.success) {
            this.quoteToDelete = null;
          } else {
            console.error('Delete failed:', res.message);
          }
          const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
          modal.hide();
        },
        error: (error) => {
          console.error('Error deleting quote:', error);
        }
      });
    }
  }


  private createModal(): void {
    // Create modal element
    this.modalElement = this.renderer.createElement('div') as HTMLElement;
    this.renderer.addClass(this.modalElement, 'modal');
    this.renderer.addClass(this.modalElement, 'fade');
    this.renderer.setAttribute(this.modalElement, 'id', 'deleteModal');
    this.renderer.setAttribute(this.modalElement, 'tabindex', '-1');

    this.modalElement.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete Quote</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <span id="deleteModalText">Are you sure you want to delete this quote?</span>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Delete</button>
          </div>
        </div>
      </div>
    `;

    // Append to body instead of component template
    document.body.appendChild(this.modalElement);

    // Add event listener for confirm delete button
    const confirmBtn = this.modalElement.querySelector('#confirmDeleteBtn');
    if (confirmBtn) {
      this.renderer.listen(confirmBtn, 'click', () => this.confirmDelete());
    }
  }
}
