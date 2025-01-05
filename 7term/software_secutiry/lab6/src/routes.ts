import { Router } from "express";
import axios from "axios";
import { checkJwt, checkUserInfoScope } from "./middleware";
import qs from "node:querystring";

const router = Router();

router.get("/", async (req, res, next) => {
  const { code } = req.query;

  if (code) {
    try {
      res.redirect(`/callback?code=${code}`);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Authentication failed" });
    }
  } else {
    next("route");
  }
});

router.get("/userinfo", checkJwt, checkUserInfoScope, async (req, res) => {
  const auth = req.auth;
  const accessToken = auth.token;

  try {
    const response = await axios.get(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.json({
      user: response.data,
    });
  } catch (error) {
    console.error(error);
  }
});

router.get("/login", async (_req, res) => {
  const authURL = `https://${process.env.AUTH0_DOMAIN}/authorize`;
  const params = qs.stringify({
    response_type: "code",
    client_id: process.env.AUTH0_CLIENT_ID,
    redirect_uri: process.env.AUTH0_CALLBACK_URL,
    scope: "openid profile",
    audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
  });

  const loginURL = `${authURL}?${params}`;
  res.redirect(loginURL);
});

router.get("/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const response = await axios.post(
      `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      qs.stringify({
        grant_type: "authorization_code",
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        code: code as string,
        redirect_uri: process.env.AUTH0_CALLBACK_URL,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = response.data;

    res.redirect(`/?token=${access_token}`);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Authentication failed" });
  }
});

export default router;
