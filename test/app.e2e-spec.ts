import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { faker } from '@faker-js/faker'; 
import { SignUpDto } from '@/auth/dtos/sign-up.dto';
import { BoardDto } from '@/board/dto/board.dto';

let accessToken: string;
let app: INestApplication; 
let signUpDto: SignUpDto;
let boardDto : BoardDto;
describe('AppController (e2e)', () => {

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  for (let i = 0; i < 5; i++) {
  //첫번째 회원가입
  it('/auth/sign-up (POST)', async () => {
    const signUpDto = {
      "passwordConfirm": "Ex@mp1e!!",
      "email": "example@example.com",
      "password": "Ex@mp1e!!",
      "name": "홍길동"
    };

    const response = await request(app.getHttpServer())
      .post('/auth/sign-up') 
      .send(signUpDto)
      //.expect(201);
      console.log(response.body)
  });

  //더미데이터 회원가입
  it('/auth/sign-up (POST)', async () => {
    const signUpDto = {
      "passwordConfirm": "Ex@mp1e!!",
      "email": faker.phone.imei+"@"+faker.lorem.words(1)+".com",
      "password": "Ex@mp1e!!",
      "name": faker.person.firstName
    };

    const response = await request(app.getHttpServer())
      .post('/auth/sign-up') 
      .send(signUpDto.email)
      .expect(201);
      console.log(response.body)
  });

  //로그인
  it('/auth/sign-in (POST)', async () => {
    const signInDto = {
      "email": "example@example.com",
      "password": "Ex@mp1e!!"
    }

    const response = await request(app.getHttpServer())
      .post('/auth/sign-in') 
      .send(signInDto)
      //.expect(200);
      accessToken= response.body.data.accessToken;
  });

 //보드 생성
  it('/board (POST)', async () => {
    boardDto = {
      "name": faker.lorem.words(1),
      "backgroundColor": "FFF000",
      "description": faker.lorem.text()
    };
  
    const response = await request(app.getHttpServer())
      .post('/board')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(boardDto)
      .expect(201);
      console.log(response.body)
  
  });

  //컬럼 생성
 it(`/boards/1/columns (POST)`, async () => {
  const columnsDto = {
    "name": faker.lorem.words(2),
  };

  const response = await request(app.getHttpServer())
    .post('/boards/1/columns')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(columnsDto)
    .expect(201);
    console.log(response.body)

});

//카드 생성
it('/column/1/cards (POST)', async () => {
  const cardsDto = {
    "name": faker.lorem.words(3),
  };

  const response = await request(app.getHttpServer())
    .post('/column/2/cards')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(cardsDto)
     .expect(201);
     console.log(response.body)
});

//댓글 생성
it('/cards/1/comments (POST)', async () => {
  const createCommentDto = {
    "comment": faker.lorem.text(),
  };

  const response = await request(app.getHttpServer())
    .post('/cards/1/comments')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(createCommentDto)
    .expect(201);
    console.log(response.body);
    
});
  }

  afterAll(async () => {
    await app.close(); 
  });
});