import { Type, Static } from '@sinclair/typebox';
import FastifyEnv from '@fastify/env';
import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

// TypeBox kullanarak şemayı tanımlıyoruz.
// Bu, hem tipi belirler hem de varsayılan değerleri atar.
const ConfigSchema = Type.Object({
  NODE_ENV: Type.String({
    default: 'development',
    enum: ['development', 'production', 'test'],
  }),
  LOG_LEVEL: Type.String({ default: 'info' }),
  // RABBITMQ_URL'nin bir string olmasını ZORUNLU kılıyoruz.
  // .env'de yoksa, @fastify/env plugin'i başlangıçta hata verecektir.
  RABBITMQ_URL: Type.String(), 
});

// Şemadan TypeScript tipini türetiyoruz.
export type Config = Static<typeof ConfigSchema>;

// Fastify'a server.config özelliğini ve tipini bildiriyoruz.
declare module 'fastify' {
  interface FastifyInstance {
    config: Config;
  }
}

const configPlugin: FastifyPluginAsync = async (server) => {
  await server.register(FastifyEnv, {
    confKey: 'config',
    schema: ConfigSchema,
    dotenv: true, // .env dosyasını otomatik yükler
  });
};

export default fp(configPlugin);

// ÖNEMLİ: Eski config kodunu siliyoruz ve bu yeni plugin tabanlı yapıyı kullanıyoruz.
// Bu, tüm yapılandırmayı tek bir yerden, tip güvenli bir şekilde yönetmemizi sağlar.