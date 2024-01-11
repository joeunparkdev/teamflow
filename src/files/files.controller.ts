import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import * as Multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import * as mime from 'mime-types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('파일')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  
   /**
   * 파일 생성 - 썬더클라이언트 사용
   * @param 
   * @req
   * @uploadFile
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':cardId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('cardId') cardId: number,
    @Req() req: any,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    console.log(file); // null, undefined
    const fileName = `${new Date().toISOString()}.${mime.extension(
      file.mimetype,
    )}`;

    return await this.filesService.createFile(
      cardId,
      req.user.id,
      file,
      fileName,
    );
  }

  /**
   * 파일 조회
   * @param 
   * @returns
   */
  // cardId에 저장되어 있는 files를 조회
  @Get(':cardId')
  async getFilesByCardId(@Param('cardId') cardId: number, @Req() req: any) {
    return await this.filesService.findFilesByCardId(cardId, req.user.id);
  }

  /**
   * 파일 삭제
   * @param
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':cardId/:fileId')
  async deleteFile(
    @Param('cardId') cardId: number,
    @Param('fileId') fileId: number,
    @Req() req: any,
  ) {
    return await this.filesService.deleteFile(cardId, fileId, req.user.id);
  }
}
