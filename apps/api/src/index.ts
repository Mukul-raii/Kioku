import { log } from "@repo/logger";
import { configDotenv } from "dotenv";
import { app } from "./server";

configDotenv();

app.listen(process.env.PORT, () => {
  log("Server is Running", process.env.PORT);
});
 
