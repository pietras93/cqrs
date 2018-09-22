"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
class DefaultPubSub {
    publish(event) {
        if (!this.subject$) {
            throw new Error('Invalid underlying subject (call bridgeEventsTo())');
        }
        this.subject$.pipe(operators_1.catchError(err => {
            console.log(err);
            throw err;
        }));
        this.subject$.next(event);
    }
    bridgeEventsTo(subject) {
        this.subject$ = subject;
    }
}
exports.DefaultPubSub = DefaultPubSub;
