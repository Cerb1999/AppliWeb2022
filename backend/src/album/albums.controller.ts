import { Observable, of, map, take } from 'rxjs';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnprocessableEntityResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiTags,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { AlbumService } from './albums.service';
import { AlbumEntity } from './entities/album.entity';
import { HttpInterceptor } from '../interceptors/http.interceptor';
import { HandlerParams } from 'src/validators/handler-params';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { CreateAlbumDto } from './dto/create-album.dto';
import { MusicService } from 'src/music/musics.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { validateHeaderValue } from 'http';

@ApiTags('albums')
@Controller('albums')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(HttpInterceptor)
export class AlbumController {
  constructor(private readonly _albumService: AlbumService, private readonly _musicService: MusicService) {}

  @ApiOkResponse({
    description: 'Returns an array of a albums',
    type: AlbumEntity,
    isArray: true,
  })
  @ApiNoContentResponse({ description: 'No album exists in database' })
  @Get()
  findAll(): Observable<AlbumEntity[] | void> {
    return this._albumService.findAll();
  }

  @ApiOkResponse({
    description: 'Returns the album for the given "id"',
    type: AlbumEntity,
  })
  @ApiNotFoundResponse({
    description: 'Album with the given "id" doesn\'t exist in the database',
  })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiBadRequestResponse({ description: 'Parameter provided is not good' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the album in the database',
    type: String,
    allowEmptyValue: false,
  })
  @Get(':id')
  findOne(@Param() params: HandlerParams): Observable<AlbumEntity> {
    return this._albumService.findOne(params.id);
  }

  @ApiOkResponse({
    description: 'Return a random album',
    type: AlbumEntity,
  })
  @ApiNoContentResponse({ description: 'There is no album' })
  @Get('random')
  findRandomByAlbumId(): Observable<AlbumEntity | void> {
    return this._albumService.findRandom();
  }

  @ApiCreatedResponse({
    description: 'Success in creating an album',
    type: AlbumEntity,
  })
  @ApiConflictResponse({
    description: 'The album already exists in the database',
  })
  @ApiBadRequestResponse({ description: 'Payload provided is not good' })
  @ApiBody({
    description: 'Payload in creating a new album',
    type: CreateAlbumDto,
  })
  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto): Observable<AlbumEntity> {
    return this._albumService.create(createAlbumDto);
  }

  @ApiOkResponse({
    description: 'The album has been successfully updated',
    type: AlbumEntity,
  })
  @ApiNotFoundResponse({
    description: 'Album with the given "id" doesn\'t exist in the database',
  })
  @ApiConflictResponse({
    description: 'The album already exists in the database',
  })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiBadRequestResponse({
    description: 'Parameter and/or payload provided are not good',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the album in the database',
    type: String,
    allowEmptyValue: false,
  })
  @ApiBody({ description: 'Payload to update an album', type: UpdateAlbumDto })
  @Put(':id')
  update(
    @Param() params: HandlerParams,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Observable<AlbumEntity> {
    return this._albumService.update(params.id, updateAlbumDto);
  }

  @ApiNoContentResponse({
    description: 'The album has been successfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'Album with the given "id" doesn\'t exist in the database',
  })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiBadRequestResponse({ description: 'Parameter is not good' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the album in the database',
    type: String,
    allowEmptyValue: false,
  })
  @Delete(':id')
  delete(@Param() params: HandlerParams): Observable<void> {
    return this._albumService.delete(params.id);
  }
}
