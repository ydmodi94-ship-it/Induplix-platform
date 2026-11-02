import type { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

export const REQUEST_ID_HEADER = "x-request-id";

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const existingId = req.headers[REQUEST_ID_HEADER];
  const requestId = typeof existingId === "string" && existingId.trim() ? existingId.trim() : uuidv4();

  req.headers[REQUEST_ID_HEADER] = requestId;
  (req as any).id = requestId;
  res.setHeader(REQUEST_ID_HEADER, requestId);

  next();
}

