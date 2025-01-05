import axios, { AxiosRequestConfig } from "axios";

const USER_URL = (userId: string) => `${process.env.BASE_URL}/api/v2/users/${userId}`;

export async function changePassword(userId: string, newPassword: string, accessToken: string) {
  const data = {
    password: newPassword,
  };

  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const response = await axios.patch(USER_URL(userId), data, config);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || error.response.data.error_description);
  }
}
