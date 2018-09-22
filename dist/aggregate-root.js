"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class AggregateRoot {
    constructor() {
        this.events = [];
        this.autoCommit = false;
    }
    publish(event) { }
    commit() {
        this.events.forEach((event) => this.publish(event));
        this.events.length = 0;
    }
    uncommit() {
        this.events.length = 0;
    }
    getUncommittedEvents() {
        return this.events;
    }
    loadFromHistory(history) {
        history.forEach(event => this.apply(event, true));
    }
    apply(event, isFromHistory = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isFromHistory && !this.autoCommit) {
                this.events.push(event);
            }
            if (this.autoCommit) {
                yield this.publish(event);
            }
            const handler = this.getEventHandler(event);
            handler && handler.call(this, event);
        });
    }
    getEventHandler(event) {
        const handler = `on${this.getEventName(event)}`;
        return this[handler];
    }
    getEventName(event) {
        const { constructor } = Object.getPrototypeOf(event);
        return constructor.name;
    }
}
exports.AggregateRoot = AggregateRoot;
