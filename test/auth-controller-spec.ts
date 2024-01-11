
import { EmailService } from '../src/email/email.service';
import { UserService } from '../src/user/user.service';

import { HttpStatus } from '@nestjs/common';
import { AuthController } from '@/auth/auth.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@/auth/auth.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '@/auth/guards/jwt-refresh.guard';
import { User } from '@/user/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, EmailService, UserService],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(JwtRefreshGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('signUp', () => {
    it('should sign up a user successfully', async () => {
      const signUpDto = { 
        
            "passwordConfirm": "Ex@mp1e!!",
            "email": "example@example.com",
            "password": "Ex@mp1e!!",
            "name": "홍길동"
          
       };
      jest.spyOn(controller['authService'], 'signUp').mockResolvedValue({ "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzA0ODcyOTY5LCJleHAiOjE3MDQ5MTYxNjl9.URx2Ao4W9GWwhHDyqP0MAMOiwUT76Ba80DsxYjA0efg",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzA0ODcyOTY5LCJleHAiOjE3MDU0Nzc3Njl9.Z3Syx_70J49-TTYmTqBZDJ3Kjbz9eIrvpb51Zvh5bW4"});

      const result = await controller.signUp(signUpDto);

      expect(result.statusCode).toEqual(HttpStatus.CREATED);
      expect(result.message).toEqual('회원가입에 성공했습니다.');
      expect(result.data).toBeDefined();
    });

    it('should handle sign up with existing email', async () => {
      const signUpDto = {
        "email": "example@example.com",
        "password": "Ex@mp1e!!"
      };
      jest.spyOn(controller['userService'], 'findOneByEmail').mockResolvedValue({});

      const result = await controller.signUp(signUpDto);

      expect(result.statusCode).toEqual(HttpStatus.CONFLICT);
      expect(result.message).toEqual('이미 등록된 이메일 주소입니다.');
    });
  });

  describe('signIn', () => {
    it('should sign in a user successfully', async () => {
      const signInDto = {
        "email": "example@example.com",
        "password": "Ex@mp1e!!"
      };
      const user = {     "id": 1,
      "email": "example@example.com",
      "name": "홍길동",
      "phone": null,
      "birthdate": null,
      "role": "User",
      "status": "Active",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzA0ODcyOTY5LCJleHAiOjE3MDU0Nzc3Njl9.Z3Syx_70J49-TTYmTqBZDJ3Kjbz9eIrvpb51Zvh5bW4",
      "kakaoId": null,
      "googleId": null,
      "appleId": null,
      "createdAt": "2024-01-09T22:33:47.012Z",
      "updatedAt": "2024-01-09T22:49:29.000Z" };
      jest.spyOn(controller['authService'], 'signIn').mockResolvedValue(user);

      const result = await controller.signIn({ user: { id: 1 } }, signInDto);

      expect(result.statusCode).toEqual(HttpStatus.OK);
      expect(result.message).toEqual('로그인에 성공했습니다.');
      expect(result.data).toBeDefined();
    });
  });

  
});
