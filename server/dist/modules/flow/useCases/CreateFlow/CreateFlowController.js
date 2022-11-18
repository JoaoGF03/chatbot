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
exports.CreateFlowController = void 0;
const tsyringe_1 = require("tsyringe");
const CreateFlowUseCase_1 = require("./CreateFlowUseCase");
class CreateFlowController {
    handle(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, message, buttons } = request.body;
            const { id } = request.user;
            const createFlowUseCase = tsyringe_1.container.resolve(CreateFlowUseCase_1.CreateFlowUseCase);
            const flow = yield createFlowUseCase.execute({
                name,
                message,
                buttons,
                userId: id,
            });
            return response.status(201).json(flow);
        });
    }
}
exports.CreateFlowController = CreateFlowController;
