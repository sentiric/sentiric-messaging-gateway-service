# 💬 Sentiric Messaging Gateway - Kullanım ve Demo Rehberi

Bu belge, çalışan `sentiric-messaging-gateway-service`'in nasıl etkinleştirileceğini ve mesajlaşma akışının nasıl test edileceğini adım adım açıklar.

## Önkoşullar

*   `docker compose` ile tüm servislerin (`messaging-gateway`, `rabbitmq`) çalışır durumda olması.
*   Bir test için kullanılacak ikincil bir WhatsApp hesabına sahip bir telefon.

---

## Uçtan Uca Test Senaryosu: WhatsApp Mesajını RabbitMQ'da Görmek

Bu senaryoda, bir WhatsApp mesajı göndereceğiz ve bu mesajın servis tarafından alınıp, standart bir formata dönüştürülerek RabbitMQ'ya nasıl iletildiğini göreceğiz.

### Adım 1: WhatsApp Bağlantısını Kurma

1.  Aşağıdaki komutla servisin loglarını izlemeye başlayın:
    ```bash
    docker logs -f messaging-gateway
    ```

2.  Terminalde büyük bir **QR kodu** göreceksiniz.

3.  Servise bağlamak istediğiniz telefonda **WhatsApp'ı açın.**
    *   **Ayarlar** > **Bağlı Cihazlar** > **Cihaz Bağla** yolunu izleyin.
    *   Telefonunuzun kamerasıyla terminaldeki QR kodunu taratın.

4.  Bağlantı başarılı olduğunda, loglarda aşağıdaki gibi bir mesaj görmelisiniz:
    ```
    [INFO]: WhatsApp istemcisi hazır!
    ```
    Artık servis, bu WhatsApp hesabından gelen ve bu hesaba gönderilen mesajları yönetmeye hazırdır.

### Adım 2: Test Mesajı Gönderme

1.  **Farklı bir telefondan**, az önce bağladığınız WhatsApp numarasına basit bir mesaj gönderin.
    *   **Örnek Mesaj:** "Merhaba, bu bir test."

2.  `messaging-gateway`'in loglarını izlediğiniz terminalde, anında yeni logların belirdiğini göreceksiniz:
    ```
    [INFO]: {"from":"90555...","body":"Merhaba, bu bir test."} Yeni WhatsApp mesajı alındı
    [INFO]: {"payload":{...}, "routingKey":"incoming.whatsapp"} Mesaj RabbitMQ'ya yayınlandı.
    ```
    Bu, mesajın başarıyla alındığını ve RabbitMQ'ya gönderildiğini kanıtlar.

### Adım 3: Mesajı RabbitMQ Arayüzünde Doğrulama (En Önemli Adım)

Bu adım, mesajın platformun geri kalanı (`agent-service` vb.) tarafından işlenmeye hazır olduğunu %100 doğrular.

1.  Tarayıcınızı açın ve `http://localhost:15672` adresine gidin.
2.  `sentiric` / `sentiric_pass` (veya `.env` dosyanızdaki kullanıcı/şifre) ile giriş yapın.
3.  **"Exchanges"** sekmesine tıklayın.
4.  Listeden **`sentiric_messaging`** adındaki exchange'i bulun ve üzerine tıklayın.
5.  Aşağı kaydırarak **"Get messages"** paneline gelin.
6.  **"Get Message(s)"** butonuna tıklayın.

**Başarılı Sonuç:**
Ekranda, gönderdiğiniz WhatsApp mesajının, servisimiz tarafından standart bir JSON formatına dönüştürülmüş halini göreceksiniz.

**Örnek Payload:**
```json
{
  "channel": "whatsapp",
  "senderId": "905551234567@c.us",
  "text": "Merhaba, bu bir test.",
  "timestamp": "2025-08-08T13:30:00.123Z"
}