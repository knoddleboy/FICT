import { getAccessToken } from "./getAccessToken";
import { createUser } from "./createUser";

const token = await getAccessToken();
const userData = await createUser("test@test.com", "489", token);

console.log(userData);
