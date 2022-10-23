import { Observable, of } from 'rxjs';
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
  ApiConflictResponse,
  ApiBody,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { MusicService } from './musics.service';
import { MusicEntity } from './entities/music.entity';
import { HttpInterceptor } from '../interceptors/http.interceptor';
import { HandlerParams } from 'src/validators/handler-params';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';

@ApiTags('musics')
@Controller('musics')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(HttpInterceptor)
export class MusicController {
  constructor(private readonly _musicService: MusicService) {}

  @ApiOkResponse({
    description: 'Returns an array of a test table',
    type: MusicEntity,
    isArray: true,
  })
  @ApiNoContentResponse({ description: 'No music exists in database' })
  @Get()
  findAll(): Observable<MusicEntity[] | void> {
    return this._musicService.findAll();
  }

  @ApiOkResponse({
    description: 'Returns the music for the given "id"',
    type: MusicEntity,
  })
  @ApiNotFoundResponse({
    description: 'Music with with the given album "id" doesn\'t exist in the database',
  })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiBadRequestResponse({ description: 'Parameter provided is not good' })
  @ApiParam({
    name: 'id',
    description: 'Returns a music based on identifier',
    type: String,
    allowEmptyValue: false,
  })
  @Get(':id')
  findOne(@Param() params: HandlerParams): Observable<MusicEntity> {
    return this._musicService.findOne(params.id);
  }

  @ApiOkResponse({
    description: 'Returns the album musics for the given "id"',
    type: MusicEntity,
  })
  @ApiNotFoundResponse({
    description: 'Musics with with the given album "id" doesn\'t exist in the database',
  })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  }) 
  @ApiBadRequestResponse({ description: 'Parameter provided is not good' })
  @ApiParam({
    name: 'id',
    description: 'Returns an array of an album musics based on identifier',
    type: String,
    allowEmptyValue: false,
  })
  @Get('albums/:id')
  findAllByAlbumId(@Param() params: HandlerParams): Observable<MusicEntity[] | void> {
    return this._musicService.findAllByAlbumId(params.id);
  }

  @ApiOkResponse({
    description: 'Return a random music ignoring album',
    type: MusicEntity,
  })
  @ApiNoContentResponse({ description: 'There is no music' })
  @Get('random')
  findRandomNoAlbum(): Observable<MusicEntity | void> {
    return this._musicService.findRandomNoAlbum();
  }

  @ApiOkResponse({
    description: 'Return a random music by album',
    type: MusicEntity,
  })
  @ApiNoContentResponse({ description: 'There is no music in this album' })
  @Get('random/album/:id')
  findRandomByAlbumId(@Param() params: HandlerParams): Observable<MusicEntity | void> {
    return this._musicService.findRandomByAlbumId(params.id);
  }

  @ApiCreatedResponse({
    description: 'Success in creating a music',
    type: MusicEntity,
  })
  @ApiConflictResponse({
    description: 'The music already exists in the database',
  })
  @ApiBadRequestResponse({ description: 'Payload provided is not good' })
  @ApiBody({
    description: 'Payload in creating a new music',
    type: CreateMusicDto,
  })
  @Post()
  create(@Body() createMusicDto: CreateMusicDto): Observable<MusicEntity> {
    return this._musicService.create(createMusicDto);
  }

  @ApiOkResponse({
    description: 'The album has been successfully updated',
    type: MusicEntity,
  })
  @ApiNotFoundResponse({
    description: 'Music with the given "id" doesn\'t exist in the database',
  })
  @ApiConflictResponse({
    description: 'The music already exists in the database',
  })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiBadRequestResponse({
    description: 'Parameter and/or payload provided are not good',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the music in the database',
    type: String,
    allowEmptyValue: false,
  })
  @ApiBody({ description: 'Payload to update a music', type: UpdateMusicDto })
  @Put(':id')
  update(
    @Param() params: HandlerParams,
    @Body() updateMusicDto: UpdateMusicDto,
  ): Observable<MusicEntity> {
    return this._musicService.update(params.id, updateMusicDto);
  }

  @ApiNoContentResponse({
    description: 'The music has been successfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'Music with the given "id" doesn\'t exist in the database',
  })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiBadRequestResponse({ description: 'Parameter is not good' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the music in the database',
    type: String,
    allowEmptyValue: false,
  })
  @Delete(':id')
  delete(@Param() params: HandlerParams): Observable<void> {
    return this._musicService.delete(params.id);
  }
}
