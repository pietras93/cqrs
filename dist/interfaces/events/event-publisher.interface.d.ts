import { IEvent } from './event.interface';
export interface IEventPublisher {
    publish<T extends IEvent>(event: T, handler: any): any;
}
