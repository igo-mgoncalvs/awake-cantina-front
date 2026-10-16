import { DataContext } from "@/context/contentContext";
import { money } from "@/utils/money";
import { useContext } from "react";

export default function Overview() {
  const { sales, participants, products } = useContext(DataContext)

  const openBalance = sales
    .filter((s) => s.status !== "PAID" && s.status !== "CANCELLED")
    .reduce((n, s) => n + s.totalCents, 0);

  return (

    <>
      <div className="mb-4.5 grid grid-cols-4 gap-3.25 max-[680px]:gap-2 max-[680px]:grid-cols-2">
        <div className="flex flex-col gap-2 rounded-[10px] border border-line bg-white p-4.75 max-[680px]:p-3.25">
          <span className="text-[10px] font-bold text-[#8a7c8d]">
            Vendas registradas
          </span>
          <strong className="font-['Barlow_Condensed'] text-[30px] font-black text-purple-700 max-[680px]:text-[27px]">
            {sales.length}
          </strong>
          <small className="text-[9px] text-[#a294a4]">
            compras realizadas
          </small>
        </div>

        <div className="flex flex-col gap-2 rounded-[10px] border border-line bg-white p-4.75 max-[680px]:p-3.25">
          <span className="text-[10px] font-bold text-[#8a7c8d]">
            Consumo em aberto
          </span>
          <strong className="font-['Barlow_Condensed'] text-[30px] font-black text-purple-700 max-[680px]:text-[27px]">
            {money(openBalance)}
          </strong>
          <small className="text-[9px] text-[#a294a4]">
            pendente de acerto
          </small>
        </div>

        <div className="flex flex-col gap-2 rounded-[10px] border border-line bg-white p-4.75 max-[680px]:p-3.25">
          <span className="text-[10px] font-bold text-[#8a7c8d]">
            Participantes
          </span>
          <strong className="font-['Barlow_Condensed'] text-[30px] font-black text-purple-700 max-[680px]:text-[27px]">
            {participants.length}
          </strong>
          <small className="text-[9px] text-[#a294a4]">
            cadastros ativos
          </small>
        </div>

        <div className="flex flex-col gap-2 rounded-[10px] border border-line bg-white p-4.75 max-[680px]:p-3.25">
          <span className="text-[10px] font-bold text-[#8a7c8d]">
            Produtos
          </span>
          <strong className="font-['Barlow_Condensed'] text-[30px] font-black text-purple-700 max-[680px]:text-[27px]">
            {products.length}
          </strong>
          <small className="text-[9px] text-[#a294a4]">
            no catálogo
          </small>
        </div>
      </div>

      <section className="mb-4.25 rounded-xl border border-line bg-white p-5.5 max-[900px]:p-4 max-[680px]:p-3.25">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="my-1.75 font-['Barlow_Condensed'] text-[26px] leading-[0.95] font-black text-purple-700 uppercase">
              Compras recentes
            </h2>
            <p className="m-0 text-[11px] leading-[1.6] text-muted">
              Movimentações registradas neste notebook.
            </p>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left text-[11px]">
            <thead>
              <tr>
                <th className="bg-[#fbf8fb] px-2.75 py-3.25 text-[9px] font-extrabold tracking-[0.7px] text-[#9a8c9c] uppercase">
                  Participante
                </th>
                <th className="bg-[#fbf8fb] px-2.75 py-3.25 text-[9px] font-extrabold tracking-[0.7px] text-[#9a8c9c] uppercase">
                  Data
                </th>
                <th className="bg-[#fbf8fb] px-2.75 py-3.25 text-[9px] font-extrabold tracking-[0.7px] text-[#9a8c9c] uppercase">
                  Itens
                </th>
                <th className="bg-[#fbf8fb] px-2.75 py-3.25 text-[9px] font-extrabold tracking-[0.7px] text-[#9a8c9c] uppercase">
                  Total
                </th>
                <th className="bg-[#fbf8fb] px-2.75 py-3.25 text-[9px] font-extrabold tracking-[0.7px] text-[#9a8c9c] uppercase">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {sales.slice(0, 10).map((s) => (
                <tr key={s.id}>
                  <td className="whitespace-nowrap border-b border-[#f0eaf0] px-2.75 py-3.25 text-[#5d4b60]">
                    {s.participant.name}
                    <small className="mt-1 block text-[9px] text-[#a092a3]">
                      {s.participant.code}
                    </small>
                  </td>

                  <td className="whitespace-nowrap border-b border-[#f0eaf0] px-2.75 py-3.25 text-[#5d4b60]">
                    {new Date(s.createdAt).toLocaleString("pt-BR")}
                  </td>

                  <td className="whitespace-nowrap border-b border-[#f0eaf0] px-2.75 py-3.25 text-[#5d4b60]">
                    {s.items.reduce((n, i) => n + i.quantity, 0)}
                  </td>

                  <td className="whitespace-nowrap border-b border-[#f0eaf0] px-2.75 py-3.25 text-[#5d4b60]">
                    <b className="text-purple-700">
                      {money(s.totalCents)}
                    </b>
                  </td>

                  <td className="whitespace-nowrap border-b border-[#f0eaf0] px-2.75 py-3.25 text-[#5d4b60]">
                    <span
                      className={`inline-block rounded-[5px] bg-[#f4edf5] px-1.75 py-1.25 text-[8px] font-black text-purple-700 ${s.status.toLowerCase() === "open" ||
                        s.status.toLowerCase() === "pending"
                        ? "bg-[#fff0d9] text-[#9a5e17]"
                        : s.status.toLowerCase() === "paid" ||
                          s.status.toLowerCase() === "synced"
                          ? "bg-[#e8f5e9] text-[#36744a]"
                          : s.status.toLowerCase() === "cancelled" ||
                            s.status.toLowerCase() === "failed"
                            ? "bg-[#ffebe7] text-[#b14232]"
                            : ""
                        }`}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!sales.length && (
            <div className="flex min-h-36.25 flex-col items-center justify-center gap-2 p-5.5 text-center text-[10px] text-[#b4a5b6]">
              Nenhuma compra registrada ainda.
            </div>
          )}
        </div>
      </section>
    </>
  )
}