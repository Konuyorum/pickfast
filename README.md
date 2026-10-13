# PickFast 🛍️⚡
### AI-Powered Smart Shopping Intelligence & Comparison Assistant

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Website-brightgreen?style=flat-square)](https://pickfast.shop)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Anthropic%20Claude%203.5%20Haiku-7952b3?style=flat-square)](https://www.anthropic.com)
[![Runtime](https://img.shields.io/badge/Runtime-Cloudflare%20Pages%20Worker-f38020?style=flat-square)](https://pages.cloudflare.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

> **Live Production Website:** [https://pickfast.shop](https://pickfast.shop)

---

## 📌 Executive Summary

**PickFast** is an AI shopping co-pilot designed for global consumers shopping on Amazon.com (USA). Online shoppers spend hours sifting through thousands of sponsored product placements, biased reviews, and complicated specification sheets.

PickFast changes this by employing **Anthropic's Claude 3.5 Haiku** hosted at Cloudflare's edge network. The platform instantly analyzes product queries, summarizes authentic verified customer sentiment, executes head-to-head feature matrix comparisons, and links directly to optimized Amazon listings.

---

## 🚀 Key Features

* **🔍 Smart Intent Classification:** Automatically handles high-level category recommendations (e.g., *"Best Noise Cancelling Headphones"*, *"Ergonomic Office Chair"*) vs. granular single-item verdicts (e.g., *"Sony WH-1000XM5"*).
* **⚔️ "VS Mode" Comparison Engine:** Side-by-side spec comparison table declaring definitive winners per parameter (battery life, build quality, price-to-performance).
* **⚡ Sub-100ms Edge Delivery:** Cloudflare Pages Advanced Workers run across 300+ global data centers for minimal latency.
* **🌐 Amazon.com Global Catalog Targeting:** Evaluates only top-rated, actively stocked products on Amazon US.
* **🔒 Deterministic JSON API Contracts:** Leverages Claude's structured response capability to feed dynamic reactive frontends without client parsing errors.

---

## 🏗️ Architecture & AI Integration

```
[ User Browser (Responsive UI) ]
             │
             ▼
[ Cloudflare Global Edge CDN ]
             │
      /api/search (POST)
             │
             ▼
[ Cloudflare Pages Worker (_worker.js) ]
             │
             ├──► [ Anthropic Claude 3.5 Haiku API ]
             │     └── System Prompt: E-Commerce Product Evaluation
             │     └── Schema: Strict JSON (single, list, comparison)
             │
             └──► [ Fallback AI Engine (Optional) ]
```

### Why Anthropic Claude 3.5 Haiku?
1. **Unrivaled Processing Speed:** Essential for dynamic, real-time search applications.
2. **Superior Instruction Adherence:** Guarantees strict JSON output conforming to strict UI rendering schemas.
3. **Nuanced E-Commerce Sentiment Analysis:** Accurately separates real product quality signals from artificial or sponsored reviews.
4. **Extreme Cost & Token Efficiency:** Designed for high-volume enterprise and consumer consumer workloads.

---

## 🛠️ Tech Stack

- **AI Model:** Anthropic Claude 3.5 Haiku (`claude-3-5-haiku-20241022`)
- **Backend / Edge Runtime:** Cloudflare Pages Advanced Worker (`_worker.js`)
- **Frontend:** Vanilla HTML5, Tailwind CSS, FontAwesome Icons
- **Hosting & Infrastructure:** Cloudflare Pages with SSL & Global Anycast CDN
- **Language:** JavaScript (ES Modules)

---

## 💻 Local Development & Deployment

### Prerequisites
- Node.js (v18+)
- Cloudflare Wrangler CLI (`npm install -g wrangler`)
- Anthropic API Key ([Anthropic Console](https://console.anthropic.com))

### 1. Clone the repository
```bash
git clone https://github.com/Konuyorum/pickfast.git
cd pickfast
```

### 2. Configure Environment Variables
Create a `.dev.vars` file for local development:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-3-5-haiku-20241022
```

### 3. Run Locally with Wrangler
```bash
npx wrangler pages dev .
```
Visit `http://localhost:8788` in your browser.

### 4. Deploy to Cloudflare Pages
```bash
npx wrangler pages deploy .
```
Set `ANTHROPIC_API_KEY` in the Cloudflare Dashboard under:
**Project Settings** ➡️ **Environment Variables** ➡️ **Production**.

---

## 🏢 Company & Organization

- **Organization:** PickFast Technologies
- **Core Team:** PickFast Engineering & AI Research Team
- **Headquarters:** Istanbul, Turkey
- **Official Website:** [https://pickfast.shop](https://pickfast.shop)
- **Corporate Email:** founder@pickfast.shop
- **Support & Inquiries:** info@pickfast.shop

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

