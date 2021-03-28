import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<Date, Date> {
  description = '한국 시간에 맞춘 커스텀 Date 타입';

  parseValue(value: string): Date {
    return new Date(value);
  }

  serialize(value: Date): Date {
    return value;
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }

    return null;
  }
}
