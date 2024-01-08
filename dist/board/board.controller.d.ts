import { BoardService } from './board.service';
import { BoardDto } from './dto/board.dto';
import { UpdateBoardDto } from './dto/updateBoard.dto';
import { InvitataionDto } from './dto/invitation.dto';
export declare class BoardController {
    private readonly boardService;
    constructor(boardService: BoardService);
    postBoard(boardDto: BoardDto): Promise<{
        status: number;
        message: string;
        data: {
            name: string;
            backgroundColor: string;
            description: string;
        } & import("./entities/board.entity").Board;
    }>;
    updateBoard(boardId: number, updateBoardDto: UpdateBoardDto): Promise<{
        satus: number;
        message: string;
        data: import("./entities/board.entity").Board;
    }>;
    deleteBoard(boardId: number): Promise<{
        statusCode: number;
        message: string;
        data: import("typeorm").DeleteResult;
    }>;
    getBoard(boardId: number): Promise<{
        statusCode: number;
        message: string;
        data: import("./entities/board.entity").Board;
    }>;
    inviteMember(memberEmail: InvitataionDto): Promise<{
        statusCode: number;
        message: string;
        data: void;
    }>;
}
