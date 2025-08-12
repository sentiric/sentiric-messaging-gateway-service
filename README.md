# 💬 Sentiric Messaging Gateway Service

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Node.js Version](https://img.shields.io/badge/node-20.x-green.svg)](https://nodejs.org/)
[![Framework](https://img.shields.io/badge/framework-Node.js-blueviolet.svg)]()

**Sentiric Messaging Gateway Service**, Sentiric platformunu "ses"in ötesine taşıyarak **Omnichannel (Çoklu Kanal)** yetenekleri kazandıran kritik bir giriş kapısıdır. Temel görevi, WhatsApp ve Telegram gibi harici metin tabanlı mesajlaşma platformları ile Sentiric'in merkezi beyni (`agent-service`) arasında bir köprü kurmaktır.

Bu servis, farklı kanallardan gelen mesajları standart bir formata dönüştürür ve platformun merkezi olay akışına (`RabbitMQ`) dahil eder.

## 🎯 Temel Sorumluluklar

*   **Çoklu Kanal Desteği:** `whatsapp-web.js` kullanarak WhatsApp entegrasyonu için sağlam bir temel sunar. Mimarisi, gelecekte Telegram (`telegraf`), SMS ve diğer platformların "Kanal Adaptörleri" olarak kolayca eklenmesine olanak tanır.
*   **Olay Tabanlı (Event-Driven):** Gelen her mesaj, anında işlenip standart bir formatta `RabbitMQ`'ya yayınlanır. Bu, servisler arasında tam bir bağımsızlık (decoupling) sağlar ve sistemin genel dayanıklılığını artırır.
*   **Kalıcı Oturum Yönetimi:** WhatsApp bağlantısı için oluşturulan oturum bilgileri, bir Docker `volume`'ü sayesinde kalıcı olarak saklanır. Bu, servisin yeniden başlatılması durumunda her seferinde QR kodunu yeniden taratma ihtiyacını ortadan kaldırır.

## 🛠️ Teknoloji Yığını

*   **Dil:** TypeScript / Node.js
*   **Kanal Adaptörü:** `whatsapp-web.js`
*   **Asenkron İletişim:** RabbitMQ (`amqplib`)
*   **Loglama:** `pino`

## 🔌 API Etkileşimleri

*   **Giden (Yayıncı):**
    *   `RabbitMQ`: Gelen mesajları standart bir formatta `sentiric_messaging` exchange'ine yayınlar.
*   **Dış Bağlantı:**
    *   WhatsApp Web altyapısıyla sürekli bir WebSocket bağlantısı kurar.

## 🚀 Yerel Geliştirme

1.  **Bağımlılıkları Yükleyin:** `npm install`
2.  **Servisi Geliştirme Modunda Başlatın:** `npm run dev`
3.  Terminalde çıkan QR kodunu WhatsApp'ınızdan taratın.

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen projenin ana [Sentiric Governance](https://github.com/sentiric/sentiric-governance) reposundaki kodlama standartlarına ve katkıda bulunma rehberine göz atın.

---
## 🏛️ Anayasal Konum

Bu servis, [Sentiric Anayasası'nın (v11.0)](https://github.com/sentiric/sentiric-governance/blob/main/docs/blueprint/Architecture-Overview.md) **Zeka & Orkestrasyon Katmanı**'nda yer alan merkezi bir bileşendir.