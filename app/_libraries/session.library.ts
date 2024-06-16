import { getIronSession } from 'iron-session';
import { SessionConfig, config } from '../_config/session.config';

export default class SessionLibrary {
  config: SessionConfig;

  constructor() {
    this.config = config;
  }

  get = async function (req: Request, res: Response) {
    const session = await getIronSession(req, res, { password: "...", cookieName: "..." });
  }

  post = async function (req: Request, res: Response) {
    const session = await getIronSession(req, res, { password: "...", cookieName: "..." });
    session.user = {
      name: 'Admin'
    }
    await session.save();
  }
}