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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const user_entity_1 = require("../../user/entities/user.entity");
class SignUpDto extends (0, swagger_1.PickType)(user_entity_1.User, [
    'email',
    'password',
    'name',
]) {
    static _OPENAPI_METADATA_FACTORY() {
        return { passwordConfirm: { required: true, type: () => String, description: "\uBE44\uBC00\uBC88\uD638 \uD655\uC778", example: "Ex@mp1e!!" } };
    }
}
exports.SignUpDto = SignUpDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: '비밀번호 확인을 입력해 주세요.' }),
    (0, class_validator_1.IsStrongPassword)({}, {
        message: '비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함해서 8자리 이상으로 입력해야 합니다.',
    }),
    __metadata("design:type", String)
], SignUpDto.prototype, "passwordConfirm", void 0);
//# sourceMappingURL=sign-up.dto.js.map