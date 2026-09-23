import type {Request, Response, NextFunction} from "express"

export namespace AuthMiddleware{

    export function authRequired(req: Request, res: Response, next: NextFunction) {
      if (req.session.userName && req.session.userId) {
        return next()
      }

      res.status(400).json({error: 'Please, log in first'});
    }

    export function adminRequired(req: Request, res: Response, next: NextFunction) {
      if (req.session.userRole == "admin") {
        return next()
      }

      res.status(400).json({message: 'Admin privilages required'})
    }

    
}

