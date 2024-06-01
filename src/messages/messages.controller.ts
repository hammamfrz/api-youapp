import { Controller, Post, Get, Body, Req, Res } from '@nestjs/common';
import { MessageService } from './messages.service';
import { Response } from 'express';
import { RequestWithUser } from 'middleware/auth.middleware';

@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('/api/sendMessage')
  async sendMessage(
    @Body() body: any,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    const { receiverId, content } = body;
    const senderId = req.user.id;

    if (!receiverId || !content) {
      return res
        .status(400)
        .json({ error: 'receiverId and content are required' });
    }

    const message = await this.messageService.sendMessage(
      senderId,
      receiverId,
      content,
    );
    return res
      .status(200)
      .json({ message: 'Message sent successfully', data: message });
  }

  @Get('/api/receiveMessages')
  async receiveMessage(@Req() req: RequestWithUser, @Res() res: Response) {
    const userId = req.user.id;
    const messages = await this.messageService.receiveMessage(userId);
    return res.status(200).json({ data: messages });
  }
}
