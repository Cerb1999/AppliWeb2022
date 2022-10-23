import {
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
import { ApiProperty, } from '@nestjs/swagger';

export class UpdateAlbumDto {
  @ApiProperty({
    name: 'album_name',
    description: 'album name',
    example: 'Lo-fi',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
