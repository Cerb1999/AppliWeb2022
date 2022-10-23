import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AlbumDocument = Album & Document;

@Schema({
  toJSON: {
    virtuals: true,
    transform: (doc: any, ret: any) => {
      delete ret._id;
    },
  },
  versionKey: false,
})
export class Album {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  })
  _id: any;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 128,
    trim: true,
    unique: true,
  })
  name: string;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);

AlbumSchema.index({ name: 1 }, { unique: true });
