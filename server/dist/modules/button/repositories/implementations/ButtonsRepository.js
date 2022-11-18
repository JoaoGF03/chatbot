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
exports.ButtonsRepository = void 0;
const prisma_1 = require("../../../../shared/infra/prisma");
class ButtonsRepository {
    constructor() {
        this.ormRepository = prisma_1.prisma.button;
    }
    // public async create({ name, userId }: ICreateButtonDTO): Promise<Button> {
    //   const button = await this.ormRepository.create({
    //     data: {
    //       name,
    //       userId,
    //     },
    //   });
    //   return button;
    // }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const button = yield this.ormRepository.findUnique({
                where: {
                    id,
                },
            });
            return button;
        });
    }
    findAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const buttons = yield this.ormRepository.findMany({
                where: {
                    userId,
                },
                select: {
                    id: true,
                    name: true,
                },
            });
            return buttons;
        });
    }
    findByName(name, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const button = yield this.ormRepository.findUnique({
                where: {
                    name_createdBy: {
                        name,
                        userId,
                    },
                },
            });
            return button;
        });
    }
}
exports.ButtonsRepository = ButtonsRepository;
