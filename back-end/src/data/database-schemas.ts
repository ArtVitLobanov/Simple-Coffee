import { Schema, model } from "mongoose"

// Schemas for DB
const ProductSchema = new Schema({
    name: { type: String, required: true},
    description: { type: String, required: true, unique: false},
    price: { type: Number, required: true, unique: false},
    amount: { type: Number, required: true, unique: false},
    image: { type: String, required: false, unique: false},
    id: { type: Number, required: true, unique: false}
})

const OrderSchema = new Schema({
    products: { type: [ProductSchema], required: false, unique: false},
    price: { type: Number, required: true, unique: false}
})

const UserSchema = new Schema({
    name: { type: String, required: true, unique: false},
    password: { type: String, required: true},
    role: { type: String, required: true},
    orders: { type: [OrderSchema], required: false, unique: false}
}) 

const UserProfileSchema = new Schema({
    name: { type: String, required: true, unique: false},
    role: {type: String, require: true},
    orders: { type: [OrderSchema], required: false, unique: false}
})

export namespace DatabaseSchemas{
    export const User = model("User", UserSchema, "users")
    export const UserProfile = model("UserProfile", UserProfileSchema, "users")
    export const Product = model("Product", ProductSchema, "products")
}