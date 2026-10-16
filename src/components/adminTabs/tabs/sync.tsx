import { DataContext } from "@/context/contentContext"
import { SyncRoutes } from "@/services/sync";
import { customToast } from "@/utils/toast";
import { RotateCcw } from "lucide-react"
import { useContext } from "react"

export default function Sync() {
  const { syncStatus, getSyncStatus } = useContext(DataContext)

  async function retry(eventId?: string, all = false) {
    SyncRoutes.retry({
      ...(eventId ? { eventId } : {}),
      ...(all ? { all: true } : {}),
    })
      .then((result) => {
        customToast({
          message: `${result.found} evento(s) selecionado(s); ${result.queued} reenfileirado(s).`,
          type: 'success'
        })
        getSyncStatus();
      })
      .catch(({ reponse }) => {
        customToast({
          message: reponse.data.message || "Erro ao reenfileirar."
        })
      })
  }
  return (

    <>
      <div className="mb-4.5 grid grid-cols-3 gap-3.25 max-[900px]:grid-cols-2 max-[680px]:grid-cols-1">
        <div className="flex min-w-0 flex-col gap-2 rounded-[10px] border border-line bg-white p-4.75 max-[680px]:p-3.25">
          <span className="text-[10px] font-bold text-[#8a7c8d]">
            Na fila local
          </span>
          <strong className="font-['Barlow_Condensed'] text-[30px] leading-normal font-black text-purple-700 max-[680px]:text-[27px]">
            {syncStatus?.pending ?? "—"}
          </strong>
          <small className="text-[9px] text-[#a294a4]">
            aguardando envio
          </small>
        </div>

        <div className="flex min-w-0 flex-col gap-2 rounded-[10px] border border-line bg-white p-4.75 max-[680px]:p-3.25">
          <span className="text-[10px] font-bold text-[#8a7c8d]">
            Falhas
          </span>
          <strong className="font-['Barlow_Condensed'] text-[30px] leading-normal font-black text-orange-500 max-[680px]:text-[27px]">
            {syncStatus?.failed ?? "—"}
          </strong>
          <small className="text-[9px] text-[#a294a4]">
            precisam de atenção
          </small>
        </div>

        <div className="flex min-w-0 flex-col gap-2 rounded-[10px] border border-line bg-white p-4.75 max-[680px]:p-3.25">
          <span className="text-[10px] font-bold text-[#8a7c8d]">
            Sincronizados
          </span>
          <strong className="font-['Barlow_Condensed'] text-[30px] leading-normal font-black text-purple-700 max-[680px]:text-[27px]">
            {syncStatus?.synced ?? "—"}
          </strong>
          <small className="text-[9px] text-[#a294a4]">
            confirmados pelo servidor
          </small>
        </div>
      </div>

      <section className="mb-4.25 min-w-0 rounded-xl border border-line bg-white p-5.5 max-[900px]:p-4 max-[680px]:p-3.25">
        <div className="mb-4 flex items-center justify-between gap-3 max-[680px]:flex-col max-[680px]:items-start">
          <div>
            <h2 className="my-1.75 font-['Barlow_Condensed'] text-[26px] leading-[0.95] font-black uppercase text-purple-700">
              Fila de sincronização
            </h2>
            <p className="m-0 text-[11px] leading-[1.6] text-muted">
              {syncStatus?.configured
                ? "Servidor remoto configurado"
                : "Os eventos ficam salvos localmente; endpoint remoto não configurado."}
            </p>
          </div>

          <button
            className="flex items-center justify-center gap-2.25 rounded-lg border border-line bg-white px-4 py-3.25 text-[11px] font-extrabold text-purple-700"
            onClick={() => void retry(undefined, true)}
          >
            <RotateCcw size={16} /> Reprocessar fila
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left text-[11px]">
            <thead>
              <tr>
                {[
                  "Evento",
                  "Criado em",
                  "Status",
                  "Tentativas",
                  "Último erro",
                  "",
                ].map((heading, index) => (
                  <th
                    key={index}
                    className="border-b border-[#f0eaf0] bg-[#fbf8fb] px-2.75 py-3.25 text-[9px] font-extrabold tracking-[0.7px] text-[#9a8c9c] uppercase"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {(syncStatus?.events ?? []).map((ev) => (
                <tr key={ev.id}>
                  <td className="border-b border-[#f0eaf0] px-2.75 py-3.25 whitespace-nowrap text-[#5d4b60]">
                    <code>{ev.eventId.slice(0, 8)}…</code>
                    <small className="mt-1 block text-[9px] text-[#a092a3]">
                      {ev.type}
                    </small>
                  </td>

                  <td className="border-b border-[#f0eaf0] px-2.75 py-3.25 whitespace-nowrap text-[#5d4b60]">
                    {new Date(ev.createdAt).toLocaleString("pt-BR")}
                  </td>

                  <td className="border-b border-[#f0eaf0] px-2.75 py-3.25 whitespace-nowrap text-[#5d4b60]">
                    <span
                      className={`inline-block rounded-[5px] px-1.75 py-1.25 text-[8px] font-black ${ev.status.toLowerCase() === "synced"
                        ? "bg-[#e8f5e9] text-[#36744a]"
                        : ev.status.toLowerCase() === "failed"
                          ? "bg-[#ffebe7] text-[#b14232]"
                          : ev.status.toLowerCase() === "pending"
                            ? "bg-[#fff0d9] text-[#9a5e17]"
                            : "bg-[#f4edf5] text-purple-700"
                        }`}
                    >
                      {ev.status}
                    </span>
                  </td>

                  <td className="border-b border-[#f0eaf0] px-2.75 py-3.25 whitespace-nowrap text-[#5d4b60]">
                    {ev.attempts}
                  </td>

                  <td className="border-b border-[#f0eaf0] px-2.75 py-3.25 text-[#5d4b60]">
                    {ev.lastError || "—"}
                  </td>

                  <td className="border-b border-[#f0eaf0] px-2.75 py-3.25 whitespace-nowrap text-[#5d4b60]">
                    <button
                      className="grid h-7.5 w-7.5 place-items-center rounded-md border border-line bg-white text-purple-700 hover:bg-purple-50"
                      onClick={() => void retry(ev.eventId)}
                      title="Reprocessar evento"
                    >
                      <RotateCcw size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!syncStatus?.events.length && (
            <div className="flex min-h-36.25 flex-col items-center justify-center gap-2 px-5.5 py-5.5 text-center text-[10px] text-[#b4a5b6]">
              Nenhum evento pendente ou com falha.
            </div>
          )}
        </div>
      </section>
    </>
  )
}