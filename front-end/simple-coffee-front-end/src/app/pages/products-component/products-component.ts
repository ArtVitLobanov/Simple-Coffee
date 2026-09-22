import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { BackendRequestService } from '../../services/backend-request-service';
import { GeneralService } from '../../services/general-services';
import { AuthService } from '../../services/auth-service';
import { DataModels } from '../../data-models/data-models';
import { ProductsService } from '../../services/products-service';

@Component({
  selector: 'app-products-component',
  imports: [],
  templateUrl: './products-component.html',
  styleUrl: './products-component.css',
})
export class ProductsComponent implements OnInit {
  products = signal<DataModels.ProductData[]>([])
  errorMessage = signal<string>('')
  isAdmin = signal<boolean>(false)

  constructor(
    public authService: AuthService,
    public generalService: GeneralService,
    private backendService: BackendRequestService,
    public productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.productsService.refreshProducts()
  }
  
}
