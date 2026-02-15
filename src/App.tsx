import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { DashboardPage } from "./features/dashboard/pages/DashboardPage";
import { PrivateRoute } from "./app/router/PrivateRoute";
import { AppShell } from "./shared/ui/AppShell";
import { ProductsListPage } from "./features/products/pages/ProductsListPage";
import { RawMaterialsListPage } from "./features/raw-materials/pages/RawMaterialsListPage";
import { RawMaterialFormPage } from "./features/raw-materials/pages/RawMaterialFormPage";
import { ProductionPage } from "./features/production/pages/ProductionPage";
import { ProductFormPage } from "./features/products/pages/ProductFormPage";
import { NotFoundPage } from "./shared/pages/NotFoundPage";
import { AdminRoute } from "./app/router/AdminRoute";
import { ForbiddenPage } from "./shared/pages/ForbiddenPage";



export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    element={
                        <PrivateRoute>
                            <AppShell />

                        </PrivateRoute>
                    }
                >
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/products" element={<ProductsListPage />} />
                    <Route path="/raw-materials" element={<RawMaterialsListPage />} />
                    <Route path="/production" element={<ProductionPage />} />

                    <Route path="/products/new" element={
                        <AdminRoute>
                            <ProductFormPage />
                        </AdminRoute>
                    }
                    />
                    <Route path="/products/:id" element={
                        <AdminRoute>
                            <ProductFormPage />
                        </AdminRoute>
                    }
                    />
                    <Route path="/raw-materials/new" element={
                        <AdminRoute>
                            <RawMaterialFormPage />
                        </AdminRoute>
                    }
                    />
                    <Route path="/raw-materials/:id" element={
                        <AdminRoute>
                            <RawMaterialFormPage />
                        </AdminRoute>
                    }
                    />

                    <Route path="/forbidden" element={<ForbiddenPage />} />
                    <Route path="*" element={<NotFoundPage />} />


                </Route>
            </Routes>
        </BrowserRouter>
    );
}
