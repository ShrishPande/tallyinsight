# TallyInsight Dashboard

A modern, React-based financial dashboard designed to integrate with **Tally Prime**. This application fetches real-time financial data via Tally's XML HTTP API, visualizes it through interactive charts, and utilizes **Google Gemini AI** to provide automated financial insights and strategic recommendations.

![Dashboard Preview](https://via.placeholder.com/800x400?text=TallyInsight+Dashboard+Preview)

## 🚀 Key Features

### 📊 Financial Intelligence
- **Interactive Dashboard**: Real-time visualization of Revenue, Net Profit, Cash Balance, and GST Payable.
- **KPI Drill-Down**: Click on any KPI card to view a detailed breakdown (e.g., Cash vs Bank, SGST vs CGST).
- **Receivables Aging**: Track outstanding invoices with aging buckets (0-30, 31-60, 61-90, 90+ days) and action shortcuts.
- **AI Financial Analyst**: Uses **Google Gemini 2.5 Flash** to generate instant summaries, risk assessments, and strategic advice based on your current financial data.

### 💼 Transaction Management
- **Sales & Purchase Registers**: Comprehensive tabular views of all transactions.
- **Advanced Filtering**: Filter by status (Paid, Pending, Overdue) and search by Party Name or Invoice Number.
- **CSV Export**: Export filtered transaction lists to CSV for external analysis.
- **Voucher Details**: Deep-dive modal view for individual invoices showing line-item details and raw XML audit data.

### ⚙️ Application Features
- **Multi-Company Simulation**: Switch between different companies (Demo Mode).
- **Dark Mode**: Fully supported system-wide dark theme.
- **Date Range Picker**: Filter dashboard data by specific timeframes.
- **Tally Integration**: Connects directly to Tally Prime running on a local network.
- **Demo Mode**: Robust simulation mode with realistic mock data to explore features without an active Tally connection.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **Charts**: Recharts
- **AI Integration**: Google GenAI SDK (@google/genai)
- **Data Parsing**: Native DOMParser for Tally XML responses

## ⚙️ Prerequisites

1. **Node.js** (v16 or higher)
2. **Tally Prime** (Running locally or on the network) for live data.
3. **Google Gemini API Key** for AI insights.

## 🔧 Tally Prime Configuration

To fetch data from Tally Prime directly from a browser, you must configure Tally to act as an HTTP Server.

1. Open Tally Prime.
2. Go to **F1: Help** > **Settings** > **Connectivity** > **Client/Server Configuration**.
3. Set **Enable Tally Prime to act as HTTP/HTTPS Server** to `Yes`.
4. Note the **Port Number** (Default is `9000`).

### ⚠️ CORS Issue
By default, browsers block requests from your web app (e.g., `localhost:3000`) to Tally (`localhost:9000`) due to CORS (Cross-Origin Resource Sharing).

**Solutions:**
1. **Demo Mode**: Use the built-in "Demo Mode" in the Settings tab to bypass Tally connection entirely for testing.
2. **Proxy Server**: Set up a small Node.js proxy server to forward requests to Tally.
3. **Browser Extension**: Use a CORS unblocker extension for development purposes (not recommended for production).

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   API_KEY=your_google_gemini_api_key_here
   ```
   *Note: In this specific environment, the API key is injected via process.env automatically.*

3. **Run the Application**
   ```bash
   npm start
   ```

4. **Open in Browser**
   Navigate to `http://localhost:3000` (or the provided URL).

## 📂 Project Structure

```
/
├── components/           # React UI Components
│   ├── Dashboard.tsx     # Main charts, KPI cards, and Drill-down modals
│   ├── ReceivablesAging.tsx # Aging report table
│   ├── SalesRegister.tsx # Sales table with Export/Search
│   ├── PurchaseRegister.tsx # Purchase table with Export/Search
│   ├── VoucherModal.tsx  # Shared modal for transaction details
│   ├── Layout.tsx        # App Shell (Sidebar, Dark mode, Navigation)
│   └── Settings.tsx      # Configuration form
├── services/             # API Logic
│   ├── tallyService.ts   # XML Request builder & gateway
│   ├── mockApi.ts        # Simulated backend for Demo Mode
│   └── geminiService.ts  # AI integration logic
├── utils/                # Helpers
│   └── xmlHelper.ts      # XML parsing utilities
├── types.ts              # TypeScript interfaces
├── App.tsx               # Main entry logic & Global State
└── index.tsx             # React DOM render
```

## 🧠 AI Insights

The dashboard sends aggregated monthly totals to the Gemini API. The AI analyzes trends (e.g., declining sales, increasing expenses) and returns a JSON response containing:
- **Summary**: A human-readable status report.
- **Recommendation**: Actionable business advice.
- **Risk Assessment**: Low/Medium/High risk flag.

## 📜 License

MIT License. Free to use and modify.