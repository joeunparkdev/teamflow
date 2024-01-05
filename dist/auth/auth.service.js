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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(configService, jwtService, userRepository) {
        this.configService = configService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }
    async signUp({ email, password, passwordConfirm, nickname }) {
        const isPasswordMatched = password === passwordConfirm;
        if (!isPasswordMatched) {
            throw new common_1.BadRequestException('비밀번호와 비밀번호 확인이 서로 일치하지 않습니다.');
        }
        const existedUser = await this.userRepository.findOneBy({ email });
        if (existedUser) {
            throw new common_1.BadRequestException('이미 가입 된 이메일 입니다.');
        }
        const hashRounds = this.configService.get('PASSWORD_HASH_ROUNDS');
        const hashedPassword = bcrypt_1.default.hashSync(password, hashRounds);
        const user = await this.userRepository.save({
            email,
            password: hashedPassword,
            nickname,
        });
        return this.signIn(user.id);
    }
    signIn(userId) {
        const payload = { id: userId };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }
    async validateUser({ email, password }) {
        const user = await this.userRepository.findOne({
            where: { email },
            select: { id: true, password: true },
        });
        const isPasswordMatched = bcrypt_1.default.compareSync(password, user?.password ?? '');
        if (!user || !isPasswordMatched) {
            return null;
        }
        return { id: user.id };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        jwt_1.JwtService,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map