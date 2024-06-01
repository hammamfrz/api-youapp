import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RabbitmqService } from '../rabbitmq.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async sendMessage(senderId: string, receiverId: string, content: string) {
    const message = { senderId, receiverId, content, createdAt: new Date() };
    await this.rabbitmqService.sendMessage(message);

    return await this.prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
        createdAt: message.createdAt,
      },
    });
  }

  async receiveMessage(userId: string) {
    const newMessage = await this.rabbitmqService.receiveMessage();

    if (!newMessage) {
      return null;
    }
    return await this.prisma.message.findMany({
      where: {
        receiverId: userId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
