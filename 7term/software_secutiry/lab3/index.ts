import { getUserTokens } from "./getUserTokens";
import { refreshToken } from "./refreshToken";

import { getAccessToken } from "./getAccessToken";
import { changePassword } from "./changePassword";

// const { access_token, refresh_token } = await getUserTokens("d.knysh.ip11@kpi.ua", "46N$eFC8LD>");
// const data = await refreshToken(access_token, refresh_token);

const accessToken = await getAccessToken();
const data = await changePassword(
  "auth0|66dcac43114d462f666b2cf8",
  "NewTestPassword123",
  accessToken
);

console.log(data);
