import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type FileDocument = HydratedDocument<FileModel>;

@Schema()
export class FileModel {
      @Prop({ required: true })
      name: string;
      @Prop({ required: true })
      type: string;
      @Prop()
      accessLink?: string;
      @Prop({ required: true, default: 0 })
      size: number;
      @Prop({ default: '' })
      path: string;
      @Prop({
            type: mongoose.Types.ObjectId,
            ref: 'User'
      })
      user: mongoose.Types.ObjectId;
      @Prop({
            type: mongoose.Types.ObjectId,
            ref: 'File'
      })
      parent?: mongoose.Types.ObjectId;
      @Prop({
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
            default: []
      })
      childs: [mongoose.Types.ObjectId];
}

export const FileSchema = SchemaFactory.createForClass(FileModel);
