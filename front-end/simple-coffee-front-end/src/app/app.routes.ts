import { Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about';
import { CartComponent } from './pages/cart-component/cart-component';
import { UserProfileComponent } from './pages/user-profile-component/user-profile-component';
import { ProductsComponent } from './pages/products-component/products-component';
import { AdminComponent } from './pages/admin-component/admin-component';


export const routes: Routes = [
    { path: '', redirectTo: 'about', pathMatch: 'full' },
    { path: 'about', component: AboutComponent},
    { path: 'cart', component: CartComponent},
    { path: 'profile', component: UserProfileComponent},
    { path: 'products', component: ProductsComponent},
    { path: 'admin', component: AdminComponent}
];
