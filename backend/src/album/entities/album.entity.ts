import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Album } from '../schemas/album.schema';

@Exclude()
export class AlbumEntity {
  @ApiProperty({
    name: 'id',
    description: 'Unique identifier in the database',
    example: '5763cd4dc378a38ecd387737',
  })
  @Expose()
  @Type(() => String)
  id: string;

  @ApiProperty({
    name: 'name',
    description: 'name',
    example: 'lo-fi_album',
  })
  @Expose()
  @Type(() => String)
  name: string;

  constructor(partial: Partial<Album>) {
    Object.assign(this, partial);
  }
}
