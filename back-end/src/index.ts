
import express, { type Express, type Request, type Response } from 'express';
import cors from "cors"
import session from "express-session"

import productsRoutes from "./routes/product-routes.js"
import authRoutes from "./routes/auth-routes.js"
import userRoutes from "./routes/user-routes.js"

import { connectToDB } from './config/db.js';
import { GeneralMiddleware } from './middleware/general-middleware.js';

//

// Expanding session
declare module 'express-session'{
  interface SessionData {
    userId? : string;
    userName? : string;
    userRole? : string;
  }
}

const app: Express = express();
const PORT = process.env.PORT || 3000;

connectToDB()

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}))

app.use(express.json({limit: '16mb'}));
app.use(express.urlencoded({extended: true}));
app.use(session({
  secret: "secret-key-5511%$",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1800000
  }
}))

// routes for products
app.use("/api/products", productsRoutes)

// routes for authorization
app.use("/api/auth", authRoutes)

// routes for user information
app.use("/api/users", userRoutes)

app.use(GeneralMiddleware.notFound)
app.use(GeneralMiddleware.errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});