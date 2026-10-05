import "dotenv/config";

import { app } from "./App.js";
import "./Services/Queue/worker.service.js";

app.log.info({ msg: "WaveChat email worker started" });