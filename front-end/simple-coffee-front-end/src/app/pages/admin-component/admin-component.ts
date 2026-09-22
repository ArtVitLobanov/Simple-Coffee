import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin-service';
import { ProductsService } from '../../services/products-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-admin-component',
  imports: [],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.css',
})
export class AdminComponent {
    constructor(
        public authService: AuthService,
        public productsService: ProductsService,
        public adminService: AdminService
    ) {}

    ngOnInit(){
        this.productsService.refreshProducts()
    }
}
