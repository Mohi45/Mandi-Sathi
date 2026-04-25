# Mandi Sathi - Farmer Crop Price Checker

A mobile-first web application that helps farmers in Uttar Pradesh check real-time crop prices from mandis (agricultural markets) using the Data.gov.in API.

## Features

- 📱 **Mobile-First Design** - Fully responsive UI optimized for mobile devices
- 🔍 **Search & Filter** - Filter by district and commodity
- 📊 **Sortable Results** - Sort by price, date, or other columns
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 💾 **Offline Support** - Caches last results in localStorage
- 🔄 **PWA Ready** - Can be installed as a progressive web app
- ⚡ **Fast Performance** - Built with Vite + React

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **PWA**: Vite PWA Plugin

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mandi-sathi
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Usage

1. **Select District**: Choose a district from the dropdown (or leave empty for all districts)
2. **Select Commodity**: Choose a crop/commodity (or leave empty for all commodities)
3. **Get Prices**: Click the button to fetch prices
4. **Search & Sort**: Use the search box to filter results, click column headers to sort

## API Details

- **Data Source**: [data.gov.in](https://data.gov.in) - Agricultural Marketing Information System (AGMARK)
- **API Endpoint**: `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070`
- **API Key**: Configured in `.env` file
- **State**: Default filter is Uttar Pradesh

## Project Structure

```
mandi-sathi/
├── public/
│   ├── favicon.svg
│   └── pwa-192x192.svg
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Filters.jsx
│   │   ├── PriceTable.jsx
│   │   └── Loader.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_KEY=579b464db66ec23bdd000001d7401247e8814ec9754e48d894673d42
VITE_API_URL=https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
```

## License

MIT License - Created for farmers of India 🇮🇳