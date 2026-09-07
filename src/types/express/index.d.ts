// Source - https://stackoverflow.com/questions/65848442/property-user-does-not-exist-on-type-requestparamsdictionary-any-any-pars
// Posted by Solz, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-28, License - CC BY-SA 4.0

import { JWTPayload } from "../../constants/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      uploadFiles: Record<string, string>;
    }
  }
}
