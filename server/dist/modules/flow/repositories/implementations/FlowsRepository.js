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
exports.FlowsRepository = void 0;
const prisma_1 = require("../../../../shared/infra/prisma");
class FlowsRepository {
    constructor() {
        this.ormRepository = prisma_1.prisma.flow;
    }
    create({ message, name, userId, buttons = [], }) {
        return __awaiter(this, void 0, void 0, function* () {
            const flow = yield this.ormRepository.create({
                data: {
                    message,
                    name,
                    userId,
                    button: {
                        create: {
                            name,
                            userId,
                        },
                    },
                    buttons: {
                        connect: buttons.map(button => ({
                            id: button.id,
                        })),
                    },
                },
            });
            return flow;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const flow = yield this.ormRepository.findUnique({
                where: {
                    id,
                },
            });
            return flow;
        });
    }
    findAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const flows = yield this.ormRepository.findMany({
                where: {
                    userId,
                },
                include: {
                    buttons: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
            return flows;
        });
    }
    findByName(name, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const flow = yield this.ormRepository.findUnique({
                where: {
                    name_createdBy: {
                        name,
                        userId,
                    },
                },
                include: {
                    buttons: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
            return flow;
        });
    }
    update({ id, message, name, oldName, userId, buttons = [], }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (name) {
                yield this.ormRepository.update({
                    where: {
                        id,
                    },
                    data: {
                        name,
                        message,
                        buttons: {
                            set: buttons.map(button => ({
                                id: button.id,
                            })),
                        },
                    },
                });
                yield prisma_1.prisma.button.update({
                    where: {
                        name_createdBy: {
                            name: oldName,
                            userId,
                        },
                    },
                    data: {
                        name,
                    },
                });
            }
            yield this.ormRepository.update({
                where: {
                    id,
                },
                data: {
                    message,
                    buttons: {
                        set: buttons.map(button => ({
                            id: button.id,
                        })),
                    },
                },
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ormRepository.delete({
                where: {
                    id,
                },
            });
        });
    }
}
exports.FlowsRepository = FlowsRepository;
