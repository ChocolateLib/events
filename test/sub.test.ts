import { describe, it, expect } from '@jest/globals';
import { EventHandlerSub } from "../src";

describe('Sub Event Handler', function () {
    describe('Init', function () {
        it('Create Simple Event Handler', function () {
            let handler = new EventHandlerSub;
        });
        it('Create Simple Event Handler With Types', function () {
            let handler = new EventHandlerSub<{ test: number }>;
            handler.on('test', (e) => {
                e.type;
                e.target;
                e.data;
                e.sub;
            });
        });
    });

    describe('Adding and removing listeners', function () {
        it('Checking if listener is added to handler with single type', function () {
            let handler = new EventHandlerSub<{ test: number }>();
            expect(handler.inUse('test')).toStrictEqual(false);
            handler.on("test", () => { });
            expect(handler.inUse('test')).toStrictEqual(true);
        });
        it('Checking if listener is added to handler with multiple types', function () {
            let handler = new EventHandlerSub<{ test: number, test2: number, test3: number }>();
            expect(handler.inUse('test')).toStrictEqual(false);
            handler.on("test", () => { });
            expect(handler.inUse('test')).toStrictEqual(true);
            expect(handler.inUse('test2')).toStrictEqual(false);
            handler.on("test2", () => { });
            expect(handler.inUse('test2')).toStrictEqual(true);
            expect(handler.inUse('test3')).toStrictEqual(false);
            handler.on("test3", () => { });
            expect(handler.inUse('test3')).toStrictEqual(true);
        });
        it('Checking if listener is added to handler with single type and specific listener', function () {
            let handler = new EventHandlerSub<{ test: number }>();
            expect(handler.inUse('test')).toStrictEqual(false);
            let lis = handler.on("test", () => { });
            expect(handler.has('test', lis)).toStrictEqual(true);
        });
        it('Checking if listener is removed from handler with single type', function () {
            let handler = new EventHandlerSub<{ test: number }>();
            let lis = handler.on("test", () => { });
            expect(handler.inUse('test')).toStrictEqual(true);
            handler.off("test", lis);
            expect(handler.inUse('test')).toStrictEqual(false);
        });
        it('Checking if listener is removed from handler with multiple types', function () {
            let handler = new EventHandlerSub<{ test: number, test2: number, test3: number }>();
            let lis1 = handler.on("test", () => { });
            let lis2 = handler.on("test2", () => { });
            let lis3 = handler.on("test3", () => { });
            expect(handler.inUse('test') && handler.inUse('test2') && handler.inUse('test3')).toStrictEqual(true);
            handler.off("test", lis1);
            handler.off("test2", lis2);
            handler.off("test3", lis3);
            expect(handler.inUse('test') || handler.inUse('test2') || handler.inUse('test3')).toStrictEqual(false);
        });
        it('Clearing listeners from handler', function () {
            let handler = new EventHandlerSub<{ test: number, test2: number, test3: number }>();
            handler.on("test", () => { });
            handler.on("test2", () => { });
            handler.on("test3", () => { });
            expect(handler.inUse('test') && handler.inUse('test2') && handler.inUse('test3')).toStrictEqual(true);
            handler.clear("test");
            handler.clear("test2");
            handler.clear("test3");
            expect(handler.inUse('test') || handler.inUse('test2') || handler.inUse('test3')).toStrictEqual(false);
        });
    });

    describe('Dispatching event', function () {
        it('Checking if values are correct when dispatching event', function (done) {
            let handler = new EventHandlerSub<{ test: number }>();
            handler.on("test", (e) => {
                expect(e.type).toStrictEqual('test');
                expect(e.target).toStrictEqual(handler);
                expect(e.data).toStrictEqual(10);
                done()
            });
            handler.emit('test', 10);
        });

        it('Checking if values are correct when dispatching event with once option set true', function () {
            let handler = new EventHandlerSub<{ test: number }>();
            let cool = 0;
            handler.once("test", (e) => {
                cool++;
                expect(e.type).toStrictEqual('test');
                expect(e.target).toStrictEqual(handler);
                expect(e.data).toStrictEqual(10);
            });
            handler.emit('test', 10);
            expect(handler.inUse('test')).toStrictEqual(false);
            handler.emit('test', 10);
            expect(cool).toStrictEqual(1);
        });
    });

    describe('Adding and removing sub listeners', function () {
        it('Checking if listener is added to handler with single type', function () {
            let handler = new EventHandlerSub<{ test: number }>();
            expect(handler.inUse('test', ['a', 'b', 'c'])).toStrictEqual(false);
            handler.on("test", () => { }, ['a', 'b', 'c']);
            expect(handler.inUse('test', ['a', 'b', 'c'])).toStrictEqual(true);
        });
        it('Checking if listener is added to handler with multiple types', function () {
            let handler = new EventHandlerSub<{ test: number, test2: number, test3: number }>();
            expect(handler.inUse('test', ['a', 'b', 'c'])).toStrictEqual(false);
            handler.on("test", () => { }, ['a', 'b', 'c']);
            expect(handler.inUse('test', ['a', 'b', 'c'])).toStrictEqual(true);
            expect(handler.inUse('test2', ['a', 'b', 'c'])).toStrictEqual(false);
            handler.on("test2", () => { }, ['a', 'b', 'c']);
            expect(handler.inUse('test2', ['a', 'b', 'c'])).toStrictEqual(true);
            expect(handler.inUse('test3', ['a', 'b', 'c'])).toStrictEqual(false);
            handler.on("test3", () => { }, ['a', 'b', 'c']);
            expect(handler.inUse('test3', ['a', 'b', 'c'])).toStrictEqual(true);
        });
        it('Checking if listener is added to handler with single type and specific listener', function () {
            let handler = new EventHandlerSub<{ test: number }>();
            expect(handler.inUse('test', ['a', 'b', 'c'])).toStrictEqual(false);
            let lis = handler.on("test", () => { }, ['a', 'b', 'c']);
            expect(handler.has('test', lis, ['a', 'b', 'c'])).toStrictEqual(true);
        });
        it('Checking if listener is removed from handler with single type', function () {
            let handler = new EventHandlerSub<{ test: number }>();
            let lis = handler.on("test", () => { }, ['a', 'b', 'c']);
            expect(handler.inUse('test', ['a', 'b', 'c'])).toStrictEqual(true);
            handler.off("test", lis, ['a', 'b', 'c']);
            expect(handler.inUse('test', ['a', 'b', 'c'])).toStrictEqual(false);
        });
        it('Checking if listener is removed from handler with multiple types', function () {
            let handler = new EventHandlerSub<{ test: number, test2: number, test3: number }>();
            let lis1 = handler.on("test", () => { }, ['a', 'b', 'c']);
            let lis2 = handler.on("test2", () => { }, ['a', 'b', 'c']);
            let lis3 = handler.on("test3", () => { }, ['a', 'b', 'c']);
            expect(handler.inUse('test', ['a', 'b', 'c']) && handler.inUse('test2', ['a', 'b', 'c']) && handler.inUse('test3', ['a', 'b', 'c'])).toStrictEqual(true);
            handler.off("test", lis1, ['a', 'b', 'c']);
            handler.off("test2", lis2, ['a', 'b', 'c']);
            handler.off("test3", lis3, ['a', 'b', 'c']);
            expect(handler.inUse('test', ['a', 'b', 'c']) || handler.inUse('test2', ['a', 'b', 'c']) || handler.inUse('test3', ['a', 'b', 'c'])).toStrictEqual(false);
        });
        it('Clearing listeners from handler', function () {
            let handler = new EventHandlerSub<{ test: number, test2: number, test3: number }>();
            handler.on("test", () => { }, ['a', 'b', 'c']);
            handler.on("test2", () => { }, ['a', 'b', 'c']);
            handler.on("test3", () => { }, ['a', 'b', 'c']);
            expect(handler.inUse('test', ['a', 'b', 'c']) && handler.inUse('test2', ['a', 'b', 'c']) && handler.inUse('test3', ['a', 'b', 'c'])).toStrictEqual(true);
            handler.clear("test", ['a', 'b', 'c']);
            handler.clear("test2", ['a', 'b', 'c']);
            handler.clear("test3", ['a', 'b', 'c']);
            expect(handler.inUse('test', ['a', 'b', 'c']) || handler.inUse('test2', ['a', 'b', 'c']) || handler.inUse('test3', ['a', 'b', 'c'])).toStrictEqual(false);
        });
        it('Clearing all listeners from handler in once', function () {
            let handler = new EventHandlerSub<{ test: number, test2: number, test3: number }>();
            handler.on("test", () => { }, ['a', 'b', 'a']);
            handler.on("test", () => { }, ['a', 'b', 'b']);
            handler.on("test", () => { }, ['a', 'b', 'c']);
            expect(handler.inUse('test', ['a', 'b', 'a']) && handler.inUse('test', ['a', 'b', 'b']) && handler.inUse('test', ['a', 'b', 'c'])).toStrictEqual(true);
            handler.clear("test", undefined, true);
            expect(handler.inUse('test', ['a', 'b', 'a']) || handler.inUse('test', ['a', 'b', 'b']) || handler.inUse('test', ['a', 'b', 'c'])).toStrictEqual(false);
        });
    });

    describe('Dispatching sub event', function () {
        it('Checking if values are correct when dispatching event', function (done) {
            let handler = new EventHandlerSub<{ test: number }>();
            handler.on("test", (e) => {
                expect(e.type).toStrictEqual('test');
                expect(e.target).toStrictEqual(handler);
                expect(e.data).toStrictEqual(10);
                done()
            }, ['a', 'b', 'c']);
            handler.emit('test', 10, ['a', 'b', 'c']);
        });

        it('Checking if values are correct when dispatching event with once option set true', function () {
            let handler = new EventHandlerSub<{ test: number }>();
            let cool = 0;
            handler.once("test", (e) => {
                cool++;
                expect(e.type).toStrictEqual('test');
                expect(e.target).toStrictEqual(handler);
                expect(e.data).toStrictEqual(10);
            }, ['a', 'b', 'c']);
            handler.emit('test', 10, ['a', 'b', 'c']);
            expect(handler.inUse('test', ['a', 'b', 'c'])).toStrictEqual(false);
            handler.emit('test', 10, ['a', 'b', 'c']);
            expect(cool).toStrictEqual(1);
        });

        it('Checking amount of listners', function () {
            let handler = new EventHandlerSub<{ test: number }>();
            handler.on("test", () => { });
            handler.on("test", () => { });
            handler.on("test", () => { });
            handler.on("test", () => { }, ['test']);
            handler.on("test", () => { }, ['test']);
            expect(handler.amount('test')).toStrictEqual(3);
            expect(handler.amount('test', ['test'])).toStrictEqual(2);
        });
    });
});