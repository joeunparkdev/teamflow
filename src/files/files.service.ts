import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardsService } from '../cards/cards.service';
import { Files } from './entities/file.entity';

@Injectable()
export class FilesService {
  private readonly s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_S3_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET_KEY,
    },
  });

  constructor(
    @InjectRepository(Files)
    private filesRepository: Repository<Files>,
    private readonly cardsService: CardsService,
  ) {}

  async createFile(
    cardId: number,
    userId: number,
    file: Express.Multer.File,
    fileName: string,
  ) {
    // cardId에 있는 card에 userId가 할당되었는지 여부 확인
    await this.cardsService.verifyAssignedUser(cardId, userId);

    try {
      const uploadResult = await this.s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.BUCKET,
          Key: fileName,
          Body: file.buffer,
        }),
      );

      console.log(uploadResult);
      // 사진을 받아오고 싶어 => `S3 사진 객체 주소`
      // `S3 사진 객체 주소` =>
      // base 주소: https://teamflow1.s3.ap-northeast-2.amazonaws.com/
      // 이후 경로 : 파일 name
      // https://teamflow1.s3.ap-northeast-2.amazonaws.com/2024-01-09T08:14:27.381Z.png
      // https://teamflow1.s3.ap-northeast-2.amazonaws.com/2024-01-09T13:46:20.130Z.png
      const newFile = {
        card: { id: cardId },
        name: fileName,
        path: `https://teamflow1.s3.ap-northeast-2.amazonaws.com/${fileName}`,
      };
      return this.filesRepository.save(newFile);
    } catch (error) {
      console.log({ error });
    }
  }

  async findFilesByCardId(cardId: number, userId: number) {
    await this.cardsService.verifyAssignedUser(cardId, userId);

    // cardId에 존재하는 files 반환
    return this.filesRepository.findOne({
      where: {
        card: {
          id: cardId,
        },
      },
    });
  }

  async deleteFile(cardId: number, fileId: number, userId: number) {
    await this.cardsService.verifyAssignedUser(cardId, userId);
    const file = await this.filesRepository.findOne({ where: { id: fileId } });

    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.BUCKET,
        Key: file.name,
      }),
    );
    return this.filesRepository.delete({ id: fileId });
  }
}
