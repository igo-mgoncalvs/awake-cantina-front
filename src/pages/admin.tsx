import {
  useContext,
  useState,
} from "react";
import {
  LayoutDashboard,
  Package,
  RefreshCw,
  RotateCcw,
  Settings2,
  Users,
} from "lucide-react";
import Overview from "@/components/adminTabs/tabs/overview";
import Participants from "@/components/adminTabs/tabs/participants";
import Products from "@/components/adminTabs/tabs/products";
import Sync from "@/components/adminTabs/tabs/sync";
import Finance from "@/components/adminTabs/tabs/finance";
import ParticipantRoles from "@/components/adminTabs/tabs/settings";
import { DataContext } from "@/context/contentContext";

type AdminTab =
  | "overview"
  | "participants"
  | "products"
  | "sync"
  | "finance"
  | "settings";

export default function Admin() {
  const [adminTab, setAdminTab] = useState<AdminTab>("overview");

  const { syncStatus, refresh } = useContext(DataContext)

  return (
    <main className="mx-auto max-w-307.5 px-7.5 pt-10.5 pb-5.5 max-[900px]:px-5 max-[900px]:py-6.75 max-[680px]:px-3.25 max-[680px]:py-5.75">
      <div className="mb-6.75 flex items-center justify-between gap-5 max-[680px]:items-start max-[680px]:flex-col">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-extrabold tracking-[2px] text-purple-700">
            <span className="inline-block h-2 w-2 rounded-full bg-orange-500" />
            PAINEL DA ORGANIZAÇÃO
          </div>

          <h1 className="my-2.5 font-['Barlow_Condensed'] text-[48px] leading-[0.92] font-black tracking-[-0.7px] text-purple-700 uppercase max-[680px]:text-[40px]">
            Central da cantina<span className="text-orange-500">.</span>
          </h1>

          <p className="m-0 text-[13px] leading-[1.7] text-muted max-[680px]:text-[11px]">
            Gerencie a operação do mercadinho Awake Camp.
          </p>
        </div>

        <button
          className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-line bg-white px-3.5 py-2.75  text-purple-700 hover:border-purple-200 hover:bg-purple-50 max-[680px]:text-[10px]"
          onClick={() => void refresh()}
        >
          <RefreshCw size={16} />
          <span className="text-[12px] font-extrabold">
            Atualizar dados
          </span>
        </button>
      </div>

      <div className="mb-5.25 flex gap-1.25 overflow-x-auto border-b border-line">
        {(
          [
            { id: "overview", label: "Visão geral", icon: LayoutDashboard },
            { id: "participants", label: "Participantes", icon: Users },
            { id: "products", label: "Produtos", icon: Package },
            { id: "finance", label: "Financeiro", icon: LayoutDashboard },
            { id: "settings", label: "Limites", icon: Settings2 },
            { id: "sync", label: "Sincronização", icon: RotateCcw },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            className={`flex items-center gap-2 whitespace-nowrap border-0 border-b-[3px] bg-transparent px-4 py-3.5  max-[680px]:px-2.5 max-[680px]:py-3 ${adminTab === t.id
              ? "border-b-orange-500 text-purple-700"
              : "border-b-transparent text-[#8c7b8e]"
              }`}
            onClick={() => {
              setAdminTab(t.id);
            }}
          >
            <t.icon size={17} />
            <span className="text-[11px] font-extrabold max-[680px]:text-[10px]">
              {t.label}
            </span>

            {t.id === "sync" && !!syncStatus?.failed && (
              <span className="rounded-[9px] bg-orange-500 px-1.5 py-0.5 text-white">
                {syncStatus.failed}
              </span>
            )}
          </button>
        ))}
      </div>

      {adminTab === "overview" && <Overview />}
      {adminTab === "participants" && <Participants />}
      {adminTab === "products" && <Products />}
      {adminTab === "finance" && <Finance />}
      {adminTab === "settings" && <ParticipantRoles />}
      {adminTab === "sync" && <Sync />}
    </main>

  )
}