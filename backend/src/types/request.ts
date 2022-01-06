import { IncomingHttpHeaders } from "http";
import { Request } from "express";
import { IUSer } from "./user";

interface CustomRequest extends Request {
  user?: IUSer;
  headers: IncomingHttpHeaders & {
    "X-Auth-Provider"?: string;
  };
}

export { CustomRequest };
