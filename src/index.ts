import Fastify from 'fastify';
import configPlugin from './config.js';
import { connectRabbitMQ } from './services/rabbitmq.service.js';
import { WhatsAppAdapter } from './channels/whatsapp.adapter.js';
import logger from './utils/logger.js';

async function main() {
  const server = Fastify({ logger });

  try {
    // 1. Önce config plugin'ini yükle
    await server.register(configPlugin);
    
    logger.info('Messaging Gateway başlatılıyor...');
    
    // 2. RabbitMQ'ya server.config'deki URL ile bağlan
    await connectRabbitMQ(server.config.RABBITMQ_URL);
    
    // 3. Kanal adaptörlerini başlat
    const whatsappAdapter = new WhatsAppAdapter();
    await whatsappAdapter.initialize();
    
    logger.info('Tüm kanallar dinlemede. Servis çalışıyor.');
    
    // API sunucusunu başlatmaya gerek yok, çünkü bu servis sadece
    // bir arka plan "worker"ı gibi çalışıyor.
    // Eğer bir API sunmak istersek, server.listen() çağrısı yapardık.

  } catch (err) {
    logger.error(err, 'Servis başlatılırken kritik bir hata oluştu.');
    process.exit(1);
  }
}

main();