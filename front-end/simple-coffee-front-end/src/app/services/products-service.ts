import { Injectable, signal } from "@angular/core";
import { BackendRequestService } from "./backend-request-service";
import { AuthService } from "./auth-service";
import { DataModels } from "../data-models/data-models";
import { CartService } from "./cart-service";
import { GeneralService } from "./general-services";

@Injectable({
    providedIn: 'root'
})
export class ProductsService {

    errorMessage = signal<string>('')
    products = signal<DataModels.ProductData[]>([])

    constructor(
        private backendService: BackendRequestService,
        private authService: AuthService,
        private cartService: CartService,
        private generalService: GeneralService
    ) {}

    async refreshProducts() {
        this.errorMessage.set('')

        this.backendService.getProducts().subscribe({
            next: (data: any) => {
                this.products.set(data)
            },
            error: (err) => {
                if (this.authService.isAdmin()){
                    this.errorMessage.set('Products load failed' + err.message )
                } else {
                    this.errorMessage.set('Products load failed')
                }
            }
        })
    }

    async onCreateProduct(name: string, description: string, price: number, image: FileList | null) {
        this.errorMessage.set('')
        let imageToSend: string = ""

        if (image && image.length > 0) {
            try {
                imageToSend = await this.generalService.readFileAsBase64(image[0]);
            } catch (err) {
                this.errorMessage.set("Error reading image file")
                return;
            }
        }

        this.backendService.createProduct(name, description, price, imageToSend).subscribe({
            next: (res) => {
                this.refreshProducts()
            },
            error: (err) => {
                this.errorMessage.set('Product creation failed ' + err.message )
            }
        });

        this.refreshProducts()
    }

    async onDeleteProduct(productID: string) {
        this.errorMessage.set('')

        this.backendService.deleteProduct(productID).subscribe({
            next: (data: any) => {
                this.refreshProducts()
            },
            error: (err) => {
                this.errorMessage.set('Product deletion failed' + err.message )
            }
        })
    }

    async onUpdateProduct( productID: string, newName: string, newDescription: string, newPrice: number, files: FileList | null) {
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
            const existingProduct = this.products().find(p => p._id === productID);
            imageToSend = existingProduct?.image || "";
        }

        this.backendService.updateProduct(productID, newName, newDescription, newPrice, imageToSend).subscribe({
            next: (res) => {
                this.refreshProducts()
            },
            error: (err) => {
                this.errorMessage.set('Product update failed ' + err.message )
            }
        });

        this.refreshProducts()
}

    onAddToCart(product: DataModels.ProductData, selectedQuantity: number): void {
        const quant = selectedQuantity || 1;

        // Making new product object to avoid pointer sending
        const productToCart = new DataModels.ProductData(
            product._id,
            product.name,
            product.description,
            quant,
            product.price,
            product.image
        )

        this.cartService.addProductToOrderInCart(productToCart);
    }

}