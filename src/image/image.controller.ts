import { Controller, Post, Delete, UploadedFile, UseInterceptors, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';


@Controller('image')
@ApiTags('image')
export class ImageController {
  constructor(private readonly cloudinaryService: ImageService) { }

  @Post('upload/single')
  @ApiOperation({ summary: 'Post operation' })
  @ApiResponse({ status: 200, description: 'Success' })
  @UseInterceptors(FileInterceptor('image', { storage: multer.memoryStorage() }))
  async uploadSingleImage(@UploadedFile() file: Express.Multer.File): Promise<any> {
    console.log('Received file:', file);
    return this.cloudinaryService.uploadSingleImage(file);
  }

  @Delete('delete/single/:publicId')
  @ApiOperation({ summary: 'Delete operation' })
  @ApiResponse({ status: 200, description: 'Success' })
  async deleteSingleImage(@Param('publicId') publicId: string): Promise<any> {
    return this.cloudinaryService.deleteSingleImage(publicId);
  }

}
