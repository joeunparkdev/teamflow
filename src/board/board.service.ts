import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { CodeDto } from './dto/code.dto';
import { EmailVerification } from 'src/email/entities/email.entity';
import { BoardUser } from 'src/board-user/entities/boardUser.entity';
import { User } from 'src/user/entities/user.entity';

const randomBytesAsync = promisify(randomBytes);
@Injectable()
export class BoardService {
  private readonly expiry_duration = 3 * 60 * 1000; // 3분
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(VerificationCode)
    private readonly verificationCodeRepository: Repository<VerificationCode>,
    @InjectRepository(BoardUser)
    private readonly boardUserRepository: Repository<BoardUser>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async postBoard(userId, boardDto: BoardDto) {
    const { name, backgroundColor, description } = boardDto;

    const postedBoard = await this.boardRepository.save({
      name,
      backgroundColor,
      description,
      creator: userId,
    });

    return postedBoard;
  }

  async updateBoard(userId, boardId: number, updateBoardDto: UpdateBoardDto) {
    const user = await this.boardUserRepository.findOne({
      where: { userId, boardId },
    });

    if (!user) {
      throw new NotFoundException('보드 수정 권한이 없는 유저입니다.');
    }

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

  async deleteBoard(userId: number, boardId: number) {
    const board = await this.findBoardById(boardId);

    if (!board) {
      throw new NotFoundException('해당하는 보드가 존재하지 않습니다.');
    }

    const user = await this.boardRepository.findOne({
      where: { creator: userId },
    });

    if (!user) {
      throw new BadRequestException('보드를 생성한 유저만 삭제가 가능합니다.');
    }
    const deletedBoard = await this.boardRepository.delete({ id: boardId });

    return deletedBoard;
  }

  // 멤버 초대
  async inviteMember(invitationDto: InvitationDto) {
    const { memberEmail } = invitationDto;
    const verificationCode = await this.createVerificationCode(memberEmail);

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

    return memberEmail;
  }

  // 이메일 전송
  async sendEmail(email: object, data: object) {
    nodemailer.createTransport(email).sendMail(data, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(info);
        return info.response;
      }
    });
  }

  // 인증 코드 생성 및 DB 저장
  async createVerificationCode(memberEmail: string) {
    const verificationCode = (await randomBytesAsync(6)).toString('hex');

    const expiry = new Date();
    expiry.setTime(expiry.getTime() + this.expiry_duration);

    await this.verificationCodeRepository.save({
      email: memberEmail,
      code: verificationCode,
      expiry,
    });

    return verificationCode;
  }

  // 인증 코드 확인
  async verifyCode(email, code, boardId) {
    const savedCode = await this.verificationCodeRepository.findOne({
      where: { code },
    });

    const user = await this.userRepository.findOne({ where: { email } });
    console.log(1);

    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    if (user.email !== email) {
      throw new BadRequestException(
        '입력한 이메일과 등록된 이메일이 다릅니다.',
      );
    }
    if (!savedCode) {
      throw new NotFoundException('인증 코드가 존재하지 않습니다.');
    }
    console.log(2);
    if (Date.now() > savedCode.expiry.getTime()) {
      await this.verificationCodeRepository.delete({ email });
      throw new BadRequestException('인증 시간이 초과되었습니다.');
    }
    console.log(3);
    if (savedCode.code === code) {
      // board-user에 userId와 boardId 집어넣기

      console.log(user);
      const userId = user.id;
      const boardUser = await this.boardUserRepository.save({
        userId,
        boardId,
      });
      console.log(4);
      //boardUser row값 보내기;
      return boardUser;
    }
  }
}
