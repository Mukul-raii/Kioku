import {  Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const errrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
     console.log(err.stack);

    res.status(err.statusCode || 500).json({
      success:false,
      message:  "Something broke!",
      error: err.message || err,
    })
}


