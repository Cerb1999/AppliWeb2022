import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Music } from '../schemas/music.schema';
import { Album, AlbumDocument } from 'src/album/schemas/album.schema';
import { ValidateNested } from 'class-validator';

@Exclude()
export class MusicEntity {
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
    example: 'lo-fi_track',
  })
  @Expose()
  @Type(() => String)
  name: string;

  @ApiProperty({
    name: 'addedToApiDate',
    description: 'date of adhesion',
    example: '',
  })
  @Expose()
  @Type(() => String)
  addedToApiDate: string;

  @Expose()
  @ValidateNested({ each: true})
  @Type(() => Album)
  albums: Album[];

  constructor(partial: Partial<Music>) {
    Object.assign(this, partial);
  }
}
