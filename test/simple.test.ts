import { describe, it, expect } from '@jest/globals';
import { EventHandler } from "../src";

describe('Simple Event Handler', function () {
    describe('Init', function () {
        it('Create Simple Event Handler', function () {
            let handler = new EventHandler();
        });
        it('Create Simple Event Handler With Types', function () {
            let handler = new EventHandler<{ test: number }>();
            handler.on('test', (e) => {
                e.type;
                e.target;
                e.data;
            });
        });
    });

    describe('Adding and removing listeners', function () {
        it('Checking if listener is added to handler with single type', function () {
            let handler = new EventHandler<{ test: number }>();
            expect(handler.inUse('test')).toStrictEqual(false);
            handler.on("test", () => { });
            expect(handler.inUse('test')).toStrictEqual(true);
        });
        it('Checking if listener is added to handler with multiple types', function () {
            let handler = new EventHandler<{ test: number, test2: number, test3: number }>();
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
            let handler = new EventHandler<{ test: number }>();
            expect(handler.inUse('test')).toStrictEqual(false);
            let lis = handler.on("test", () => { });
            expect(handler.has('test', lis)).toStrictEqual(true);
        });
        it('Checking if listener is removed from handler with single type', function () {
            let handler = new EventHandler<{ test: number }>();
            let lis = handler.on("test", () => { });
            expect(handler.inUse('test')).toStrictEqual(true);
            handler.off("test", lis);
            expect(handler.inUse('test')).toStrictEqual(false);
        });
        it('Checking if listener is removed from handler with multiple types', function () {
            let handler = new EventHandler<{ test: number, test2: number, test3: number }>();
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
            let handler = new EventHandler<{ test: number, test2: number, test3: number }>();
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
            let handler = new EventHandler<{ test: number }>();
            handler.on("test", (e) => {
                expect(e.type).toStrictEqual('test');
                expect(e.target).toStrictEqual(handler);
                expect(e.data).toStrictEqual(10);
                done()
            });
            handler.emit('test', 10);
        });

        it('Checking if values are correct when dispatching event with once option set true', function () {
            let handler = new EventHandler<{ test: number }>();
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

        it('Checking amount of listners', function () {
            let handler = new EventHandler<{ test: number }>();
            handler.on("test", () => { });
            handler.on("test", () => { });
            handler.on("test", () => { });
            expect(handler.amount('test')).toStrictEqual(3);
        });
    });


    describe('Target override', function () {
        it('Target override event', function (done) {
            let target = {
                test1: 5,
                test2: 'string'
            }
            let handler = new EventHandler<{ test: number }, typeof target>();
            handler.target = target;
            handler.on("test", (e) => {
                expect(e.type).toStrictEqual('test');
                expect(e.target).toStrictEqual(target);
                expect(e.data).toStrictEqual(10);
                expect(e.target.test1).toStrictEqual(5);
                expect(e.target.test2).toStrictEqual('string');
                done()
            });
            handler.emit('test', 10);
        });
    });
});