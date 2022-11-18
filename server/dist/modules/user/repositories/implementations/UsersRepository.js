"use strict";
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
exports.UsersRepository = void 0;
const prisma_1 = require("../../../../shared/infra/prisma");
class UsersRepository {
    constructor() {
        this.ormRepository = prisma_1.prisma.user;
    }
    create({ email, name, password, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.ormRepository.create({
                data: {
                    email,
                    name,
                    password,
                },
            });
            yield prisma_1.prisma.flow.create({
                data: {
                    name: 'Welcome',
                    message: 'Welcome to the Flow bot!',
                    userId: user.id,
                },
            });
            return user;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.ormRepository.findUnique({
                where: {
                    email,
                },
            });
            return user;
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.ormRepository.findFirst({
                where: {
                    name,
                },
            });
            return user;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.ormRepository.findMany();
            return users;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.ormRepository.findUnique({
                where: {
                    id,
                },
            });
            return user;
        });
    }
    pathAvatar({ id, avatarFileName, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.ormRepository.update({
                where: {
                    id,
                },
                data: {
                    avatar: avatarFileName,
                },
            });
            return user;
        });
    }
    updatePassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ormRepository.update({
                where: {
                    id,
                },
                data: {
                    password,
                },
            });
        });
    }
}
exports.UsersRepository = UsersRepository;
