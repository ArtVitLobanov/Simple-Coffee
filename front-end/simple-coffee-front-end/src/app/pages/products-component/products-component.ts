import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { BackendRequestService } from '../../services/backend-request-service';
import { GeneralService } from '../../services/general-services';
import { CartService } from '../../services/cart-service';
import { AuthService } from '../../services/auth-service';
import { DataModels } from '../../data-models/data-models';

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
    private cartService: CartService,
    private cdr: ChangeDetectorRef  
  ) {}

  ngOnInit(): void {
    this.isUserAdmin()
    this.refreshProducts()
  }

  refreshProducts() {
    this.errorMessage.set('')

    this.backendService.getProducts().subscribe({
      next: (data: any) => {
        this.products.set(data)
      },
      error: (err) => {
        if (this.isAdmin()){
          this.errorMessage.set('Products load failed' + err.message )
        } else {
          this.errorMessage.set('Products load failed')
        }
      }
    })
  }

  isUserAdmin(): void {
    this.backendService.isAdmin().subscribe({
      next: (isUserAdmin: boolean) => {
        this.isAdmin.set(isUserAdmin)
      },
      error: () => {
        this.isAdmin.set(false)
      }
    })
  }

  async onUpdateProduct( oldName: string, newName: string, newDescription: string, newPrice: number, files: FileList | null) {
    this.errorMessage.set('')
    let imageToSend: string = ""

    if (files && files.length > 0) {
    try {
      imageToSend = await this.generalService.readFileAsBase64(files[0]);
    } catch (err) {
      this.errorMessage.set("Error reading image file")
      return;
    }

    } else {
      const existingProduct = this.products().find(p => p.name === oldName);
      imageToSend = existingProduct?.image || "";
    }

      this.backendService.updateProduct(oldName, newName, newDescription, newPrice, imageToSend).subscribe({
        next: (res) => {
          this.refreshProducts()
        },
        error: (err) => {
          this.errorMessage.set('Product update failed' + err.message )
        }
      });

      this.refreshProducts()
      this.cdr.detectChanges()
}

  onAddToCart(product: DataModels.ProductData, selectedQuantity: number): void {
    const quant = selectedQuantity || 1;

    // Making new product object to avoid pointer sending
    const productToCart = new DataModels.ProductData(
      product.name,
      product.description,
      quant,
      product.price,
      product.image
    )

    this.cartService.addProductToOrderInCart(productToCart);
  }
}
