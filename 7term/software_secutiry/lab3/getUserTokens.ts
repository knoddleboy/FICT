import axios, { AxiosRequestConfig } from "axios";

const AUDIENCE = `${process.env.BASE_URL}/api/v2/`;
const TOKEN_URL = `${process.env.BASE_URL}/oauth/token`;

export async function getUserTokens(username: string, password: string) {
  const data = {
    audience: AUDIENCE,
    grant_type: "http://auth0.com/oauth/grant-type/password-realm",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    username,
    password,
    scope: "offline_access",
    realm: "Username-Password-Authentication",
  };

  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.post(TOKEN_URL, data, config);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || error.response.data.error_description);
  }
}
