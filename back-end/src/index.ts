
import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { ControlModule } from './modules/control-module.js'
import cors from "cors"
import session from "express-session"

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

const controlModule = new ControlModule()
controlModule.UTILITY_ConnectToDB()

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

app.get('/', controlModule.MIDDLEWARE_RequiredAuth, (req: Request, res: Response) => {
  res.send({
    "text": 'empty page'
  })
});

// Receives auth data (name and password)
app.post('/auth-client', (req: Request, res: Response) => controlModule.POST_AuthClient(req, res));

// Receives updateProductForm (look in data-module.ts)
app.post('/update-product', (req: Request, res: Response) => controlModule.POST_UpdateProduct(req, res))

// Makes transaction for current user
app.post('/make-transaction', controlModule.MIDDLEWARE_RequiredAuth, (req: Request, res: Response) => controlModule.POST_MakeTransaction(req, res))

// Returns all available products
app.get('/products', (req: Request, res: Response) => controlModule.GET_Products(req, res).then())

// Checks if user is admin
app.get('/is-admin', controlModule.MIDDLEWARE_RequiredAuth, (req: Request, res: Response) => controlModule.GET_IsAdmin(req, res))

// Returns user profile
app.get('/user-profile', controlModule.MIDDLEWARE_RequiredAuth, (req: Request, res: Response) => controlModule.GET_UserProfile(req, res))

app.use(controlModule.MIDDLEWARE_NotFound)
app.use(controlModule.MIDDLEWARE_ErrorHandler)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});