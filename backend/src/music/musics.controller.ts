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
import { HandlerParamsN } from 'src/validators/handler-params-name';

@ApiTags('musics')
@Controller('musics')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(HttpInterceptor)
export class MusicController {
  constructor(private readonly _musicService: MusicService) {}

  @ApiOkResponse({
    description: 'Returns an array of a music table',
    type: MusicEntity,
    isArray: true,
  })
  @ApiNoContentResponse({ description: 'No music exists in database' })
  @Get()
  findAll(): Observable<MusicEntity[] | void> {
    return this._musicService.findAll();
  }

  /*
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
  findOneById(@Param() params: HandlerParams): Observable<MusicEntity> {
    return this._musicService.findOne(params.id);
  }
  */

  @ApiOkResponse({
    description: 'Returns the music for the given "name"',
    type: MusicEntity,
  })
  @ApiNotFoundResponse({
    description: 'Music with with the given album "name" doesn\'t exist in the database',
  })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiBadRequestResponse({ description: 'Parameter provided is not good' })
  @ApiParam({
    name: 'name',
    description: 'Returns a music based on identifier',
    type: String,
    allowEmptyValue: false,
  })
  @Get(':name')
  findOne(@Param() params: HandlerParamsN): Observable<MusicEntity> {
    return this._musicService.findOne(params.name);
  }


  /*
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
  */

  @ApiOkResponse({
    description: 'Returns the album musics for the given "name"',
    type: MusicEntity,
  })
  @ApiNotFoundResponse({
    description: 'Musics with with the given album "name" doesn\'t exist in the database',
  })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  }) 
  @ApiBadRequestResponse({ description: 'Parameter provided is not good' })
  @ApiParam({
    name: 'name',
    description: 'Returns an array of an album musics based on name',
    type: String,
    allowEmptyValue: false,
  })
  @Get('albums/:name')
  findAllByAlbumName(@Param() params: HandlerParamsN): Observable<MusicEntity[] | void> {
    return this._musicService.findAllByAlbumName(params.name);
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
  @Get('albums/random/:name')
  findRandomByAlbum(@Param() params: HandlerParamsN): Observable<MusicEntity | void> {
    return this._musicService.findRandomByAlbumName(params.name);
  }

  /*
  @ApiOkResponse({
    description: 'Return a random music by album',
    type: MusicEntity,
  })
  @ApiNoContentResponse({ description: 'There is no music in this album' })
  @Get('albums/random/:id')
  findRandomByAlbumId(@Param() params: HandlerParams): Observable<MusicEntity | void> {
    return this._musicService.findRandomByAlbumId(params.id);
  }
  */

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

  /*
  @ApiOkResponse({
    description: 'The music has been successfully updated',
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
  updateById(
    @Param() params: HandlerParams,
    @Body() updateMusicDto: UpdateMusicDto,
  ): Observable<MusicEntity> {
    return this._musicService.updateById(params.id, updateMusicDto);
  }
  */


  /*
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
  deleteById(@Param() params: HandlerParams): Observable<void> {
    return this._musicService.deleteById(params.id);
  }
  */

  @ApiOkResponse({
    description: 'The music has been successfully updated',
    type: MusicEntity,
  })
  @ApiNotFoundResponse({
    description: 'Music with the given "name" doesn\'t exist in the database',
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
    name: 'name',
    description: 'Unique name of the music in the database',
    type: String,
    allowEmptyValue: false,
  })
  @ApiBody({ description: 'Payload to update a music', type: UpdateMusicDto })
  @Put(':name')
  update(
    @Param() params: HandlerParamsN,
    @Body() updateMusicDto: UpdateMusicDto,
  ): Observable<MusicEntity> {
    return this._musicService.update(params.name, updateMusicDto);
  }

  @ApiNoContentResponse({
    description: 'The music has been successfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'Music with the given "name" doesn\'t exist in the database',
  })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiBadRequestResponse({ description: 'Parameter is not good' })
  @ApiParam({
    name: 'name',
    description: 'Unique name of the music in the database',
    type: String,
    allowEmptyValue: false,
  })
  @Delete(':name')
  delete(@Param() params: HandlerParamsN): Observable<void> {
    return this._musicService.delete(params.name);
  }

}
