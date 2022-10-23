import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsInstance,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, } from '@nestjs/swagger';
import { Album } from 'src/album/albums.types';

export class UpdateMusicDto {
  @ApiProperty({
    name: 'album_name',
    description: 'album name',
    example: 'Lo-fi',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    name: 'albums',
    description: 'albums containing the music'
  })
  @IsOptional()
  @IsArray()
  albums?: Album[];
}
