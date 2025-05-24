import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { success } from 'zod/v4';

export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const errrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.status === 401) {
    res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid or missing token",
    });
    return;
  }

   if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors,
    });
    return;
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Something went wrong!",
  });
};

export const sendResponse=(res:Response,status:number,message:string ,data?:any ):void =>{
  res.status(status).json({
    success:status>=200 && status<300,
    message,
    data:{...data}
  })
}

export const sendError = (
  res: Response,
  status: number,
  message: string,
  error?: any
): void => {
  res.status(status).json({
    success: false,
    message,
    ...(error && { error })
  });
};


export const zodValidation = <T>(schema: ZodSchema<T>, data: unknown) => {
  const result = schema.safeParse(data);
  return result;
};
