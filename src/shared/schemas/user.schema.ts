import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TariffPlan } from '@shared/models';

@Schema()
export class User extends Document {
      @Prop({ required: true })
      name: string;

      @Prop({ required: true, unique: true })
      email: string;

      @Prop({ required: true })
      password: string;

      @Prop({ default: 0 })
      diskSpace: number;

      @Prop({ default: TariffPlan.default })
      plan: TariffPlan;
}

export const UserSchema = SchemaFactory.createForClass(User);
