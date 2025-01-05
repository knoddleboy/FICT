import axios, { AxiosRequestConfig } from "axios";

const AUDIENCE = `${process.env.BASE_URL}/api/v2/`;
const TOKEN_URL = `${process.env.BASE_URL}/oauth/token`;

export async function getAccessToken() {
  const data = {
    audience: AUDIENCE,
    grant_type: "client_credentials",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  };

  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.post(TOKEN_URL, data, config);
    return response.data.access_token;
  } catch (error) {
    throw new Error(error.response.data.message || error.response.data.error_description);
  }
}
