import { PanelShell } from "@/components/panel-shell";

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return <PanelShell role="cliente">{children}</PanelShell>;
}
