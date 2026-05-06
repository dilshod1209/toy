import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";
import cors from "cors";

const db = new Database("event_master.db");

// Ma'lumotlar bazasini init qilish
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user'
  );

  CREATE TABLE IF NOT EXISTS halls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    price_per_day REAL NOT NULL,
    description TEXT,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hall_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    booking_date TEXT NOT NULL,
    guest_count INTEGER DEFAULT 100,
    status TEXT DEFAULT 'pending',
    total_price REAL,
    customer_name TEXT,
    customer_address TEXT,
    customer_phone TEXT,
    FOREIGN KEY (hall_id) REFERENCES halls (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price_per_person REAL NOT NULL,
    category TEXT
  );

  CREATE TABLE IF NOT EXISTS booking_menus (
    booking_id INTEGER NOT NULL,
    menu_item_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    PRIMARY KEY (booking_id, menu_item_id),
    FOREIGN KEY (booking_id) REFERENCES bookings (id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items (id)
  );
`);

// Migration: Add customer fields if they don't exist
try {
  db.prepare("ALTER TABLE bookings ADD COLUMN customer_name TEXT").run();
  db.prepare("ALTER TABLE bookings ADD COLUMN customer_address TEXT").run();
  db.prepare("ALTER TABLE bookings ADD COLUMN customer_phone TEXT").run();
} catch (e) {
  // Columns probably already exist
}

// Demo ma'lumotlar qo'shish (agar bo'sh bo'lsa)
const hallsCount = db.prepare("SELECT count(*) as count FROM halls").get() as { count: number };
if (hallsCount.count === 0) {
  db.prepare("INSERT INTO halls (name, capacity, price_per_day, description, image_url) VALUES (?, ?, ?, ?, ?)").run(
    "Oltin Vodiy", 500, 5000000, "Hashamatli to'yxana, keng maydon va ajoyib akustika.", "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800"
  );
  db.prepare("INSERT INTO halls (name, capacity, price_per_day, description, image_url) VALUES (?, ?, ?, ?, ?)").run(
    "Yulduzlar", 300, 3500000, "Zamonaviy dizayn, neon chiroqlar va shinam muhit.", "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800"
  );

  db.prepare("INSERT INTO menu_items (name, price_per_person, category) VALUES (?, ?, ?)").run("To'y Oshi", 25000, "Main");
  db.prepare("INSERT INTO menu_items (name, price_per_person, category) VALUES (?, ?, ?)").run("Shashlik assorti", 35000, "Main");
  db.prepare("INSERT INTO menu_items (name, price_per_person, category) VALUES (?, ?, ?)").run("Sezar salati", 15000, "Salad");
  db.prepare("INSERT INTO menu_items (name, price_per_person, category) VALUES (?, ?, ?)").run("Napoleona torti", 20000, "Dessert");

  // Default user qo'shish (agar yo'q bo'lsa)
  const userExists = db.prepare("SELECT * FROM users WHERE id = 1").get();
  if (!userExists) {
    db.prepare("INSERT INTO users (id, name, email, role) VALUES (?, ?, ?, ?)").run(1, "Demo User", "demo@example.com", "user");
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Endpoints
  
  // Zallar ro'yxati
  app.get("/api/halls", (req, res) => {
    const halls = db.prepare("SELECT * FROM halls").all();
    res.json(halls);
  });

  // Bo'sh kunlarni tekshirish
  app.get("/api/check-availability", (req, res) => {
    const { hall_id, date } = req.query;
    const booking = db.prepare("SELECT * FROM bookings WHERE hall_id = ? AND booking_date = ? AND status != 'cancelled'").get(hall_id, date);
    res.json({ available: !booking });
  });

  // Band qilish
  app.post("/api/bookings", (req, res) => {
    const { 
      hall_id, 
      user_id, 
      booking_date, 
      menu_items, 
      guest_count,
      customer_name,
      customer_address,
      customer_phone
    } = req.body;
    
    // Check again before booking
    const existing = db.prepare("SELECT * FROM bookings WHERE hall_id = ? AND booking_date = ? AND status != 'cancelled'").get(hall_id, booking_date);
    if (existing) {
      return res.status(400).json({ error: "Ushbu sana egallangan" });
    }

    const hall = db.prepare("SELECT * FROM halls WHERE id = ?").get(hall_id) as any;
    if (!hall) return res.status(404).json({ error: "Zal topilmadi" });

    let totalPrice = hall.price_per_day;

    const transaction = db.transaction(() => {
      const info = db.prepare(`
        INSERT INTO bookings (
          hall_id, user_id, booking_date, guest_count, 
          customer_name, customer_address, customer_phone
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        hall_id, user_id, booking_date, guest_count, 
        customer_name, customer_address, customer_phone
      );
      const bookingId = info.lastInsertRowid;

      if (menu_items && Array.isArray(menu_items)) {
        const stmt = db.prepare("INSERT INTO booking_menus (booking_id, menu_item_id) VALUES (?, ?)");
        const menuStmt = db.prepare("SELECT price_per_person FROM menu_items WHERE id = ?");
        for (const itemId of menu_items) {
          stmt.run(bookingId, itemId);
          const item = menuStmt.get(itemId) as any;
          if (item) {
            totalPrice += item.price_per_person * guest_count;
          }
        }
      }

      db.prepare("UPDATE bookings SET total_price = ? WHERE id = ?").run(totalPrice, bookingId);
      return bookingId;
    });

    try {
      const bookingId = transaction();
      console.log(`Booking created successfully: ${bookingId}`);
      res.json({ success: true, bookingId });
    } catch (err) {
      console.error("Booking error:", err);
      res.status(500).json({ error: "Saqlashda xatolik yuz berdi: " + (err instanceof Error ? err.message : String(err)) });
    }
  });

  // Menyular
  app.get("/api/menu-items", (req, res) => {
    const items = db.prepare("SELECT * FROM menu_items").all();
    res.json(items);
  });

  // Admin endpoints
  app.get("/api/admin/bookings", (req, res) => {
    const bookings = db.prepare(`
      SELECT b.*, h.name as hall_name 
      FROM bookings b 
      JOIN halls h ON b.hall_id = h.id
      ORDER BY b.booking_date DESC
    `).all();
    res.json(bookings);
  });

  app.post("/api/admin/bookings/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare("UPDATE bookings SET status = ? WHERE id = ?").run(status, id);
    res.json({ success: true });
  });

  // Vite development middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
