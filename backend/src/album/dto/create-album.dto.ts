import {
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlbumDto {
  @ApiProperty({
    name: 'album_name',
    description: 'album_name',
    example: 'lo-fi',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
