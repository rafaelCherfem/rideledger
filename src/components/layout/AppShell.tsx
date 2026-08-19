import { ArrowLeftRight, Car, LogOut, Receipt, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { RoadDivider } from "@/components/illustrations/RoadDivider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut } from "@/services/auth.service";

const navItems = [
  { to: "/", label: "Passageiros", icon: Users },
  { to: "/diarias", label: "Diárias", icon: Car },
  { to: "/cobrancas", label: "Cobranças", icon: Receipt },
  { to: "/compensacoes", label: "Compensações", icon: ArrowLeftRight },
];

export function AppShell() {
  return (
    <div className="min-h-svh">
      <header className="px-6 pt-5">
        <div className="flex items-center justify-between pb-4">
          <span className="text-lg font-semibold tracking-tight">
            RideLedger
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut()}
            aria-label="Sair"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        <RoadDivider />
      </header>

      <main className="pb-24">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-white/5 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-lg items-stretch justify-around px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                cn(
                  "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium opacity-60 transition-opacity",
                  isActive && "opacity-100",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      isActive &&
                        "text-[hsl(var(--card))] drop-shadow-[0_0_6px_hsl(var(--card)/0.45)]",
                    )}
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
