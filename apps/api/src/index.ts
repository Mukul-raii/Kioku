import { log } from "@repo/logger";
import { user } from "@repo/types";

import { configDotenv } from "dotenv";
import { app } from "./server";
configDotenv();

app.listen(process.env.PORT, () => {
  console.log("Server is Running", process.env.PORT);
});
