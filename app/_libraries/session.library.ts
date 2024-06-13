import { getIronSession } from 'iron-session';
import { SessionConfig, config } from '../_config/session.config';

export default class SessionLibrary {
  config: SessionConfig;

  constructor() {
    this.config = config;
  }
}

export function get(req: Request, res: Response) {
  const session = getIronSession(req, res, { password: "...", cookieName: "..." });
}

export function post(req: Request, res: Response) {
  const session = getIronSession(req, res, { password: "...", cookieName: "..." });
  session.username = "Alison";
  await session.save();
}