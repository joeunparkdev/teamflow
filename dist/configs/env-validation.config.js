"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configModuleValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.configModuleValidationSchema = joi_1.default.object({
    SERVER_PORT: joi_1.default.number().required().default(3000),
    DB_HOST: joi_1.default.string().required(),
    DB_PORT: joi_1.default.number().required().default(3306),
    DB_USERNAME: joi_1.default.string().required(),
    DB_PASSWORD: joi_1.default.string().required(),
    DB_NAME: joi_1.default.string().required(),
    DB_SYNC: joi_1.default.boolean().required().default(true),
    PASSWORD_HASH_ROUNDS: joi_1.default.number().required().default(10),
    JWT_SECRET: joi_1.default.string().required(),
});
//# sourceMappingURL=env-validation.config.js.map