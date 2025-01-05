import { auth, requiredScopes } from "express-oauth2-jwt-bearer";

export const checkJwt = auth({
  audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});

export const checkUserInfoScope = requiredScopes("openid");
