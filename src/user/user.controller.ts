import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('사용자')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 내 정보 조회
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async findMe(@Request() req) {
    const userId = req.user.id;

    const data = await this.userService.findOneById(userId);

    return {
      statusCode: HttpStatus.OK,
      message: '내 정보 조회에 성공했습니다.',
      data,
    };
  }

  /**
   * 회원 탈퇴
   * @param req
   * @returns
   */
   @ApiBearerAuth()
   @UseGuards(JwtAuthGuard)
   @Delete('/me')
   async deleteMe(@Request() req) {
     const userId = req.user.id;
   
     const data = await this.userService.deleteId(userId);
   
     return {
       statusCode: HttpStatus.OK,
       message: '회원탈퇴에 성공했습니다.',
       data,
     };
   }
}
