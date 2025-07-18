# Sentiric Messaging Gateway Service

**Description:** Integrates the Sentiric platform with various external messaging channels (e.g., WhatsApp, Telegram, SMS), normalizing message formats for internal processing.

**Core Responsibilities:**
*   Receiving incoming messages from external messaging platforms.
*   Normalizing received messages into Sentiric's internal format and forwarding them to `sentiric-agent-service`.
*   Converting responses from `sentiric-agent-service` into the appropriate format for external platforms.
*   Managing platform-specific API authentication and message formats.

**Technologies:**
*   Node.js (or Go)
*   Express/Fiber (for webhooks from messaging platforms)
*   External messaging platform SDKs/APIs (e.g., WhatsApp Business API, Telegram Bot API).

**API Interactions (As an API Provider & Client):**
*   **As a Provider:** Exposes webhooks/APIs for external messaging platforms.
*   **As a Client:** Calls APIs of `sentiric-agent-service`.

**Local Development:**
1.  Clone this repository: `git clone https://github.com/sentiric/sentiric-messaging-gateway-service.git`
2.  Navigate into the directory: `cd sentiric-messaging-gateway-service`
3.  Install dependencies: `npm install` (Node.js) or `go mod tidy` (Go).
4.  Create a `.env` file from `.env.example` to configure external messaging platform credentials and webhook URLs.
5.  Start the service: `npm start` (Node.js) or `go run main.go` (Go).

**Configuration:**
Refer to `config/` directory and `.env.example` for service-specific configurations, including API keys and webhook settings for each messaging platform.

**Deployment:**
Designed for containerized deployment (e.g., Docker, Kubernetes). Refer to `sentiric-infrastructure`.

**Contributing:**
We welcome contributions! Please refer to the [Sentiric Governance](https://github.com/sentiric/sentiric-governance) repository for coding standards and contribution guidelines.

**License:**
This project is licensed under the [License](LICENSE).
