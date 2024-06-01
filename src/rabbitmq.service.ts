import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  async connect() {
    this.connection = await amqp.connect('amqp://localhost:5672');
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue('messages', { durable: true });
  }

  async disconnect() {
    await this.channel.close();
    await this.connection.close();
  }

  async sendMessage(message: any) {
    this.channel.sendToQueue('messages', Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
  }

  async receiveMessage() {
    return new Promise((resolve) => {
      this.channel.consume('messages', (msg) => {
        if (msg !== null) {
          this.channel.ack(msg);
          resolve(JSON.parse(msg.content.toString()));
        } else {
          resolve(null);
        }
      });
    });
  }
}
