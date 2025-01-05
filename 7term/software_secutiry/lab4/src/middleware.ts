import { NextFunction, Request, Response } from "express";
import axios from "axios";

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.headers["authorization"]?.split(" ")[1];

  if (!accessToken) {
    next("route");
    return;
  }

  const tokenPayload = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64").toString());
  const now = Math.floor(Date.now() / 1000);
  const timeLeft = tokenPayload.exp - now;

  // 10 seconds after issued
  if (timeLeft < 86390) {
    res.status(419).json({ message: "Token is about to expire." });
    return;
  }

  const response = await axios.get(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  req.user = {
    name: response.data.nickname,
  };

  next();
}
