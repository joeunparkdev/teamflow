import { BoardDto } from './dto/board.dto';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { UpdateBoardDto } from './dto/updateBoard.dto';
import { InvitataionDto } from './dto/invitation.dto';
export declare class BoardService {
    private readonly boardRepository;
    constructor(boardRepository: Repository<Board>);
    postBoard(boardDto: BoardDto): Promise<{
        name: string;
        backgroundColor: string;
        description: string;
    } & Board>;
    updateBoard(boardId: number, updateBoardDto: UpdateBoardDto): Promise<Board>;
    findBoardById(boardId: number): Promise<Board>;
    deleteBoard(boardId: number): Promise<import("typeorm").DeleteResult>;
    inviteMember(memberEmail: InvitataionDto): Promise<void>;
    sendEmail(email: object, data: object): Promise<void>;
}
