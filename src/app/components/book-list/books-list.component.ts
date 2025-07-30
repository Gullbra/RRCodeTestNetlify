import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { IBook } from '../../models/book.model';

@Component({
  selector: 'app-books-list',
  template: `
    <div class="route-container">        
      <!-- <div style="border: 1px solid purple;" class="row" *ngIf="!bookService.loading() && (bookService.books().length > 0); else noBooks"> -->
      <div class="row" *ngIf="!bookService.loading() && (bookService.books().length > 0); else noBooks">
        <div class="row">

          <div class="col-md-6 col-lg-4 mb-4" *ngFor="let book of bookService.books()">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">{{ book.title }}</h5>
                <p class="card-text">
                  <strong>Author:</strong> {{ book.author }}<br>
                  <strong>Year:</strong> {{ book.dateOfPublication.getFullYear() }}<br>
                </p>
              </div>
              
              <div class="card-footer">
                <div class="btn-group w-100">
                  <button 
                    class="btn btn-outline-primary"
                    (click)="router.navigate(['/books/edit', book.id])">
                    <i class="fas fa-edit"></i> Edit
                  </button>
                  <button 
                    class="btn btn-outline-danger"
                    (click)="deleteBook(book)">
                    <i class="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Button to add a new book -->
        <div class="row align-items-center justify-content-center mt-4">
          <button style="width: fit-content;" class="btn btn-primary rounded" (click)="router.navigate(['/books/add'])">
            <i class="fas fa-plus me-2"></i>Add Book
          </button>
        </div>
      </div>
      
      <ng-template #noBooks>
        <!-- <div style="border: 1px solid purple;" class="row"> -->
        <div class="row"><
          <div class="text-center py-5">
            <i class="fas fa-book-open fa-3x text-muted mb-3"></i>
            <h3>No books yet</h3>
            <p class="text-muted">Add your first book to get started!</p>
            <button class="btn btn-primary" (click)="router.navigate(['/books/add'])">
              <i class="fas fa-plus me-2"></i>Add Your First Book
            </button>
          </div>
        </div>
      </ng-template>
    </div>
  `
})
export class BooksListComponent implements OnInit {
  bookService = inject(BookService);
  bookToDelete: IBook | null = null;

  private renderer = inject(Renderer2);
  private modalElement: HTMLElement | null = null;

  constructor(public router: Router) {}


  ngOnInit(): void {
    this.bookService.loadBooks();
    this.createModal();
  }


  ngOnDestroy(): void {
    // Clean up modal when component is destroyed
    if (this.modalElement) {
      document.body.removeChild(this.modalElement);
    }
  }


  deleteBook(book: IBook): void {
    this.bookToDelete = book;
    
    // Update modal text
    const modalText = document.getElementById('deleteModalText');
    if (modalText) {
      modalText.textContent = `Are you sure you want to delete "${book.title}"?`;
    }
    
    const modal = new (window as any).bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  }


  confirmDelete(): void {
    if (this.bookToDelete) {
      this.bookService.deleteBook(this.bookToDelete.id).subscribe({
        next: (res) => {
          if(res.success) {
            this.bookToDelete = null;
          } else {
            console.error('Delete failed:', res.message);
          }
          const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
          modal.hide();
        },
        error: (error) => {
          console.error('Error deleting book:', error);
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
            <h5 class="modal-title">Delete Book</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <span id="deleteModalText">Are you sure you want to delete this book?</span>
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
