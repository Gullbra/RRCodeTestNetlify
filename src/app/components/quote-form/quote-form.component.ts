import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuoteService } from '../../services/quote.service';
import { IQuote } from '../../models/quote.model';

@Component({
  selector: 'app-quote-form',
  template: `
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h2 class="mb-0">
              <i [class]="isEditing ? 'fas fa-edit' : 'fas fa-plus'" class="me-2"></i>
              {{ isEditing ? 'Edit Quote' : 'Add New Quote' }}
            </h2>
          </div>
          <div class="card-body">
            <form [formGroup]="quoteForm" (ngSubmit)="onSubmit()">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Text *</label>
                    <input 
                      type="text" 
                      class="form-control"
                      formControlName="text"
                      [class.is-invalid]="quoteForm.get('text')?.invalid && quoteForm.get('text')?.touched">
                    <div class="invalid-feedback" *ngIf="quoteForm.get('text')?.invalid && quoteForm.get('text')?.touched">
                      Text is required
                    </div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Author *</label>
                    <input 
                      type="text" 
                      class="form-control"
                      formControlName="author"
                      [class.is-invalid]="quoteForm.get('author')?.invalid && quoteForm.get('author')?.touched">
                    <div class="invalid-feedback" *ngIf="quoteForm.get('author')?.invalid && quoteForm.get('author')?.touched">
                      Author is required
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="row">
              <!-- source here -->
              </div>
              
              
              <div class="alert alert-danger" *ngIf="errorMessage">
                {{ errorMessage }}
              </div>
              
              <div class="d-flex justify-content-between">
                <button 
                  type="button" 
                  class="btn btn-secondary"
                  (click)="router.navigate(['/'])">
                  <i class="fas fa-arrow-left me-2"></i>Cancel
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  [disabled]="quoteForm.invalid || loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i *ngIf="!loading" [class]="isEditing ? 'fas fa-save' : 'fas fa-plus'" class="me-2"></i>
                  {{ loading ? 'Saving...' : (isEditing ? 'Update Quote' : 'Add Quote') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class QuoteFormComponent implements OnInit {
  quoteForm: FormGroup;
  isEditing = false;
  quoteId: string | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private quoteService: QuoteService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.quoteForm = this.fb.group({
      text: ['', Validators.required],
      author: ['', Validators.required],
      // source: ['', Validators.required] // Assuming source is a required field
    });
  }

  ngOnInit(): void {
    this.quoteId = this.route.snapshot.paramMap.get('id');
    this.isEditing = !!this.quoteId;
    
    if (this.isEditing && this.quoteId) {
      this.loadQuote();
    }
  }

  loadQuote(): void {
    // this.loading = true;
    const quote = this.quoteService.getQuoteById(Number(this.quoteId));
    if (!quote) {
      this.errorMessage = 'Quote not found';
      this.loading = false;
      return;
    }

    this.quoteForm.patchValue({ ...quote });

    this.loading = false;
    // this.quoteService.get(this.quoteId!).subscribe({
    //   next: (res) => {
    //     this.quoteForm.patchValue(res.data);
    //     this.loading = false;
    //   },
    //   error: (error) => {
    //     this.errorMessage = 'Error loading quote: ' + error;
    //     this.loading = false;
    //   }
    // });
  }

  onSubmit(): void {
    if (this.quoteForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      const quoteData: IQuote = {...this.quoteForm.value, dateOfPublication: new Date(this.quoteForm.value.dateOfPublication, 0, 1)};
      
      const request = this.isEditing 
        ? this.quoteService.updateQuote(this.quoteId!, quoteData)
        : this.quoteService.createQuote(quoteData);
        
        
      request.subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.errorMessage = error;
          this.loading = false;
        }
      });
    }
  }
}
