# RestoReserve 📅

A sleek and user-friendly reservation portal built with **AnalogJS** (the fullstack meta-framework for Angular). This application provides a seamless booking experience, public catalog viewing, and direct integration with the RestoSystem-API.

## ✨ Key Features

- **Interactive Reservations**: Intuitive interfaces for customers to make and manage their restaurant reservations.
- **Public Product Catalog**: Dynamic fetching and display of available buffet and alacarte items directly from the backend.
- **Modern Layout Structure**: Clean, organized, and responsive layouts designed for a premium aesthetic and optimal user experience.
- **API Integration**: Robust and adaptive data fetching logic, seamlessly connecting with the Laravel API.

## 🚀 Tech Stack

- **Framework**: [AnalogJS](https://analogjs.org) (Angular + Vite)
- **Language**: TypeScript
- **Testing**: [Vitest](https://vitest.dev)

## 📦 Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm start
```

## 🛠️ Configuration

To build the client/server project, run:

```bash
npm run build
```

The client build artifacts are located in the `dist/analog/public` directory, and the server artifacts in `dist/analog/server`.

## 📖 Architecture Highlights

- **File-based Routing**: Utilizes AnalogJS's efficient routing mechanism (e.g., `[branchSlug].page.ts`) for clean component handling.
- **Service-Oriented Data Fetching**: Clean separation of concerns when retrieving data from endpoints like `/api/public/products...`.
- **Modern Angular Lifecycle**: Embraces the latest Angular features to ensure stability and state management throughout the application.

---

Developed with ❤️ for Modern Restaurants.
