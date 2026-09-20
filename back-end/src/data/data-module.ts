
// This component provides data objects
export namespace DataModule {

    export class UserData{
        public name: string
        public id: string
        public password: string
        public role: string
        public orders: Array<OrderData>

        constructor(name: string, password: string, role: string, id: string) {
            this.name = name
            this.id = id
            this.password=password
            this.role = role
            this.orders = []
        }

        addOrder(order: OrderData){
            this.orders.push(order)
        }

    }

    export class UserProfileData {
        public name: string
        public role: string
        public orders: Array<OrderData>

        constructor(name: string, role: string) {
            this.name = name
            this.role = role
            this.orders = []
        }

        addOrder(order: OrderData){
            this.orders.push(order)
        }
    }

    export class ProductData {
        public name: string
        public description: string
        public amount: number
        public price: number
        public image: string

        constructor(name: string, description: string, amount: number, price: number, image: string) {
            this.name = name
            this.description = description
            this.amount = amount
            this.price = price
            this.image = image
        }
    }

    export class ProductUpdateForm {
        public oldName: string
        public newName: string
        public newDescription: string
        public amount: number = 1
        public newPrice: number
        public newImage: string

        constructor(oldName: string, newName: string, newDesc: string, newPrice: number, newImage: string) {
            this.oldName = oldName
            this.newName = newName
            this.newDescription = newDesc
            this.newPrice = newPrice
            this.newImage = newImage
        }
    }

    export class OrderData {
        public products?: Array<ProductData>
        public price: number

        constructor(products: Array<ProductData>) {
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