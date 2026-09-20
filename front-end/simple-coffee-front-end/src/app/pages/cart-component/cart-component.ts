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
    private backendService: BackendRequestService,
    private authService:  AuthService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef  
  ) {}

  ngOnInit(): void {
    this.order = this.cartService.getCartOrder()
    this.cdr.detectChanges()
  }

  onRemoveProduct(productToRemove: DataModels.ProductData): void {
    this.cartService.removeProductFromOrderInCart(productToRemove);
    this.order = this.cartService.getCartOrder();
    this.cdr.detectChanges();
  }

  onMakeTransaction(order: DataModels.OrderData,) {
    this.backendService.makeTransaction(order).subscribe({
      next: (res) => {
        this.cartService.resetCart()
        this.order = this.cartService.getCartOrder()
        this.cdr.detectChanges()
      },
      error: (err) => {
        if (this.authService.isAdmin()) {
          this.errorMessage.set('Transaction failed ' + err.message )
        } else {
          this.errorMessage.set('Transaction failed')
        }
      }
    });
  }
}
