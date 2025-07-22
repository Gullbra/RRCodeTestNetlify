import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { IBook, IBookHttpObj } from '../../models/book.model';


@Component({
  selector: 'app-home',
  template: `
    <div class="row border">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1><i class="fas fa-book me-2"></i>My Books</h1>
          
          <h2>Qoutes</h2>
          
          <button class="btn btn-primary" (click)="router.navigate(['/books/add'])">
            <i class="fas fa-plus me-2"></i>Add Book
          </button>
        </div>
        
        <div class="row" *ngIf="!bookService.loading() && (bookService.books().length > 0); else noBooks">
          <div class="col-md-6 col-lg-4 mb-4" *ngFor="let book of bookService.books()">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">{{ book.title }}</h5>
                <p class="card-text">
                  <strong>Author:</strong> {{ book.author }}<br>
                  <!-- <strong>Genre:</strong> {{ book.genre }}<br> -->
                  <strong>Year:</strong> {{ book.dateOfPublication.getFullYear() }}<br>
                </p>
                <!-- <p class="card-text">{{ book.description }}</p> -->
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
        
        <ng-template #noBooks>
          <div class="text-center py-5">
            <i class="fas fa-book-open fa-3x text-muted mb-3"></i>
            <h3>No books yet</h3>
            <p class="text-muted">Add your first book to get started!</p>
            <button class="btn btn-primary" (click)="router.navigate(['/books/add'])">
              <i class="fas fa-plus me-2"></i>Add Your First Book
            </button>
          </div>
        </ng-template>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete Book</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete "{{ bookToDelete?.title }}"?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" (click)="confirmDelete()">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  bookService = inject(BookService);
  bookToDelete: IBook | null = null;

  constructor(
    // protected bookService: BookService,
    public router: Router
  ) {
    // this.booksSubscription = this.bookService.booksUpdated$.subscribe({
    //   next: (books) => {
    //     this.books = books.map(this.httpBookToModel);
    //   },
    //   error: (error) => {
    //     console.error('Error receiving book updates:', error);
    //   }
    // })
  }

  ngOnInit(): void {
    // console.log('HomeComponent initialized');
    this.bookService.loadBooks()
    // console.log('Books loaded:', this.bookService.books());
    // console.log('Books loading:', this.bookService.loading());
  }

  deleteBook(book: IBook): void {
    this.bookToDelete = book;
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
}
