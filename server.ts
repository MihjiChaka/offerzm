import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Payment API Endpoint
  // This uses Flutterwave as an example gateway which is popular in Zambia
  app.post("/api/pay", async (req, res) => {
    const { phone, amount, name, provider, serviceTitle } = req.body;

    try {
      // In a real scenario, you would call a payment gateway like Flutterwave
      // Documentation: https://developer.flutterwave.com/docs/collecting-payments/mobile-money/zambia/
      
      const secretKey = process.env.FLW_SECRET_KEY;
      
      if (!secretKey) {
        console.log("DEMO MODE: No FLW_SECRET_KEY found. Simulating success.");
        return res.json({ status: "success", message: "Demo payment initiated" });
      }

      const response = await axios.post(
        "https://api.flutterwave.com/v3/charge?type=mobile_money_zambia",
        {
          amount: amount.replace('K', ''),
          currency: "ZMW",
          phone_number: phone,
          network: provider.toUpperCase(), // MTN, AIRTEL, ZAMTEL
          email: "customer@example.com",
          tx_ref: `ZCV-${Date.now()}`,
          fullname: name,
          meta: {
            service: serviceTitle,
            owner_number: "+260977572626"
          }
        },
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );

      res.json(response.data);
    } catch (error: any) {
      console.error("Payment API Error:", error.response?.data || error.message);
      res.status(500).json({ 
        status: "error", 
        message: error.response?.data?.message || "Payment initiation failed" 
      });
    }
  });

  // Orders API Endpoint (Mock for now)
  app.get("/api/orders", (req, res) => {
    res.json([
      { id: '101', serviceName: 'Job Seeker Package', status: 'In Progress', createdAt: new Date().toISOString(), amount: 'K150' },
      { id: '102', serviceName: 'CV Optimization', status: 'Completed', createdAt: new Date(Date.now() - 86400000).toISOString(), amount: 'K100' }
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
