import axios, { AxiosRequestConfig } from "axios";

const USERS_URL = `${process.env.BASE_URL}/api/v2/users`;

export async function createUser(email: string, password: string, accessToken: string) {
  const data = {
    email,
    password,
    connection: "Username-Password-Authentication",
  };

  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const response = await axios.post(USERS_URL, data, config);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || error.response.data.error_description);
  }
}
