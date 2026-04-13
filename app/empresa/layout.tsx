import { PanelShell } from "@/components/panel-shell";

export default function EmpresaLayout({ children }: { children: React.ReactNode }) {
  return <PanelShell role="empresa">{children}</PanelShell>;
}
