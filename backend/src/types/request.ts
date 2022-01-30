import { IncomingHttpHeaders } from "http";
import { Request } from "express";
import { IUser } from "./user";

interface CustomRequest extends Request {
  user: IUser;
  headers: IncomingHttpHeaders & {
    "X-Auth-Provider"?: string;
  };
}

export { CustomRequest };
