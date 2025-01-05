import { Router } from "express";
import axios from "axios";
import { checkJwt, checkUserInfoScope } from "./middleware";

const router = Router();

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
      logout: "http://localhost:3000/logout",
    });
  } catch (error) {
    console.error(error);
  }
});

router.post("/login", async (req, res) => {
  const { login, password } = req.body;

  try {
    const response = await axios({
      method: "post",
      url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: new URLSearchParams({
        grant_type: "http://auth0.com/oauth/grant-type/password-realm",
        username: login,
        password: password,
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
        scope: "offline_access openid", // openid is required for /userinfo endpoint
        realm: "Username-Password-Authentication",
      }),
    });

    const { access_token, refresh_token } = response.data;

    res.status(200).json({
      accessToken: access_token,
      refreshToken: refresh_token,
    });
  } catch (error) {
    console.error(error);
    const errorData = error.response?.data;
    res.status(400).json({ message: errorData.message || errorData.error_description });
  }
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: authData } = await axios({
      method: "post",
      url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: new URLSearchParams({
        audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
        grant_type: "client_credentials",
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
      }),
    });

    const response = await axios({
      method: "post",
      url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users`,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        authorization: `Bearer ${authData.access_token}`,
      },
      data: new URLSearchParams({
        email,
        password,
        connection: "Username-Password-Authentication",
      }),
    });

    res.status(201).json({});
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.response?.data.message });
  }
});

export default router;
