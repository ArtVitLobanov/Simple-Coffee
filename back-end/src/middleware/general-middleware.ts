import type { Request, Response, NextFunction} from "express"
import { ViewModule } from "../modules/view-module.js"


export namespace GeneralMiddleware {
    export function notFound(req: Request, res: Response) {
      ViewModule.logEvent
      res.status(404).json({error: `Not found : ${req.originalUrl}`})
    }

    export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
      res.status(res.statusCode !== 200 ? res.statusCode : 500)
      res.json({error: error.message})
    }
}