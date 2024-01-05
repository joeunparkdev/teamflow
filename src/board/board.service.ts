import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardDto } from './dto/board.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import _ from 'lodash';
import { UpdateBoardDto } from './dto/updateBoard.dto';
import { InvitataionDto } from './dto/invitation.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}
  async postBoard(boardDto: BoardDto) {
    const { name, backgroundColor, description } = boardDto;

    const postedBoard = await this.boardRepository.save({
      name,
      backgroundColor,
      description,
    });

    return postedBoard;
  }

  async updateBoard(boardId: number, updateBoardDto: UpdateBoardDto) {
    const updatedBoard = await this.findBoardById(boardId);
    const { name, backgroundColor, description } = updateBoardDto;

    // 위에도 그렇고 이상하게 description만 넣으면 문제가 생기네
    await this.boardRepository.update(boardId, {
      name,
      backgroundColor,
      description,
    });

    return updatedBoard;
  }

  async findBoardById(id: number) {
    const board = await this.boardRepository.findOne({ where: { id } });

    if (_.isNil(board)) {
      throw new NotFoundException('존재하지 않는 보드입니다.');
    }

    return board;
  }

  async deleteBoard(boardId: number) {
    await this.findBoardById(boardId);
    const deletedBoard = await this.boardRepository.delete({ id: boardId });

    return deletedBoard;
  }

  async inviteMember(member: InvitataionDto) {
    // 멤버 초대하는 로직
    // 1. user 테이블에 boardId 넣어서 관리
    // 2. board 테이블 에서 새로운 컬럼을 만들어 userId를 배열로 저장해 관리
    // 3. boardId와 userId가 연관되어 있는 새로운 테이블 만들어서 관리
    // 4. 중요한 정보가 아니기 때문에 db저장보다는 redis로 관리
  }
}
