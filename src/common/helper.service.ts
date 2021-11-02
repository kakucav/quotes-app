import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SlugService } from '../service/slug/slug.service';
import { Slug } from '../entity/slug/slug.entity';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { Quote } from '../entity/quote/quote.entity';
import { EditQuoteDto } from '../api/app/quote/dto/edit-quote.dto';

@Injectable()
export class HelperService {
  constructor(private slugService: SlugService) {}

  async hashPassword(
    password: string,
  ): Promise<{ hash: string; salt: string }> {
    const salt: string = await bcrypt.genSalt();
    const hash: string = await bcrypt.hash(password, salt);
    return {
      hash,
      salt,
    };
  }

  async generateSlug(title: string): Promise<string> {
    let slug: string = title.trim().toLocaleLowerCase();
    slug = slug.replace(/ /g, '-');

    const existingSlug: Slug = await this.slugService.getExistingSlug(slug);

    if (!existingSlug) {
      await this.slugService.createSlug(slug);

      return slug;
    }

    existingSlug.count++;
    await this.slugService.updateSlugCount(existingSlug.id, existingSlug);
    const thisSlugNumber = existingSlug.count - 1;
    slug += `-${thisSlugNumber.toString()}`;

    return slug;
  }

  async resizeQuotePhoto(authorPhoto: string, size: number): Promise<void> {
    const pathToFile = path.join(
      __dirname,
      '../..',
      process.env.PHOTOS_DEST,
      authorPhoto,
    );
    const fileName = authorPhoto.split('.');

    await sharp(pathToFile)
      .resize(size)
      .toFile(
        path.join(
          pathToFile,
          '../..',
          `${fileName[0]}-${size}x${size}.${fileName[1]}`,
        ),
      );
  }

  getPhotoDestination(photo: Express.Multer.File): string {
    return `${photo.destination.replace(`.${process.env.PHOTOS_DEST}`, '')}/${
      photo.filename
    }`;
  }

  renameFolder(
    pathToPhoto: string,
    oldFolderName: string,
    newFolderName: string,
  ): void {
    fs.rename(
      pathToPhoto,
      pathToPhoto.replace(oldFolderName, newFolderName),
      () => {},
    );
  }

  async deletePhotosFolder(photoPath: string): Promise<void> {
    const pathToFolder = path.join(
      __dirname,
      '..',
      '..',
      '/uploads',
      photoPath,
      '..',
    );
    await fs.rmdir(pathToFolder, { recursive: true }, () => {});
  }

  async generateQuoteObject(
    editQuoteDto: EditQuoteDto,
    authorPhoto: Express.Multer.File,
    oldQuote: Quote,
  ): Promise<Quote> {
    const quote: Quote = new Quote(editQuoteDto);
    if (quote.title !== oldQuote.title) {
      quote.slug = await this.generateSlug(quote.title);
    }
    if (oldQuote.authorPhoto)
      await this.deletePhotosFolder(oldQuote.authorPhoto);
    if (authorPhoto) {
      quote.authorPhoto = this.getPhotoDestination(authorPhoto);
      await this.resizeQuotePhoto(
        quote.authorPhoto,
        Number(process.env.QUOTE_IMAGE_SIZE_1),
      );
      await this.resizeQuotePhoto(
        quote.authorPhoto,
        Number(process.env.QUOTE_IMAGE_SIZE_2),
      );
    } else {
      quote.authorPhoto = null;
    }
    return quote;
  }
}
