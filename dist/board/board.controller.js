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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const board_service_1 = require("./board.service");
const board_dto_1 = require("./dto/board.dto");
const updateBoard_dto_1 = require("./dto/updateBoard.dto");
const invitation_dto_1 = require("./dto/invitation.dto");
let BoardController = class BoardController {
    constructor(boardService) {
        this.boardService = boardService;
    }
    async postBoard(boardDto) {
        const postedBoard = await this.boardService.postBoard(boardDto);
        return {
            status: 201,
            message: '보드가 정상적으로 생성되었습니다.',
            data: postedBoard,
        };
    }
    async updateBoard(boardId, updateBoardDto) {
        const updatedBoard = await this.boardService.updateBoard(boardId, updateBoardDto);
        return {
            satus: 201,
            message: '보드가 정상적으로 변경되었습니다.',
            data: updatedBoard,
        };
    }
    async deleteBoard(boardId) {
        const deletedBoard = await this.boardService.deleteBoard(boardId);
        return {
            statusCode: 200,
            message: '보드가 정상적으로 삭제되었습니다.',
            data: deletedBoard,
        };
    }
    async getBoard(boardId) {
        const board = await this.boardService.findBoardById(boardId);
        return {
            statusCode: 200,
            message: '보드가 정상적으로 조회되었습니다.',
            data: board,
        };
    }
    async inviteMember(memberEmail) {
        const invitedMember = await this.boardService.inviteMember(memberEmail);
        return {
            statusCode: 201,
            message: '',
            data: invitedMember,
        };
    }
};
exports.BoardController = BoardController;
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [board_dto_1.BoardDto]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "postBoard", null);
__decorate([
    (0, common_1.Put)(':boardId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, updateBoard_dto_1.UpdateBoardDto]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "updateBoard", null);
__decorate([
    (0, common_1.Delete)(':boardId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('boardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "deleteBoard", null);
__decorate([
    (0, common_1.Get)(':boardId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('boardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "getBoard", null);
__decorate([
    (0, common_1.Post)('/invite'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invitation_dto_1.InvitataionDto]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "inviteMember", null);
exports.BoardController = BoardController = __decorate([
    (0, common_1.Controller)('board'),
    __metadata("design:paramtypes", [board_service_1.BoardService])
], BoardController);
//# sourceMappingURL=board.controller.js.map