# 💬 Sentiric Messaging Gateway Service - Geliştirme Yol Haritası (v4.0)

Bu belge, servisin geliştirme görevlerini projenin genel fazlarına uygun olarak listeler.

---

### **FAZ 1: Gelen WhatsApp Mesajları (Mevcut Durum)**

**Amaç:** WhatsApp kanalından gelen mesajları güvenilir bir şekilde platforma aktarabilen temel bir ağ geçidi oluşturmak.

-   [x] **Görev ID: MSG-CORE-01 - WhatsApp Web Entegrasyonu**
    -   **Durum:** ✅ **Tamamlandı**
    -   **Kabul Kriterleri:** Servis, `whatsapp-web.js` kullanarak QR kod ile bir WhatsApp hesabına bağlanır ve gelen mesajları konsola yazdırabilir. Oturum, Docker volume sayesinde yeniden başlatmalarda korunur.

-   [x] **Görev ID: MSG-CORE-02 - RabbitMQ Yayıncısı**
    -   **Durum:** ✅ **Tamamlandı**
    -   **Kabul Kriterleri:** Alınan her WhatsApp mesajı, `{"eventType": "message.received", "channel": "whatsapp", "from": "...", "text": "..."}` gibi standart bir JSON formatına çevrilir ve `call.events` exchange'ine yayınlanır.

---

### **FAZ 2: İki Yönlü İletişim ve Yeni Kanallar (Sıradaki Öncelik)**

**Amaç:** Platformun tek yönlü bir dinleyiciden, metin tabanlı kanallar üzerinden cevap verebilen iki yönlü bir iletişim aracına dönüşmesini sağlamak.

-   [ ] **Görev ID: MSG-GW-001 - Giden Mesaj Yeteneği**
    -   **Açıklama:** RabbitMQ'dan gelen "gönder" komutlarını işleyerek ilgili kanaldan dışarıya mesaj gönderme yeteneği ekle.
    -   **Kabul Kriterleri:**
        -   [ ] Servis, `outgoing_messages` adında yeni bir RabbitMQ kuyruğunu dinlemelidir.
        -   [ ] Bu kuyruğa `{"channel": "whatsapp", "to": "90555...", "text": "Randevunuz onaylandı."}` formatında bir mesaj bırakıldığında, mesaj ilgili WhatsApp kullanıcısına başarıyla gönderilmelidir.
        -   [ ] Gönderim başarılı veya başarısız olduğunda, sonuç bir `message.sent` veya `message.failed` olayı olarak `call.events` exchange'ine geri yayınlanmalıdır.

-   [ ] **Görev ID: MSG-GW-002 - Telegram Adaptörü**
    -   **Açıklama:** `telegraf` kütüphanesini kullanarak Telegram Bot API'si için bir kanal adaptörü oluştur.
    -   **Kabul Kriterleri:**
        -   [ ] `.env` dosyasından okunan bir `TELEGRAM_BOT_TOKEN` ile Telegram'a bağlanabilmelidir.
        -   [ ] Gelen Telegram mesajlarını, `channel: "telegram"` etiketiyle standart olay formatına çevirip `call.events`'e yayınlamalıdır.
        -   [ ] `outgoing_messages` kuyruğundan gelen `{"channel": "telegram", ...}` mesajlarını doğru kullanıcıya gönderebilmelidir.

-   [ ] **Görev ID: MSG-GW-003 - Twilio SMS Adaptörü**
    -   **Açıklama:** Twilio API'sini kullanarak SMS alıp gönderebilen bir kanal adaptörü oluştur.
    -   **Kabul Kriterleri:**
        -   [ ] Twilio'dan gelen bir SMS webhook isteğini alıp standart olay formatına çevirerek `call.events`'e yayınlamalıdır.
        -   [ ] `outgoing_messages` kuyruğundan gelen `{"channel": "sms", "to": "...", "text": "..."}` mesajını Twilio API'sini kullanarak SMS olarak gönderebilmelidir.