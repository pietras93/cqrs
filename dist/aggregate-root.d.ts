import { IEvent } from './interfaces/index';
export declare abstract class AggregateRoot {
    private readonly events;
    autoCommit: boolean;
    publish(event: IEvent, handlerInstance: any): void;
    commit(): Promise<void>;
    uncommit(): void;
    getUncommittedEvents(): IEvent[];
    loadFromHistory(history: IEvent[]): void;
    apply(event: IEvent, handlerInstance: any, isFromHistory?: boolean): Promise<void>;
    private getEventHandler(event);
    private getEventName(event);
}
