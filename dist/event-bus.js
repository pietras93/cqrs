"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const command_bus_1 = require("./command-bus");
const event_not_found_exception_1 = require("./exceptions/event-not-found.exception");
const invalid_saga_exception_1 = require("./exceptions/invalid-saga.exception");
const index_1 = require("./index");
const constants_1 = require("./utils/constants");
const default_pubsub_1 = require("./utils/default-pubsub");
const observable_bus_1 = require("./utils/observable-bus");
let EventBus = class EventBus extends observable_bus_1.ObservableBus {
    constructor(commandBus) {
        super();
        this.commandBus = commandBus;
        this.moduleRef = null;
        this.handlers = new Map();
        this.useDefaultPublisher();
    }
    useDefaultPublisher() {
        const pubSub = new default_pubsub_1.DefaultPubSub();
        pubSub.bridgeEventsTo(this.subject$);
        this._publisher = pubSub;
    }
    setModuleRef(moduleRef) {
        this.moduleRef = moduleRef;
    }
    publish(event) {
        this._publisher.publish(event);
    }
    execute(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const handler = this.handlers.get(this.getEventName(event));
            if (!handler) {
                throw new event_not_found_exception_1.EventHandlerNotFoundException();
            }
            this.subject$.next(event);
            return yield handler.handle(event);
        });
    }
    ofType(event) {
        return this.ofEventName(event.name);
    }
    bind(handler, name) {
        this.handlers.set(name, handler);
    }
    combineSagas(sagas) {
        [].concat(sagas).map(saga => this.registerSaga(saga));
    }
    register(handlers) {
        handlers.forEach(handler => this.registerHandler(handler));
    }
    registerHandler(handler) {
        if (!this.moduleRef) {
            throw new index_1.InvalidModuleRefException();
        }
        const instance = this.moduleRef.get(handler);
        if (!instance)
            return;
        const eventsNames = this.reflectEventsNames(handler);
        eventsNames.map(event => this.bind(instance, event.name));
    }
    ofEventName(name) {
        return this.subject$.pipe(operators_1.filter(event => this.getEventName(event) === name));
    }
    getEventName(event) {
        const { constructor } = Object.getPrototypeOf(event);
        return constructor.name;
    }
    getEventHandler(name) {
        return this.handlers.get(name);
    }
    registerSaga(saga) {
        const stream$ = saga(this);
        if (!(stream$ instanceof rxjs_1.Observable)) {
            throw new invalid_saga_exception_1.InvalidSagaException();
        }
        stream$
            .pipe(operators_1.filter(e => e))
            .subscribe(command => this.commandBus.execute(command));
    }
    reflectEventsNames(handler) {
        return Reflect.getMetadata(constants_1.EVENTS_HANDLER_METADATA, handler);
    }
    get publisher() {
        return this._publisher;
    }
    set publisher(_publisher) {
        this._publisher = _publisher;
    }
};
EventBus = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [command_bus_1.CommandBus])
], EventBus);
exports.EventBus = EventBus;
