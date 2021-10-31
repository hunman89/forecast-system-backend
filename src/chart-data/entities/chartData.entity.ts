import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ChartData {
  @Field((type) => [String])
  labels: string[];

  @Field((type) => [Number], { nullable: 'items' })
  kamisData: number[];

  @Field((type) => [Number], { nullable: 'items' })
  predictedData: number[];
}
