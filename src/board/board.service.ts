import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardDto } from './dto/board.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import _ from 'lodash';
import { UpdateBoardDto } from './dto/updateBoard.dto';
import { InvitationDto } from './dto/invitation.dto';
import nodemailer from 'nodemailer';
import { VerificationCode } from './entities/verificationCode.entity';
import { promisify } from 'util';
import { randomBytes } from 'crypto';


const randomBytesAsync = promisify(randomBytes);
@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(VerificationCode)
    private readonly verificationCodeRepository: Repository<VerificationCode>,
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


  async inviteMember(invitationDto: InvitationDto) {
    const {memberEmail} = invitationDto
    const verificationCode = await this.createVerificationCode(memberEmail)
    
    const email = {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };

    const content = {
      from: process.env.EMAIL_USER,
      to: `${memberEmail}`,
      subject: '보드 초대 확인 인증 번호',
      text: `${verificationCode}`,
    };

    await this.sendEmail(email, content);

    return memberEmail
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

  async createVerificationCode(memberEmail:string) {
    const verificationCode = (await randomBytesAsync(6)).toString('hex');

    const expiry = new Date();
    await this.verificationCodeRepository.save({
      email: memberEmail,
      code: verificationCode,
      expiry
    })

    return verificationCode
  }
}
