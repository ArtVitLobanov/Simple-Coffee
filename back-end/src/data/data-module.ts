import mongoose from "mongoose"
// This component provides data objects
export namespace DataModule {

    export class UserData{
        public _id: string
        public name: string
        public password: string
        public role: string
        public orders: Array<OrderData>

        constructor(_id: string, name: string, password: string, role: string) {
            this._id = _id
            this.name = name
            this.password=password
            this.role = role
            this.orders = []
        }

        addOrder(order: OrderData){
            this.orders.push(order)
        }

    }

    export class UserProfileData {
        public _id: string
        public name: string
        public role: string
        public orders: Array<OrderData>

        constructor(_id: string, name: string, role: string) {
            this._id = _id
            this.name = name
            this.role = role
            this.orders = []
        }

        addOrder(order: OrderData){
            this.orders.push(order)
        }
    }

    export class ProductData {
        public _id: string
        public name: string
        public description: string
        public amount: number
        public price: number
        public image: string

        constructor(name: string, description: string, amount: number,
             price: number, image: string, _id?: string, ) {
            this._id = _id || new mongoose.Types.ObjectId().toString();
            this.name = name
            this.description = description
            this.amount = amount
            this.price = price
            this.image = image
        }
    }

    export class ProductUpdateForm {
        public productID: string
        public newName: string
        public newDescription: string
        public amount: number = 1
        public newPrice: number
        public newImage: string

        constructor(productID: string, newName: string, newDesc: string, newPrice: number, newImage: string) {
            this.productID = productID
            this.newName = newName
            this.newDescription = newDesc
            this.newPrice = newPrice
            this.newImage = newImage
        }
    }

    export class OrderData {
        public _id: string | undefined
        public products?: ProductData[]
        public price: number

        constructor(products: ProductData[], _id?: string, ) {
            this._id = _id || new mongoose.Types.ObjectId().toString();
            this.products = products
            this.price = 0
            
            if (products.length > 0) {
                for (const product of this.products){
                    this.price += product.price * product.amount
                }
            } 
            
        }

        addProduct(product: ProductData) {
            this.products?.push(product)
            this.price += product.price * product.amount
        }

    }
 
}