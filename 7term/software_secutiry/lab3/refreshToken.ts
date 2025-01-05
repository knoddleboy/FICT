import axios, { AxiosRequestConfig } from "axios";

const AUDIENCE = `${process.env.BASE_URL}/api/v2/`;
const TOKEN_URL = `${process.env.BASE_URL}/oauth/token`;

export async function refreshToken(accessToken: string, refreshToken: string) {
  const data = {
    grant_type: "refresh_token",
    audience: AUDIENCE,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    refresh_token: refreshToken,
  };

  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const response = await axios.post(TOKEN_URL, data, config);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || error.response.data.error_description);
  }
}
