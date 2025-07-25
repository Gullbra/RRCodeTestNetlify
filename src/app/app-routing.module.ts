import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { BookFormComponent } from './components/book-form/book-form.component';
import { QuotesComponent } from './components/quotes/quotes.component';
import { AuthGuard } from './guards/auth.guard';
import { BooksListComponent } from './components/book-list/books-list.component';


const routes: Routes = [
  // { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { 
    path: '',
    // redirectTo: '/list', 
    component: HomeComponent, 
    canActivate: [AuthGuard],
    children: [
      { path: '', component: BooksListComponent, data: { animation: 'booksList' } },
      { path: 'quotes', component: QuotesComponent, data: { animation: 'quotes' } },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'books/add', component: BookFormComponent, canActivate: [AuthGuard] },
  { path: 'books/edit/:id', component: BookFormComponent, canActivate: [AuthGuard] },
  // { path: 'quotes', component: QuotesComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
