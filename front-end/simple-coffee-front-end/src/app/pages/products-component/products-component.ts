import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products-service';

@Component({
  selector: 'app-products-component',
  imports: [],
  templateUrl: './products-component.html',
  styleUrl: './products-component.css',
})
export class ProductsComponent implements OnInit {

  constructor(
    public productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.productsService.refreshProducts()
  }
  
}
