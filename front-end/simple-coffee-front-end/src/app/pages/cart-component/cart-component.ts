import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { BackendRequestService } from '../../services/backend-request-service';
import { CartService } from '../../services/cart-service';
import { DataModels } from '../../data-models/data-models';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-cart-component',
  imports: [],
  templateUrl: './cart-component.html',
  styleUrl: './cart-component.css',
})
export class CartComponent implements OnInit {
  errorMessage = signal<string>('')
  order: DataModels.OrderData = new DataModels.OrderData()

  constructor(
    public cartService: CartService,
  ) {}

  ngOnInit(): void {
  }

  onRemoveProduct(productToRemove: DataModels.ProductData): void {
    this.cartService.removeProductFromOrderInCart(productToRemove);
  }

  onMakeTransaction(order: DataModels.OrderData,) {
    this.cartService.makeTransaction()
  }
}
