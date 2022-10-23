import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Album } from 'src/album/albums.types';

export class CreateMusicDto {
  @ApiProperty({
    name: 'album_name',
    description: 'album_name',
    example: 'lo-fi',
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
