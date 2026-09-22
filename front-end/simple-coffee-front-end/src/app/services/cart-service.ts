import { Injectable, signal } from "@angular/core";
import { DataModels } from "../data-models/data-models";
import { Data } from "@angular/router";
import { BackendRequestService } from "./backend-request-service";
import { AuthService } from "./auth-service";

// This service provides the work of Cart component

@Injectable({
    providedIn: 'root'
})
export class CartService {
    orderInCart = signal<DataModels.OrderData>(new DataModels.OrderData())
    errorMessage = signal<string>('')

    constructor(
        public backendService: BackendRequestService,
        public authService: AuthService
    ) {}

    addProductToOrderInCart(product: DataModels.ProductData) {
        this.errorMessage.set('')
        const existingProduct = this.orderInCart().products.find(p => p._id === product._id);

        if (existingProduct) {
            // Product already in cart, just increase quantity
            existingProduct.amount += product.amount;
        } else {
            // New product, push to array with initial amount
            this.orderInCart().products.push({ ...product, amount: product.amount });
        }

        // Recalculate price
        this.orderInCart().price = this.orderInCart().products.reduce(
            (sum, p) => sum + (p.price * p.amount), 
            0
        );
    }

    getCartOrder() {
      return this.orderInCart
    }

    resetCart() {
      this.orderInCart.set(new DataModels.OrderData())
    }

    makeTransaction():void {
        this.errorMessage.set('')

        if (this.authService.isLoggedIn()){
            this.backendService.makeTransaction(this.orderInCart()).subscribe({
            next: (res) => {
                this.resetCart()
            },
            error: (err) => {
                if (this.authService.isAdmin()) {
                    this.errorMessage.set('Transaction failed ' + err.message )
                } else {
                    this.errorMessage.set('Transaction failed')
                }
            }
            });
        } else {
            this.errorMessage.set("Log in first")
        }
        
    }

    removeProductFromCart(productID: string) {
        this.errorMessage.set('')
      const currentOrder = this.orderInCart();

        const indexToRemove = currentOrder.products.findIndex(p => p._id === productID);

        if (indexToRemove !== -1) {
            currentOrder.products.splice(indexToRemove, 1);

            currentOrder.price = currentOrder.products.reduce(
            (sum, p) => sum + (p.price * p.amount), 
            0
            );
        }
    }
}