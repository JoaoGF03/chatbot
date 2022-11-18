"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const BcryptHashProvider_1 = require("./implementations/BcryptHashProvider");
tsyringe_1.container.registerSingleton('HashProvider', BcryptHashProvider_1.BcryptHashProvider);
