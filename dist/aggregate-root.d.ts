import { IEvent } from './interfaces/index';
export abstract class AggregateRoot {
  private readonly events;
  autoCommit: boolean;
  publish(event: IEvent): void;
  commit(): Promise<void>;
  uncommit(): void;
  getUncommittedEvents(): IEvent[];
  loadFromHistory(history: IEvent[]): void;
  apply(event: IEvent, isFromHistory?: boolean): Promise<void>;
  private getEventHandler(event);
  private getEventName(event);
}