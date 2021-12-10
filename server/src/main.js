import { launch } from "./server";

const { PORT = 4242 } = process.env;
launch(PORT);
