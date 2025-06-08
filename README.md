# React + TypeScript + Vite

This is a real-world application to track and analyze space objects using actual satellite data from Digantara. The interface supports search, filtering, virtualization for large datasets, row selection, and local persistence.

---

## 🚀 Features Implemented

- 🔍 **Search**: By `name` and `noradCatId` (triggered on Enter)
- 🎛️ **Filters**: Object Type and Orbit Code (multi-select with Apply button)
- 📊 **Results Table**: Virtualized, sortable, and responsive
- ✅ **Row Selection**: Up to 10 items, with localStorage persistence
- 🧾 **Selection Summary**: Navigates to a second page showing selected items
- 🔄 **Error & Loading States**: Gracefully handled UI feedback

---

## 🛠️ Tech Stack

- **React** with **TypeScript**
- **TailwindCSS** – Utility-first responsive styling
- **Material UI (MUI)** – Reusable UI components
- **TanStack Table & Virtual** – Efficient virtualized table rendering
- **React Router DOM** – Page navigation

---

## 📦 Installation & Run Instructions

```bash
# Step into the project directory
cd Assessment/drt_react_Mohamed-Halith-M

# Install dependencies
npm install

# Start development server
npm run dev
 
