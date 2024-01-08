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
exports.BoardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const board_entity_1 = require("./entities/board.entity");
const lodash_1 = __importDefault(require("lodash"));
const nodemailer_1 = __importDefault(require("nodemailer"));
let BoardService = class BoardService {
    constructor(boardRepository) {
        this.boardRepository = boardRepository;
    }
    async postBoard(boardDto) {
        const { name, backgroundColor, description } = boardDto;
        const postedBoard = await this.boardRepository.save({
            name,
            backgroundColor,
            description,
        });
        return postedBoard;
    }
    async updateBoard(boardId, updateBoardDto) {
        const updatedBoard = await this.findBoardById(boardId);
        const { name, backgroundColor, description } = updateBoardDto;
        await this.boardRepository.update(boardId, {
            name,
            backgroundColor,
            description,
        });
        return updatedBoard;
    }
    async findBoardById(boardId) {
        const board = await this.boardRepository.findOne({
            where: { id: boardId },
        });
        if (lodash_1.default.isNil(board)) {
            throw new common_1.NotFoundException('존재하지 않는 보드입니다.');
        }
        return board;
    }
    async deleteBoard(boardId) {
        await this.findBoardById(boardId);
        const deletedBoard = await this.boardRepository.delete({ id: boardId });
        return deletedBoard;
    }
    async inviteMember(memberEmail) {
        const email = {
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        };
        const content = {
            from: process.env.EMAIL_USER,
            to: 'rladbscks95@gmail.com',
            subject: '이메일 테스트 제목입니다.',
            text: '이메일 테스트 제목에 따른 내용입니다.',
        };
        await this.sendEmail(email, content);
    }
    async sendEmail(email, data) {
        nodemailer_1.default.createTransport(email).sendMail(data, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log(info);
                return info.response;
            }
        });
    }
};
exports.BoardService = BoardService;
exports.BoardService = BoardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(board_entity_1.Board)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], BoardService);
//# sourceMappingURL=board.service.js.map