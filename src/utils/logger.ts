import pino, { LoggerOptions } from 'pino';

const serviceName = 'connectors-service';

// Temel pino ayarları - HER ORTAM İÇİN GEÇERLİ
const pinoOptions: LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
  // Loglara her zaman 'service' alanını ekle.
  // Bu, üretimdeki JSON logları için kritiktir.
  base: {
    service: serviceName,
  },
  // Zaman damgasını standart ISO formatında ayarla
  timestamp: pino.stdTimeFunctions.isoTime,
};

// SADECE GELİŞTİRME ORTAMINDA pino-pretty'i etkinleştir ve yapılandır
if (process.env.NODE_ENV === 'development') {
  pinoOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      // Zaman damgasını daha okunabilir bir formata çevir
      translateTime: 'HH:MM:ss',
      // pino-pretty'nin kendi eklediği alanları yok say, formatı biz kontrol edeceğiz
      ignore: 'pid,hostname,service',
      // İŞTE SİHİR BURADA:
      // Pino tarafından üretilen log objesinden (`log`) istediğimiz alanları
      // kullanarak tek satırlık bir mesaj oluşturuyoruz.
      // `log.service` -> `base` objesinden gelir.
      // `log.msg` -> pino'nun varsayılan mesaj anahtarıdır.
      messageFormat: '({service}) {msg}',
    },
  };
}

const logger = pino(pinoOptions);

export default logger;