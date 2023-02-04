import { User } from "../../models/User";

export {}

declare global {
  namespace Express {
    export interface Request {
      user?: User;
      files?: any;
    }
  }
}
