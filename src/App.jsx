import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/Layout";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;