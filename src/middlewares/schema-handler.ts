import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import httpStatus from "http-status";

export function validateSchemaMiddleware(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const validationErrors = error.details.map((detail) => detail.message);
      return res
        .status(httpStatus.UNPROCESSABLE_ENTITY)
        .send({ errors: validationErrors });
    }
    next();
  };
}
