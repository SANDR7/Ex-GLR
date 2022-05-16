import { IronSessionOptions } from 'iron-session';

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'session',
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
};

declare module 'iron-session' {
  interface IronSessionData {
    // TODO: update types
    user?: object;
    isLoggedIn: boolean;
  }
}
