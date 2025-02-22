import { BadRequestException, Body, Controller, Get, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';


const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("/image")
  @UseInterceptors(FilesInterceptor('files', 3)) // Allow up to 3 files
  async upload(
    @UploadedFiles() files: any,
    @Body("promptNumber") promptNumber: any
  ) {
    console.log("🚀 ~ AppController ~ promptNumber:", promptNumber)
    console.log('Received files:', files);
    
    const fileTypesAllowed = ['jpeg', 'png', 'jpg', 'heic', 'heif'];

    // Check if exactly 3 files are uploaded
    if (!files || files.length !== 3) {
      throw new BadRequestException('Please upload exactly 3 images');
    }

    const bucket = 'zorro-bucket';
    const acl = 'public-read';
    const uploadedUrls: string[] = [];

    try {
      // for (const file of files) {
      //   const fileTypeCheck = file.mimetype.split('/')[1];
      //   if (!fileTypesAllowed.includes(fileTypeCheck)) {
      //     throw new BadRequestException('Invalid File Type: ' + file.originalname);
      //   }

      //   const bucketFileName = `New_Project/ai-image/${Date.now()}-${file.originalname}`;
      //   const params = {
      //     Bucket: bucket,
      //     Key: bucketFileName,
      //     Body: file.buffer,
      //     ContentType: file.mimetype,
      //     ACL: acl,
      //   };

      //   console.log('Uploading to S3:', params);
      //   const uploadS3 = await s3.upload(params).promise();
      //   uploadedUrls.push(uploadS3.Location); // Get the uploaded URL
      // }

      // console.log('Uploaded Image URLs:', uploadedUrls);

      // Call your service function with the image URLs
      const response = await this.appService.processImages(uploadedUrls, promptNumber);

      return { success: true, images: uploadedUrls, response };
    } catch (e) {
      console.error('Error uploading to S3:', e);
      throw new BadRequestException('Failed to upload images');
    }
  }
}
