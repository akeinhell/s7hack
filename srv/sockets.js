import socket from 'socket.io';
import Connection from './sockets';

let io;


class Connection {

    dispatchStorage() {
        storageModel.find()
          .select({ type: 1, sex: 1, count: 1, size: 1, _id: 0 })
          .then(data => this.emit('storage', data))
          .catch(err => logger.error(err));
    }

    dispatchOrders() {
        orderModel.find()
          .select({ __v: 0, _id: 0 })
          .then(data => data.map(addPrefix))
          .then(orders => this.sendOrders(orders))
          .then(() => logger.info('order dispathced'))
          .catch(err => logger.error(err));
    }

    constructor(socket) {
        socket.on('order-update', (info) => {
            logger.info('order-update', info);
            const {id, data} = info;
            orderModel.update({id}, {$set: data})
              .then(() => {
                  this.dispatchOrders();
              })
              .catch(() => {});
        });
        socket.on('get-updates', () => {
            logger.info('get-updates');
            this.dispatchOrders();
            this.dispatchStorage();
        });
        socket.on('add-storage', (info) => {
            const {size, type, count, sex} = info;
            storageModel.update({ size, type, sex},
              { $inc: { count: count } },
              { upsert: true })
              .then(() => this.dispatchStorage())
              .catch(e => {
                  console.error(require('util').inspect(e, { depth: null }));
              });
        });
        this.socket = socket;
        this.dispatchStorage();
        this.dispatchOrders();
    }

    sendOrders(orders) {
        this.emit('orders', orders);
    }

    emit(...args) {
        const arr = args[1] || [];
        logger.info(`emit\t${args[0]}\t ${arr.length} items`);
        io.sockets.emit(...args);
    }
}

const newConnection = (socket) => {
    return new Connection(socket);
};

export const configureSocket = (server) => {
    io = socket(server);
    // io.set('logger', logger);
    io.on('connection', newConnection);
};

export {io};