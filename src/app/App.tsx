import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoginPage } from "@/pages/LoginPage";
import { GuestRoute } from "@/routes/GuestRoute";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

function HomePlaceholder() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="rounded-lg bg-card p-8 text-card-foreground shadow-sm">
        <h1 className="text-xl font-semibold">RideLedger</h1>
        <p className="mt-2 text-sm opacity-70">
          Login funcionando. Próximo módulo: cadastro de passageiros.
        </p>
      </div>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePlaceholder />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
