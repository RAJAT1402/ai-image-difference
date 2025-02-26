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

  async processImages(images: string[], promptNumber: string) {

    let prompt = "";
    
    
    switch(promptNumber){
      case "1" : prompt = "Compare the number of items in all provided images. Identify if any items are missing or extra in any image. Provide a percentage match for quantity consistency.";
              break;

      case "2" : prompt = "Identify and list the different product variations across all images. Ensure the product names and types match across images. Highlight any inconsistencies or missing variations.";
              break;

      case "3" : prompt = "Examine the images for any visible damage to item packaging. Report any tears, leaks, or significant wrinkles, specifying the affected item and nature of damage.";
              break;
    }


    console.log("🚀 ~ AppService ~ processImages ~ prompt:", promptNumber , "  " , prompt)

    console.log("Images ", images);
    

    // Convert single-quoted URLs to double-quoted ones
    const formattedImages = images.map(url => url.replace(/^'|'$/g, '"'));
    console.log("🚀 ~ AppService ~ processImages ~ formattedImages:", formattedImages)


    console.log("🚀 Debug JSON:", JSON.stringify({ type: "image_url", image_url: { url: formattedImages[0] } }, null, 2));

    const image1 = formattedImages[0];
    const image2 = formattedImages[1];
    const image3 = formattedImages[2];

    // return formattedImages;
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyize the photo" },
            // { type: "text", text: prompt },
            { type: "image_url", image_url: { url: "https://zorro-bucket.s3.ap-south-1.amazonaws.com/New_Project/ai-image/imag_2.jpg" } }, // First image
            // { type: "image_url", image_url: { url: "https://zorro-bucket.s3.ap-south-1.amazonaws.com/New_Project/ai-image/1740208187631-IMG_0124.jpg" } }, // First image
            // { type: "image_url", image_url: { url: "https://zorro-bucket.s3.ap-south-1.amazonaws.com/New_Project/ai-image/1740208188419-IMG_0127.jpg" } }, // First image
          
            // { type: "image_url", image_url: { url: image1 } }, // First image
            // { type: "image_url", image_url: { url: image2 } }, // Second image
            // { type: "image_url", image_url: { url: image3 } }  // Third image
          ],
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });
    
    console.log("🚀 ~ UploadService ~ extractPersonInfo ~ response:", response);
    
    // Parse and return the JSON response
    const content = response.choices[0]?.message?.content;
    console.log("🚀 ~ AppService ~ processImages ~ content:", content)
    if (!content) {
      throw new Error("No content returned by OpenAI API");
    }
    
    return content;
  }
}
