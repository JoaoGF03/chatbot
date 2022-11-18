"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const UsersRepository_1 = require("../repositories/implementations/UsersRepository");
tsyringe_1.container.registerSingleton('UsersRepository', UsersRepository_1.UsersRepository);
