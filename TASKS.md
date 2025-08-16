# 💬 Sentiric Messaging Gateway Service - Görev Listesi

Bu belge, `messaging-gateway-service`'in geliştirme yol haritasını ve önceliklerini tanımlar.

---

### Faz 1: WhatsApp Entegrasyonu (Mevcut Durum)

Bu faz, servisin WhatsApp kanalını güvenilir bir şekilde platforma bağlamasını hedefler.

-   [x] **WhatsApp Adaptörü:** `whatsapp-web.js` kullanarak gelen mesajları dinleme.
-   [x] **QR Kod ile Bağlantı:** Oturum başlatmak için terminalde QR kod gösterme.
-   [x] **Kalıcı Oturum:** Docker volume kullanarak oturumun yeniden başlatmalarda korunması.
-   [x] **RabbitMQ Yayıncısı:** Gelen mesajları standart bir JSON formatına çevirip `sentiric_messaging` exchange'ine yayınlama.

---

### Faz 2: Giden Mesajlar ve Yeni Kanallar (Sıradaki Öncelik)

Bu faz, platformun tek yönlü bir dinleyiciden, iki yönlü bir iletişim aracına dönüşmesini hedefler.

-   [ ] **Görev ID: MSG-GW-001 - Giden Mesaj Kuyruğu**
    -   **Açıklama:** RabbitMQ'da `outgoing_messages` adında yeni bir kuyruk dinle. Bu kuyruğa gelen mesajları (örn: `{"channel": "whatsapp", "to": "...", "text": "..."}`) ilgili kanal adaptörünü kullanarak gönder.
    -   **Durum:** ⬜ Planlandı.

-   [ ] **Görev ID: MSG-GW-002 - Telegram Adaptörü**
    -   **Açıklama:** `telegraf` kütüphanesini kullanarak Telegram Bot API'si için bir kanal adaptörü oluştur. Hem gelen hem de giden mesajları desteklemeli.
    -   **Durum:** ⬜ Planlandı.

-   [ ] **Görev ID: MSG-GW-003 - Twilio SMS Adaptörü**
    -   **Açıklama:** Twilio API'sini kullanarak SMS alıp gönderebilen bir kanal adaptörü oluştur.
    -   **Durum:** ⬜ Planlandı.