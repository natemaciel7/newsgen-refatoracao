import { Request, Response } from "express";
import errorHandler from "../../src/middlewares/error-handler";
import httpStatus from "http-status";

function mockResponse() {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  res.sendStatus = jest.fn();
  return res;
}

describe("error handler middleware", () => {
  it("should return 500 for unknown error", () => {
    const req = {} as Request;
    const res = mockResponse();
    const next = jest.fn();
    const err = new Error("Some unexpected error");

    errorHandler(err, req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(
      httpStatus.INTERNAL_SERVER_ERROR
    );
  });
});
