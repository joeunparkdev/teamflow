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

  // 나중에 중요 내용들 .env에 포함시키기
  async inviteMember(memberEmail: InvitataionDto) {
    const email = {
      // host: 'sandbox.smtp.mailtrap.io',
      // port: 2525,
      // secure: false,
      // auth: {
      //   user: 'd84940eb5ced50',
      //   pass: 'b9e7444fe50a24',
      // },
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
  // error문제에서 try catch로 바꾸기
  async sendEmail(email: object, data: object) {
    nodemailer.createTransport(email).sendMail(data, function (error, info) {
      if (error) {
        console.log(error);
        console.log('zz');
      } else {
        console.log(info);
        return info.response;
      }
    });
  }
}
