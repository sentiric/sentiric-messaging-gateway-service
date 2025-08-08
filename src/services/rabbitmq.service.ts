import amqp from 'amqplib'; // <-- DÜZELTME BURADA
import logger from '../utils/logger.js';

const EXCHANGE_NAME = 'sentiric_messaging';
let channel: amqp.Channel;

export async function connectRabbitMQ(rabbitmqUrl: string) {
  try {
    const connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
    logger.info('RabbitMQ bağlantısı başarılı ve exchange doğrulandı.');
  } catch (error) {
    logger.error(error, 'RabbitMQ bağlantısı kurulamadı!');
    throw error;
  }
}

export function publishMessage(payload: Record<string, any>) {
  if (!channel) {
    logger.error('RabbitMQ kanalı mevcut değil. Mesaj yayınlanamadı.');
    return;
  }
  const routingKey = `incoming.${payload.channel}`; // Örn: incoming.whatsapp
  const message = Buffer.from(JSON.stringify(payload));
  
  channel.publish(EXCHANGE_NAME, routingKey, message, { persistent: true });
  logger.info({ payload, routingKey }, 'Mesaj RabbitMQ\'ya yayınlandı.');
}