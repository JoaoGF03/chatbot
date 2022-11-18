"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const ButtonsRepository_1 = require("../repositories/implementations/ButtonsRepository");
tsyringe_1.container.registerSingleton('ButtonsRepository', ButtonsRepository_1.ButtonsRepository);
