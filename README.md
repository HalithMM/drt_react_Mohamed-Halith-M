# React + TypeScript + Vite

 This is a real-world application to track and analyze space objects using actual satellite data from Digantara. The interface supports search, filtering, virtualization for large datasets, row selection, and local persistence.

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
- **TailwindCSS** – For utility-first responsive styling
- **Material UI (MUI)** – For reusable UI components
- **TanStack Table & Virtual** – For efficient, virtualized table rendering
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
Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
