Points to change : 

1) In "Add Ingredient" there are two plus signs remove one . 

2) remove the demo data from the dashboard . when a new user signs up there should 
be no data but if a previous user logins then it should fetch all the previous data . And if the user logs out and logs in again it should fetch the previous data .

3) Instead of a single page dashboard , I want different page navigations ( through navbar) one can be for inventory stock management , second for ingredients update and the main dashboard page which shows after login should show a welcome message with a beautiful background image or banner and try to add some animations ( animated ingredients or images) 

4) Live notifications for low stock ingredients ( or any updates ) (Use websockets.io).

---

# Implementation & Backend Architecture Report

All requested tasks have been successfully implemented and tested. Below is the detailed breakdown of how each point was solved and how data flows through the backend.

---

## 1. Summary of Changes Made

### 1) Removed Duplicate Plus Sign from "Add Ingredient"
- **Location:** Ingredients action header in [IngredientsUpdate.jsx](file:///c:/Users/manvi/Desktop/inventory_management/BakeLytics/frontend/src/pages/dashboard/IngredientsUpdate.jsx) and the main dashboard.
- **Fix:** Previously, the button rendered both a Lucide `<Plus />` icon and a literal `"+"` character in the label (`<span>+ Add Ingredient</span>`). The literal plus was removed so only a single cleanly-styled plus icon remains (`<Plus size={16} /><span>Add Ingredient</span>`).

### 2) User-Isolated Real Data (Zero Demo Data for New Users & Persistent Data for Returning Users)
- **Problem:** Previously, the dashboard hardcoded `DEFAULT_INVENTORY` whenever storage was empty, showing dummy flour, butter, etc. to any new signup.
- **Solution:** 
  1. Created a dedicated MongoDB Mongoose model: [Ingredient.js](file:///c:/Users/manvi/Desktop/inventory_management/BakeLytics/backend/src/models/Ingredient.js) with `userId` reference and indexing (`{ userId: 1, name: 1 }`).
  2. Implemented private CRUD and deduction endpoints in [ingredientRoutes.js](file:///c:/Users/manvi/Desktop/inventory_management/BakeLytics/backend/src/routes/ingredientRoutes.js) and [ingredientController.js](file:///c:/Users/manvi/Desktop/inventory_management/BakeLytics/backend/src/controllers/ingredientController.js) protected by JWT middleware (`protect`).
  3. When a new user signs up, their ingredient query `Ingredient.find({ userId: req.user._id })` returns an empty array `[]`. No demo data is displayed.
  4. When an existing user logs in, their JWT is verified and only their saved ingredients are loaded from MongoDB.
  5. When logging out and back in, the user context and token reload their specific inventory securely.

### 3) Multi-Page Dashboard Navigation with Banner & Animations
- **Refactored Architecture:** Replaced the single monolithic dashboard with a structured dashboard layout and sub-routes in [App.jsx](file:///c:/Users/manvi/Desktop/inventory_management/BakeLytics/frontend/src/App.jsx):
  - `/dashboard`: **Main Dashboard** ([DashboardHome.jsx](file:///c:/Users/manvi/Desktop/inventory_management/BakeLytics/frontend/src/pages/dashboard/DashboardHome.jsx)) — features an artisan bakery ambient hero banner, floating animated ingredients (`animate-float-gentle` & `animate-float-reverse` for artisan berry cupcakes and chocolates), quick stats, and workflow shortcuts.
  - `/dashboard/stock-management`: **Inventory Stock Management** ([StockManagement.jsx](file:///c:/Users/manvi/Desktop/inventory_management/BakeLytics/frontend/src/pages/dashboard/StockManagement.jsx)) — batch production simulator, live deduction calculations, recipe gross margin calculator, and oven schedule.
  - `/dashboard/ingredients-update`: **Ingredients Update & Pantry Stock** ([IngredientsUpdate.jsx](file:///c:/Users/manvi/Desktop/inventory_management/BakeLytics/frontend/src/pages/dashboard/IngredientsUpdate.jsx)) — raw material table, single "+" Add Ingredient modal, live restock modal, filter pills, search, and delete actions.
  - **Navbar:** [DashboardNavbar.jsx](file:///c:/Users/manvi/Desktop/inventory_management/BakeLytics/frontend/src/components/layout/DashboardNavbar.jsx) provides clean navigation tabs, active tab indicators, and a live WebSocket alert bell.

### 4) Live Stock Notifications via WebSockets (Socket.IO)
- **Backend:** 
  - Installed `socket.io` in the backend and initialized the WebSocket server on the Express HTTP server in [server.js](file:///c:/Users/manvi/Desktop/inventory_management/BakeLytics/backend/src/server.js).
  - Configured user-specific rooms in [socket.js](file:///c:/Users/manvi/Desktop/inventory_management/BakeLytics/backend/src/config/socket.js).
  - Every time stock is added, updated, restocked, or deducted during a bake, the server evaluates `amount <= threshold`. If low stock is detected, it broadcasts a `LOW_STOCK` event to the user's room.
- **Frontend:**
  - Installed `socket.io-client` in the frontend and configured WebSocket reverse proxying in [vite.config.js](file:///c:/Users/manvi/Desktop/inventory_management/BakeLytics/frontend/vite.config.js).
  - Created [socketService.js](file:///c:/Users/manvi/Desktop/inventory_management/BakeLytics/frontend/src/services/socketService.js) and [InventoryContext.jsx](file:///c:/Users/manvi/Desktop/inventory_management/BakeLytics/frontend/src/context/InventoryContext.jsx) to listen to `notification` and `inventoryUpdate` events in real-time.
  - Displays instant live floating toast alerts and an interactive bell dropdown with notification history.

---

## 2. Backend Flow & Architecture

```
[ Frontend Client ] 
        │
        ├── 1. HTTP Requests (Auth & Inventory REST API)
        │       ├── POST /api/auth/register, POST /api/auth/login  ──> [ authController.js ]
        │       │                                                            │
        │       │                                                            ▼
        │       │                                                   [ User Model (MongoDB) ]
        │       │
        │       ├── GET /api/ingredients (Bearer JWT)              ──> [ authMiddleware.js (protect) ]
        │       ├── POST /api/ingredients (Create)                           │
        │       ├── PUT /api/ingredients/:id (Restock/Update)                ▼
        │       ├── DELETE /api/ingredients/:id                     [ ingredientController.js ]
        │       └── POST /api/ingredients/bake-deduct                        │
        │                                                                    ▼
        │                                                           [ Ingredient Model (MongoDB) ]
        │                                                                    │
        │                                                           (Checks amount <= threshold)
        │                                                                    │
        └── 2. WebSockets (Socket.IO Real-time Pipeline)                    │
                │                                                            ▼
                │ ◄────────── Emits 'notification' & 'inventoryUpdate' ── [ socket.js / emitNotification ]
                │             (Targeted to room `user_${userId}`)
                ▼
      [ DashboardNavbar & Floating Toasts ]
```

### Detailed Step-by-Step Flow:
1. **Authentication & Token Issuance:**
   - User signs up or logs in. The backend issues a JWT token encoded with the MongoDB `user._id`.
   - The frontend stores the token in `localStorage` (`bakelytics_token`).

2. **Isolated Database Fetching:**
   - Upon navigating to any dashboard page, `InventoryContext` makes an authorized `GET /api/ingredients` request sending `Authorization: Bearer <token>`.
   - The `protect` middleware decodes the token and attaches `req.user` to the request.
   - The controller executes `Ingredient.find({ userId: req.user._id })`.
   - If the user is new, an empty list `[]` is returned (no dummy items).
   - If the user had previously created ingredients, their saved ingredients are retrieved from MongoDB.

3. **Socket.IO Room Registration:**
   - On mounting, `socketService.js` establishes a WebSocket connection with the backend (`ws://localhost:5000/socket.io`).
   - The client sends `joinUserRoom(user.id)`. The server joins the socket to room `user_${user.id}`.

4. **Live Stock Operations & Instant Alert Dispatch:**
   - When a user performs a stock deduction (e.g. baking 3 batches of bread) or updates an ingredient, the backend calculates the remaining quantity.
   - If `amount <= threshold`, `emitNotification(userId, { type: "LOW_STOCK", message: "...", ... })` is called.
   - The WebSocket server emits the event to the user's room.
   - Any open tab or session for this user immediately receives the alert, increments the unread notification badge on the bell icon, and pops up a live floating alert without needing a page refresh.