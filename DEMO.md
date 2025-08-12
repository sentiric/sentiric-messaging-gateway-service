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
    make logs SERVICES="messaging-gateway"
    ```

2.  Terminalde büyük bir **QR kodu** göreceksiniz.

3.  Servise bağlamak istediğiniz telefonda **WhatsApp'ı açın.**
    *   **Ayarlar** > **Bağlı Cihazlar** > **Cihaz Bağla** yolunu izleyin.
    *   Telefonunuzun kamerasıyla terminaldeki QR kodunu taratın.

4.  Bağlantı başarılı olduğunda, loglarda aşağıdaki gibi bir mesaj görmelisiniz:
    ```
    {"level":30,"time":...,"service":"connectors-service","msg":"WhatsApp istemcisi hazır!"}
    ```

### Adım 2: Test Mesajı Gönderme

1.  **Farklı bir telefondan**, az önce bağladığınız WhatsApp numarasına basit bir mesaj gönderin. Örnek: "Merhaba, bu bir test."

2.  `messaging-gateway`'in loglarında, mesajın alındığını ve yayınlandığını göreceksiniz:
    ```
    {"level":30,"time":...,"service":"connectors-service","from":"905...","body":"Merhaba, bu bir test.","msg":"Yeni WhatsApp mesajı alındı"}
    {"level":30,"time":...,"service":"connectors-service","payload":{...},"routingKey":"incoming.whatsapp","msg":"Mesaj RabbitMQ'ya yayınlandı."}
    ```

### Adım 3: Mesajı RabbitMQ Arayüzünde Doğrulama

1.  Tarayıcınızı açın ve `http://localhost:15672` adresine gidin.
2.  `sentiric` / `sentiric_pass` ile giriş yapın.
3.  **"Exchanges"** sekmesine tıklayın ve **`sentiric_messaging`** exchange'ini seçin.
4.  **"Get messages"** panelinde **"Get Message(s)"** butonuna tıklayın.

**Başarılı Sonuç:** Ekranda, gönderdiğiniz WhatsApp mesajının, servisimiz tarafından standart bir JSON formatına dönüştürülmüş halini göreceksiniz.