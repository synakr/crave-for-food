# 🍜 Crave

> 📍 Discover. Share. Explore.

A location-based food discovery app built with React Native and Expo.

Instead of scrolling through a traditional social media feed, users explore food experiences directly on a map. Food photos appear as interactive bubbles pinned to real-world locations, allowing users to discover hidden food gems nearby.

## 🛠️ Tech Stack

- ⚛️ React Native
- 🚀 Expo
- 🧭 Expo Router
- 📘 TypeScript
- 🗄️ Supabase
- 🗺️ React Native Maps

## 📱 What Crave Does

Crave allows users to discover and share location-based content.

Core areas include:

- 🔎 Explore
- 📸 Posts
- 👤 Profiles
- 💬 Comments
- 🏆 Leaderboard
- 📍 Location-based discovery

## 🏗️ Project Structure

```text
app/          → 📱 Screens and routes
components/   → 🧩 Reusable UI components
data/         → 🗃️ Data and repositories
lib/          → 🔧 Shared services/utilities
docs/         → 📚 Project documentation
```

> ℹ️ The exact structure may evolve. See `PROJECT.md` and `docs/ARCHITECTURE.md` for the current architecture.

## ⚙️ Development

### 📦 Install

```bash
npm install
```

### 🚀 Start Expo

```bash
npx expo start
```

### 🤖 Android

```bash
npx expo run:android
```

### 🍎 iOS

```bash
npx expo run:ios
```

## 📚 Project Documentation

For contributors and AI coding agents:

| 📄 File                | 🎯 Purpose                                |
| ---------------------- | ----------------------------------------- |
| `AGENTS.md`            | 🤖 How to work on Crave                   |
| `PROJECT.md`           | 🌍 What Crave is and how it fits together |
| `TODO.md`              | 📋 Current work queue                     |
| `DECISIONS.md`         | 🧠 Important architectural decisions      |
| `docs/ARCHITECTURE.md` | 🏗️ Detailed architecture                  |
| `docs/DATABASE.md`     | 🗄️ Database structure and rules           |
| `docs/features/`       | 🧩 Feature-specific context               |

### 🤖 For AI Agents

Start with:

```text
AGENTS.md
    ↓
PROJECT.md
    ↓
Relevant documentation in docs/
    ↓
Source code
```

> ⚡ Do not read the entire repository blindly. Inspect only the files relevant to the task.

## 🔐 Environment Variables

Create a `.env` file containing the environment variables required by the project.

> 🚨 Never commit secrets or API keys.

## 📌 Project Status

See `TODO.md` for the current implementation status and known work.
