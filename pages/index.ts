import { createEventHandler } from "../src";

let handler = createEventHandler<{ test: number }, undefined>(undefined);
handler.consumer.on("test", (e) => {
    console.warn('Test');

});
handler.producer.emit('test', 10);