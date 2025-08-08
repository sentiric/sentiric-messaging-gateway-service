# 💬 Sentiric Messaging Gateway Service

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Node.js Version](https://img.shields.io/badge/node-20.x-green.svg)](https://nodejs.org/)
[![Framework](https://img.shields.io/badge/framework-Node.js-blueviolet.svg)]()
[![License](https://img.shields.io/badge/license-UNLICENSED-lightgrey.svg)]()

**Sentiric Messaging Gateway Service**, Sentiric platformunu "ses"in ötesine taşıyarak **Omnichannel (Çoklu Kanal)** yetenekleri kazandıran kritik bir giriş kapısıdır. Temel görevi, WhatsApp ve Telegram gibi harici metin tabanlı mesajlaşma platformları ile Sentiric'in merkezi beyni (`agent-service`) arasında bir köprü kurmaktır.

Bu servis, farklı kanallardan gelen mesajları standart bir formata dönüştürür ve platformun merkezi olay akışına (`RabbitMQ`) dahil eder.

## ✨ Temel Özellikler ve Mimari

*   **Çoklu Kanal Desteği:** `whatsapp-web.js` kullanarak WhatsApp entegrasyonu için sağlam bir temel sunar. Mimarisi, gelecekte Telegram (`telegraf`), SMS ve diğer platformların "Kanal Adaptörleri" olarak kolayca eklenmesine olanak tanır.
*   **Dayanıklı ve Olay Tabanlı (Event-Driven):** Gelen her mesaj, anında işlenip standart bir formatta `RabbitMQ`'ya yayınlanır. Bu, servisler arasında tam bir bağımsızlık (decoupling) sağlar ve sistemin genel dayanıklılığını artırır.
*   **Kalıcı Oturum Yönetimi:** WhatsApp bağlantısı için oluşturulan oturum bilgileri, bir Docker `volume`'ü sayesinde kalıcı olarak saklanır. Bu, servisin yeniden başlatılması durumunda her seferinde QR kodunu yeniden taratma ihtiyacını ortadan kaldırır.
*   **Optimize Edilmiş Dağıtım:** Multi-stage `Dockerfile`, `whatsapp-web.js`'in gerektirdiği `chromium` gibi ağır sistem bağımlılıklarını kurarken, son üretim imajını mümkün olduğunca hafif tutacak şekilde tasarlanmıştır.

## 🚀 Hızlı Başlangıç (Docker ile)

Bu servis, `sentiric-infrastructure` reposundaki merkezi `docker-compose` ile platformun bir parçası olarak çalışmak üzere tasarlanmıştır. Tek başına çalıştırmak ve test etmek için:

1.  **Altyapıyı Başlatın:** `messaging-gateway`, `rabbitmq` servisine bağımlıdır. `sentiric-infrastructure` reposundan bu servisi başlatın.
    ```bash
    docker compose up -d rabbitmq
    ```

2.  **`.env.docker` Dosyası Oluşturun:**
    Proje için gerekli `RABBITMQ_URL` gibi ortam değişkenlerini içeren bir `.env.docker` dosyası oluşturun.

3.  **Servisi Başlatın:**
    ```bash
    docker compose -f docker-compose.service.yml up --build -d
    ```

4.  **Logları İzleyin ve QR Kodunu Taratın:**
    ```bash
    docker logs -f messaging-gateway
    ```
    Terminalde bir QR kodu belirecektir. Bu kodu telefonunuzdaki WhatsApp uygulamasından (Ayarlar > Bağlı Cihazlar > Cihaz Bağla) taratın. Başarıyla bağlandığınızda, loglarda `WhatsApp istemcisi hazır!` mesajını göreceksiniz.

## 🤖 Kullanım ve Uçtan Uca Test

Servisin çalıştığını ve mesajları RabbitMQ'ya doğru bir şekilde ilettiğini doğrulamak için lütfen aşağıdaki demo rehberini inceleyin:

➡️ **[Kullanım ve Demo Rehberi (DEMO.md)](DEMO.md)**

## 💻 Yerel Geliştirme ve Test

1.  Node.js v20+ ve `npm` kurulu olduğundan emin olun.
2.  Bağımlılıkları kurun:
    ```bash
    npm install
    ```
3.  Servisi geliştirme modunda (hot-reload ile) başlatın:
    ```bash
    npm run dev
    ```
4.  Testleri çalıştırın:
    ```bash
    npm test
    ```
---
Bu servis, `sentiric-governance`'da belirtilen tüm modernizasyon, standardizasyon ve gözlemlenebilirlik ilkelerine uygun olarak geliştirilmiştir.