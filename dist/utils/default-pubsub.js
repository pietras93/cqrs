"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DefaultPubSub {
    publish(event) {
        if (!this.subject$) {
            throw new Error('Invalid underlying subject (call bridgeEventsTo())');
        }
        this.subject$.next(event).catch(err => {
            throw err;
        });
    }
    bridgeEventsTo(subject) {
        this.subject$ = subject;
    }
}
exports.DefaultPubSub = DefaultPubSub;
