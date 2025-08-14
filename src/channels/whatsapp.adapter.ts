// Statik import'ları kaldırıyoruz.
import qrcode from 'qrcode-terminal';
import { IChannelAdapter } from '../core/base-channel.js';
import { publishMessage } from '../services/rabbitmq.service.js';
import logger from '../utils/logger.js';
// whatsapp-web.js'den gelen tipleri burada tanımlayacağız
// Bu, kodumuzun geri kalanının tip güvenli olmasını sağlar.
import type { Client, LocalAuth, Message } from 'whatsapp-web.js';

export class WhatsAppAdapter implements IChannelAdapter {
  name = 'whatsapp';
  private client!: Client; // "!" işareti, bu özelliğin constructor'da değil,
                           // initialize'da atanacağını belirtir.

  // Constructor'ı boşaltıyoruz, asenkron initialize'da yapacağız.
  constructor() {}

  public async initialize(): Promise<void> {
    // --- DİNAMİK IMPORT ---
    // Modülü asenkron olarak ve varsayılan export olarak import ediyoruz.
    const wweb = await import('whatsapp-web.js');
    const { Client, LocalAuth } = wweb.default;
    // --- ---

    this.client = new Client({
      authStrategy: new LocalAuth({ dataPath: './wweb_auth' }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    this.client.on('qr', (qr: string) => {
      logger.info('WhatsApp QR kodu, lütfen tarayın:');
      // loglarda gürültü yaratıyor şimdilik kaldırıldı 
      // qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      logger.info('WhatsApp istemcisi hazır!');
    });

    this.client.on('message', async (message: Message) => {
      if (message.fromMe || !message.body) return;
      
      logger.info({ from: message.from, body: message.body }, 'Yeni WhatsApp mesajı alındı');
      
      publishMessage({
        channel: this.name,
        senderId: message.from,
        text: message.body,
        timestamp: new Date(message.timestamp * 1000).toISOString(),
      });
    });

    await this.client.initialize();
  }

  public async sendMessage(to: string, message: string): Promise<void> {
    if (!this.client) {
        throw new Error("WhatsApp client is not initialized.");
    }
    try {
        await this.client.sendMessage(to, message);
        logger.info({ to, message }, 'WhatsApp mesajı başarıyla gönderildi.');
    } catch (error) {
        logger.error({ to, message, error }, 'WhatsApp mesajı gönderilirken hata oluştu.');
        throw error;
    }
  }
}