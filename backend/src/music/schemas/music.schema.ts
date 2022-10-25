import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Album, AlbumDocument, AlbumSchema } from 'src/album/schemas/album.schema';

export type MusicDocument = Music & Document;

@Schema({
  toJSON: {
    virtuals: true,
    transform: (doc: any, ret: any) => {
      //delete ret._id;
    },
  },
  toObject: {
    virtuals: true,
    transform: (doc: any, ret: any) => {
      //delete ret._id;
    },
  },
})
export class Music {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  })
  _id: string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 128,
    trim: true,
    unique: true,
  })
  name: string;

  @Prop({
    type: Date,
    required: true,
  })
  addedToApiDate: string;

  @Prop({
    type: [AlbumSchema], default: [],
  })
  albums: Album[];
}

export const MusicSchema = SchemaFactory.createForClass(Music);
MusicSchema.index({ name: 1 }, { unique: true });
