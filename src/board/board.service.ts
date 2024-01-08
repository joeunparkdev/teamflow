import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardDto } from './dto/board.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import _ from 'lodash';
import { UpdateBoardDto } from './dto/updateBoard.dto';
import { InvitataionDto } from './dto/invitation.dto';
import nodemailer from 'nodemailer';

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

    await this.boardRepository.update(boardId, {
      name,
      backgroundColor,
      description,
    });

    return updatedBoard;
  }

  async findBoardById(boardId: number) {
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
      relations: { columns: { cards: { comments: true } } },
    });

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


  async inviteMember(memberEmail: InvitataionDto) {
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

  async sendEmail(email: object, data: object) {
    try {
      const transporter = nodemailer.createTransport(email);
      
      const info = await transporter.sendMail(data);
      
      console.log(info);
      return info.response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
