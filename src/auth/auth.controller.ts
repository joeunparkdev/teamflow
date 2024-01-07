import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Headers,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { EmailVerifyDto } from './dtos/email-verify.dto';
import { EmailService } from 'src/email/email.service';
import { VerifyCodeDto } from './dtos/verify-code.dto';
import { extractTokenFromHeader } from 'src/helpers/auth.helper';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * 회원가입
   * @param signUpDto
   * @returns
   */
  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const data = await this.authService.signUp(signUpDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: '회원가입에 성공했습니다.',
      data,
    };
  }

  /**
   * 로그인
   * @param req
   * @param signInDto
   * @returns
   */
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  @Post('/sign-in')
  signIn(@Request() req, @Body() signInDto: SignInDto) {
    const data = this.authService.signIn(req.user.id);

    return {
      statusCode: HttpStatus.OK,
      message: '로그인에 성공했습니다.',
      data,
    };
  }

  /**
   * 엑세스 토큰 재발급 API
   * @param req
   * @returns {Object} statusCode, message, accessToken
   */
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() req) {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const token = extractTokenFromHeader(authHeader);
    console.log(token);
    const accessToken = await this.authService.refreshToken(req.user.id, token);

    return {
      statusCode: HttpStatus.OK,
      message: '토큰 재발급에 성공했습니다.',
      accessToken,
    };
  }

  /**
   * 이메일 인증 (비밀번호 분실시)
   * @param emailVerifyDto - 사용자 이메일 및 인증 관련 정보를 담은 DTO
   * @returns 인증 번호를 이메일로 전송한 결과 메시지
   */
  @HttpCode(HttpStatus.OK)
  @Post('/send-verification-email')
  async sendVerificationEmail(@Body() emailVerifyDto: EmailVerifyDto) {
    const { email } = emailVerifyDto; // EmailVerifyDto에서 email 추출
    const verificationCode =
      await this.emailService.generateVerificationCode(email);

    if (!verificationCode) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: '인증 코드 생성에 실패했습니다.',
      };
    }

    const emailSent = await this.emailService.sendVerificationEmail(email);

    if (!emailSent) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: '이메일 전송에 실패했습니다.',
      };
    }

    return {
      statusCode: HttpStatus.OK,
      message: '이메일 인증 코드를 전송했습니다.',
    };
  }

  /**
   * 인증 번호 검증
   * @param verifyCodeDto - 사용자 이메일 및 인증 번호 비교
   * @returns 인증 결과 메시지
   */
  @HttpCode(HttpStatus.OK)
  @Post('/verify-code')
  async verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    const { email, verificationCode } = verifyCodeDto;

    const verificationResult = await this.emailService.verifyCode(
      email,
      verificationCode,
    );

    if (verificationResult) {
      return {
        statusCode: HttpStatus.OK,
        message: '인증 성공',
      };
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: '인증 실패',
      };
    }
  }

   /**
   * 비밀번호 재설정
   * @param resetPasswordDto 
   * @returns 비밀번호 재설정 결과 메시지
   */
    @HttpCode(HttpStatus.OK)
    @Post('/reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
      const { email, newPassword, verificationCode } = resetPasswordDto;
  
      const verificationResult = await this.emailService.verifyCode(
        email,
        verificationCode,
      );
  
      if (verificationResult) {
        await this.authService.resetPassword(email, newPassword);
  
        return {
          statusCode: HttpStatus.OK,
          message: '비밀번호 재설정에 성공했습니다.',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: '인증 실패',
        };
      }
    }
}
