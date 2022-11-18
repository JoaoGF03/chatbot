"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const SESMailProvider_1 = require("./implementations/SESMailProvider");
tsyringe_1.container.registerInstance('MailProvider', tsyringe_1.container.resolve(SESMailProvider_1.SESMailProvider));
