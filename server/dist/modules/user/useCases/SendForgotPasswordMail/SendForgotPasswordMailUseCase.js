"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendForgotPasswordMailUseCase = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const path_1 = require("path");
const tsyringe_1 = require("tsyringe");
const AppError_1 = require("../../../../errors/AppError");
const constants_1 = require("../../../../utils/constants");
let SendForgotPasswordMailUseCase = class SendForgotPasswordMailUseCase {
    constructor(accountsRepository, mailProvider) {
        this.accountsRepository = accountsRepository;
        this.mailProvider = mailProvider;
    }
    execute({ email }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.accountsRepository.findByEmail(email);
            if (!user)
                throw new AppError_1.AppError('Account not found', 404);
            const templatePath = (0, path_1.resolve)(__dirname, '..', '..', 'views', 'forgotPassword.hbs');
            const token = (0, jsonwebtoken_1.sign)({}, constants_1.JWT_SECRET, {
                subject: user.id,
                expiresIn: '3h',
            });
            console.log('🚀 ~ file: SendForgotPasswordMailUseCase.ts ~ line 42 ~ SendForgotPasswordMailUseCase ~ execute ~ token', token);
            const variables = {
                name: user.name,
                link: `${process.env.RESET_PASSWORD_URL}${token}`,
            };
            yield this.mailProvider.sendMail(email, '[Flow] - Recuperação de Senha', variables, templatePath);
            return token;
        });
    }
};
SendForgotPasswordMailUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('UsersRepository')),
    __param(1, (0, tsyringe_1.inject)('MailProvider')),
    __metadata("design:paramtypes", [Object, Object])
], SendForgotPasswordMailUseCase);
exports.SendForgotPasswordMailUseCase = SendForgotPasswordMailUseCase;
