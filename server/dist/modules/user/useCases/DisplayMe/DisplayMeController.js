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
exports.DisplayMeController = void 0;
const tsyringe_1 = require("tsyringe");
const DisplayMeUseCase_1 = require("./DisplayMeUseCase");
class DisplayMeController {
    handle(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.user;
            const displayMe = tsyringe_1.container.resolve(DisplayMeUseCase_1.DisplayMeUseCase);
            const user = yield displayMe.execute(id);
            delete user.password;
            return response.json(user);
        });
    }
}
exports.DisplayMeController = DisplayMeController;
