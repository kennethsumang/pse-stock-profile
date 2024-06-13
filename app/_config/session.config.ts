export interface SessionConfig {
  password: string;
  cookieName: string;
  cookieOptions: {
    secure: boolean;
  }
}
export const config: SessionConfig = {
  password: process.env.SECRET_COOKIE_PASSWORD || '',
  cookieName: "myapp_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};