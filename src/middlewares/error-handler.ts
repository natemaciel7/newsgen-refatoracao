import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

type AppError = Error & {
  type?: string;
};

const errorStatusMap: Record<string, number> = {
  NotFound: httpStatus.NOT_FOUND,
  Conflict: httpStatus.CONFLICT,
  BadRequest: httpStatus.BAD_REQUEST,
  UnprocessableEntity: httpStatus.UNPROCESSABLE_ENTITY,
  Forbidden: httpStatus.FORBIDDEN,
};

export default function errorHandler(
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(`[Error] ${error.name}: ${error.message}`);

  const statusCode =
    errorStatusMap[error.name] || httpStatus.INTERNAL_SERVER_ERROR;

  if (statusCode === httpStatus.INTERNAL_SERVER_ERROR) {
    return res.sendStatus(statusCode);
  }

  return res.status(statusCode).send(error.message);
}
