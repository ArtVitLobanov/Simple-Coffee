import { DataModule } from "../data/data-module.js"
import { DatabaseSchemas } from "../data/database-schemas.js";
import { DTO } from "../data/dto-module.js";

// This "Model Module" holds logic
export class ModelModule {
    private currentUser?: DataModule.UserData | null
    private DTO: DTO

    constructor(){
        this.DTO = new DTO
    }

    async getUserFromDB(username: string, password: string) : Promise<DataModule.UserData | null> {
        let userDocument = await DatabaseSchemas.User.findOne({
            name: username,
            password: password
        })

        let user = this.DTO.userDTO(userDocument)

        if (!user) {
            return null
        } else { 
            this.currentUser = user
            return user
        }
    }

    async updateProduct(form: DataModule.ProductUpdateForm) {
        await DatabaseSchemas.Product.updateOne(
            { name: form.oldName},
            { $set: {
                    name: form.newName,
                    description: form.newDescription,
                    price: form.newPrice,
                    image: form.newImage
                }
            }
        )
    }

    async userOrderToDB(products: DataModule.ProductData[]) : Promise<void> {
        let order: DataModule.OrderData = new DataModule.OrderData(products)

        await DatabaseSchemas.User.updateOne(
            { _id: Object(this.currentUser?.id) }, 
            { $push: {
                    orders: order
                }
            })

        this.updateCurrentUser()
    }

    updateCurrentUser() {
        this.getUserFromDB(this.currentUser?.name!, this.currentUser?.password!)
    }

    getUserProfile() {
        if (this.currentUser){
            const userProfile: DataModule.UserProfileData = new DataModule.UserProfileData(
            this.currentUser?.name,
            this.currentUser?.role,
            )
            
            for (const orderDocument of this.currentUser.orders) {
                userProfile.addOrder(this.DTO.orderDTO(orderDocument)!)
            }

            return userProfile
        } else {
            return null
        }
    }

    async getProductsFromDB() : Promise<DataModule.ProductData[] | null> {
        let productsList = await DatabaseSchemas.Product.find()
        let products: DataModule.ProductData[] = []

        for (const productData of productsList){
            products.push(this.DTO.productDTO(productData)!)
        }

        return products
    }

}