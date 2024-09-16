import {
  MessageHandlerErrorBehavior,
  RabbitRPC,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import * as amqplib from 'amqplib';

interface Params {
  exchange: string;
  service: string;
  cmd: string;
  type: 'rpc' | 'sub';
}

export function RMQMessage({ exchange, service, cmd, type }: Params): any {
  const routingKey = service + '.cmd.' + cmd;
  const queue = service + '-' + cmd.replace('.', '-').toLowerCase() + '-queue';

  let Handler = RabbitSubscribe;
  const options = {
    exchange,
    routingKey: routingKey,
    errorBehavior: MessageHandlerErrorBehavior.ACK,
    errorHandler: ReplyErrorCallback,
  } as any;

  if (type === 'rpc') {
    Handler = RabbitRPC;
    options.queue = queue;
  }

  return Handler(options);
}

export function ReplyErrorCallback(
  channel: amqplib.Channel,
  msg: amqplib.ConsumeMessage,
  error: any,
) {
  const { replyTo, correlationId } = msg.properties;

  if (replyTo) {
    if (error instanceof Error) {
      error = error.message;
    } else if (typeof error !== 'string') {
      error = JSON.stringify(error);
    }

    error = Buffer.from(JSON.stringify({ status: 'error', message: error }));

    channel.publish('', replyTo, error, { correlationId });
    channel.ack(msg);
  }
}
