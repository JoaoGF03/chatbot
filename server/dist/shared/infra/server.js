"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
require("./websocket");
app_1.httpServer.listen(3333, () => {
    // eslint-disable-next-line
    console.log('server is running on port 3333 🎉');
});
