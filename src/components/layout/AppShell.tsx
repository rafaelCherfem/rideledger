import { LogOut } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut } from "@/services/auth.service";

const navItems = [
  { to: "/", label: "Passageiros" },
  { to: "/diarias", label: "Diárias" },
  { to: "/cobrancas", label: "Cobranças" },
  { to: "/compensacoes", label: "Compensações" },
];

export function AppShell() {
  return (
    <div className="min-h-svh">
      <header className="flex items-center justify-between border-b border-black/10 px-6 py-4">
        <nav className="flex gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium opacity-70 transition-opacity hover:opacity-100",
                  isActive && "opacity-100 underline underline-offset-4",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => signOut()}
          aria-label="Sair"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </header>
      <Outlet />
    </div>
  );
}
