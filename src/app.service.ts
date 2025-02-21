import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

@Injectable()
export class AppService {

  private openai = new OpenAI({ apiKey: process.env.openai });

  getHello(): string {
    return 'Hello World!';
  }

  async processImages(images: string[], prompt: string) {
    console.log("Images ", images);
    return images;
    // const response = await this.openai.chat.completions.create({
    //   model: "gpt-4-turbo",
    //   messages: [
    //     {
    //       role: "user",
    //       content: [
    //         { type: "text", text: prompt },
    //         { type: "image_url", image_url: { url: images[0] } }, // First image
    //         { type: "image_url", image_url: { url: images[1] } }, // Second image
    //         { type: "image_url", image_url: { url: images[2] } }  // Third image
    //       ],
    //     },
    //   ],
    //   max_tokens: 300,
    //   temperature: 0.7,
    // });
    
    // console.log("🚀 ~ UploadService ~ extractPersonInfo ~ response:", response);
    
    // // Parse and return the JSON response
    // const content = response.choices[0]?.message?.content;
    // if (!content) {
    //   throw new Error("No content returned by OpenAI API");
    // }
    
    // return content;
  }
}
