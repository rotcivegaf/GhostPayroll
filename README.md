# 👻 GhostPayroll

> **Privacy-Preserving Payroll Platform powered by [INTMAX](https://intmax.io/)**  
> 🏁 Built at the ETHCC[8] Hackathon — Cannes 2025 🇫🇷

---

## 🧠 What is GhostPayroll?

**GhostPayroll** is a lightweight, full-featured payroll system that allows employers to send payments to employees **privately**, **securely**, and **at scale** using [intmax2-client-sdk](https://intmax-wallet.gitbook.io/intmax-developers-hub/).

Built with **SvelteKit**, **Prisma**, and **INTMAX**, it enables:

- 🔐 Stateless, stealth address-based payroll
- 🧾 Transparent employee and payment management
- 🖥️ Clean, hackathon-friendly UI
- 🕵️‍♂️ Real privacy, no fake tokens or zk-circuits

---

## ✨ Features

- ✅ Employee CRUD (Create, Read, Update, Delete)
- ✅ Mass payments using `intmaxClient.login()` & stealth addresses
- ✅ History view grouped by date with total and per-user breakdown
- ✅ Real-time stats with total paid and number of recipients
- ✅ Clean UI powered by DaisyUI + TailwindCSS

---

## 🧪 Tech Stack

| Layer         | Tool/Library               |
|---------------|----------------------------|
| Frontend      | [SvelteKit](https://kit.svelte.dev) |
| Styling       | [TailwindCSS](https://tailwindcss.com) + [DaisyUI](https://daisyui.com) |
| Database      | SQLite + Prisma ORM        |
| Privacy Layer | [intmax2-client-sdk](https://intmax-wallet.gitbook.io/intmax-developers-hub) |
| Hosting (dev) | Vite local / preview       |

---

## 🖼️ Screenshots

| Home | Employee Manager | Payment History |
|------|------------------|-----------------|
| ![home](./screens/home.png) | ![employees](./screens/employees.png) | ![history](./screens/history.png) |

---

## 🛠 How to Run

```bash
git clone https://github.com/eugenioclrc/ghostpayroll.git
cd ghostpayroll

npm install
npx prisma generate
npx prisma migrate dev --name init

npm run dev
```
> ⚠️ You need a browser wallet or embedded logic that supports `intmax2-client-sdk`.

* * * * *

🔐 INTMAX Integration
---------------------

GhostPayroll uses the stateless privacy-preserving login flow:

ts

CopyEdit

`import IntmaxClient from 'intmax2-client-sdk';

const intmaxClient = new IntmaxClient();
await intmaxClient.login(); // generates stealth wallet session`

This allows unlinkable payments across sessions. You can later call `sendPayment()` or `signMessage()` for real execution.

* * * * *

👤 Author
---------

Built with ❤️ by **Eugenio** & **Victor**\
Security researchers | L2 hackers | Game devs | ETHCC builders

* * * * *

🏆 Build for ETHCC 2025 Hackathon
-----------------------

-   📍 **Cannes, France**

-   🗓️ July 5--7, 2025

-   🎯 Track: **Privacy / Tooling / Infrastructure**

Hosted by [Ethereum France](https://www.ethcc.io)

* * * * *

🪪 License
----------

MIT --- Free to fork, remix, deploy, or build your own stealth payroll dApp.

* * * * *

> "GhostPayroll makes paying people in private not just possible --- but delightful."
