import { Injectable } from '@nestjs/common';
import { EventBus } from './event-bus';
import { AggregateRoot } from './aggregate-root';
import { IEvent } from './interfaces/index';

export interface Constructor<T> {
  new (...args: any[]): T;
}

@Injectable()
export class EventPublisher {
  constructor(private readonly eventBus: EventBus) {}

  mergeClassContext<T extends Constructor<AggregateRoot>>(metatype: T): T {
    const eventBus = this.eventBus;
    return class extends metatype {
      async publish(event: IEvent, handler: any) {
        await eventBus.execute(event, handler);
      }
    };
  }

  mergeObjectContext<T extends AggregateRoot>(object: T): T {
    const eventBus = this.eventBus;
    object.publish = async (event: IEvent, handler: any) => {
      await eventBus.execute(event, handler);
    };
    return object;
  }
}
