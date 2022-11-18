"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const FlowsRepository_1 = require("../repositories/implementations/FlowsRepository");
tsyringe_1.container.registerSingleton('FlowsRepository', FlowsRepository_1.FlowsRepository);
