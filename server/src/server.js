import express from "express";
import cors from "cors";
import routes from "./routes";

export function launch(port) {
  const application = express();
  const cors = require("cors")
  application.use(cors({
    origin: "*",
  }))
  application.use("/", routes);

  application.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
  });
}
