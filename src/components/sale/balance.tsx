import { AccountService } from "@/services/account";
import { Account } from "@/types/account";
import { money } from "@/utils/money";
import { scanKey } from "@/utils/scanKey";
import { customToast } from "@/utils/toast";
import { ArrowLeft, ArrowRight, BadgeCheck, Barcode, Gauge, ShoppingBag, Wallet } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

interface IProps {
  setBalance: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Balance({
  setBalance
}: IProps) {
  const [accountCode, setAccountCode] = useState<string>("")
  const [accountData, setAccountData] = useState<Account | null>(null)

  const participantInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = participantInput.current;
    if (!input) return;

    const keepFocus = () => {
      input.focus();
    };

    input.addEventListener("blur", keepFocus);
    input.focus();

    return () => {
      input.removeEventListener("blur", keepFocus);
    };
  }, []);

  async function lookupAccount(e: FormEvent) {
    e.preventDefault();
    setAccountCode('')
    AccountService.getAccount({ code: accountCode })
      .then((data) => {
        setAccountData(data)
      })
      .catch(({ response }) => {
        setAccountData(null);
        customToast({
          message: response.data.message || "Conta não encontrada.",
          type: "error"
        })
      })
  }

  return (
    <section className="mx-auto my-8 mb-16 max-w-215 rounded-[15px] border border-line bg-white px-10.5 py-9 shadow-[0_12px_45px_#3c143a08] max-[900px]:mt-5 max-[680px]:mx-auto max-[680px]:my-5 max-[680px]:mb-10 max-[680px]:px-4.75 max-[680px]:py-6.75">
      <button
        className="flex items-center mb-4 gap-1.5 border-0 bg-transparent text-[11px] font-bold text-[#89778b] transition-colors hover:text-purple-700"
        type="button"
        onClick={() => setBalance(false)}
      >
        <ArrowLeft size={15} />
        Voltar para compras
      </button>

      <div className="flex items-center gap-2 text-[9px] font-extrabold tracking-[2px] text-orange-500">
        MINHA CONTA AWAKE
      </div>

      <h2 className="my-2.75 font-['Barlow_Condensed'] text-[37px] leading-[0.98] font-black text-purple-700 uppercase max-[680px]:text-[32px]">
        Consulte suas compras
      </h2>

      <p className="mb-6.5 max-w-115 text-xs leading-[1.7] text-muted max-[680px]:text-[11px]">
        Escaneie ou digite o código da pulseira para consultar seu
        histórico, saldo devedor e crédito.
      </p>

      <form
        className="mx-auto flex flex-col gap-2.5 text-left max-[680px]:flex-col"
        onSubmit={(e) => void lookupAccount(e)}
      >
        <label
          htmlFor="participant-code"
          className="mb-2 block text-[11px] font-extrabold text-ink"
        >
          Código do participante
        </label>

        <div className="flex h-15.5 items-center gap-3 rounded-[10px] border-2 border-[#e6d8e7] py-0 pr-2 pl-4 text-purple-700 transition-[border-color,box-shadow] duration-150 focus-within:border-purple-700 focus-within:shadow-[0_0_0_4px_#5800520c] max-[680px]:h-13.75 max-[680px]:gap-2 max-[680px]:pl-3">
          <Barcode size={23} className="shrink-0" />

          <input
            ref={participantInput}
            id="participant-code"
            autoComplete="off"
            value={accountCode}
            onChange={(e) => setAccountCode(e.target.value)}
            onKeyDown={(e) =>
              scanKey(e, () => {
                const form = e.currentTarget.form;
                form?.requestSubmit();
              })
            }
            autoFocus
            placeholder="Escaneie ou digite o código"
            className="min-w-0 flex-1 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-[#b2a7b3] max-[680px]:text-[11px]"
          />

          <button
            type="submit"
            aria-label="Confirmar código"
            className="grid size-11 shrink-0 place-items-center rounded-md bg-orange-500 text-white transition-colors hover:bg-orange-600 max-[680px]:size-10"
          >
            <ArrowRight size={22} />
          </button>
        </div>
      </form>

      {accountData && (
        <div className="mt-5">
          <h3 className="mb-4 font-['Barlow_Condensed'] text-2xl font-black text-purple-700">
            {accountData.name}
          </h3>

          <div className="mb-4.5 space-y-3.5">
            {/* Indicadores principais */}
            <div className="grid grid-cols-2 gap-3.25 max-[680px]:grid-cols-1">
              {/* Saldo devedor */}
              <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-red-100 bg-red-50/70 p-4.75 max-[680px]:p-3.5">
                <div className="flex items-center gap-2">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-100">
                    <Wallet size={18} className="text-red-700" />
                  </div>

                  <span className="text-xs font-bold text-red-800">
                    Saldo devedor
                  </span>
                </div>

                <div>
                  <strong className="font-['Barlow_Condensed'] text-[32px] font-black leading-none text-red-700 max-[680px]:text-[28px]">
                    {money(accountData.debtCents)}
                  </strong>

                  <p className="mt-1.5 text-[11px] text-red-700/70">
                    Valor pendente de pagamento
                  </p>
                </div>
              </div>

              {/* Crédito disponível */}
              <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4.75 max-[680px]:p-3.5">
                <div className="flex items-center gap-2">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                    <BadgeCheck size={18} className="text-emerald-700" />
                  </div>

                  <span className="text-xs font-bold text-emerald-800">
                    Crédito disponível
                  </span>
                </div>

                <div>
                  <strong className="font-['Barlow_Condensed'] text-[32px] font-black leading-none text-emerald-700 max-[680px]:text-[28px]">
                    {money(accountData.creditCents)}
                  </strong>

                  <p className="mt-1.5 text-[11px] text-emerald-700/70">
                    Saldo disponível para consumir
                  </p>
                </div>
              </div>
            </div>

            {/* Indicadores secundários */}
            <div className="grid grid-cols-2 gap-3.25 max-[680px]:grid-cols-1">
              {/* Limite de compras */}
              <div className="flex min-w-0 items-center gap-3 rounded-xl border border-line bg-white p-4 max-[680px]:p-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-50">
                  <Gauge size={19} className="text-purple-700" />
                </div>

                <div className="min-w-0 flex-1">
                  <span className="block text-[11px] font-bold text-[#8a7c8d]">
                    Limite de compras
                  </span>

                  <strong className="mt-0.5 block font-['Barlow_Condensed'] text-[25px] font-black leading-tight text-purple-700">
                    {money(accountData.defaultCreditCents)}
                  </strong>

                  <p className="mt-0.5 text-[10px] text-[#8a7c8d]">
                    Limite configurado
                  </p>
                </div>
              </div>

              {/* Quantidade de compras */}
              <div className="flex min-w-0 items-center gap-3 rounded-xl border border-line bg-white p-4 max-[680px]:p-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-50">
                  <ShoppingBag size={19} className="text-orange-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <span className="block text-[11px] font-bold text-[#8a7c8d]">
                    Total de compras
                  </span>

                  <strong className="mt-0.5 block font-['Barlow_Condensed'] text-[25px] font-black leading-tight text-ink">
                    {accountData.sales.length}
                  </strong>

                  <p className="mt-0.5 text-[10px] text-[#8a7c8d]">
                    Compras registradas
                  </p>
                </div>
              </div>
            </div>
          </div>

          {accountData.sales.map((sale: any) => (
            <div
              className="flex items-center justify-between gap-3 border-b border-[#f0eaf0] py-3 max-[680px]:items-start max-[680px]:flex-col"
              key={sale.id}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <b className="text-[11px] text-[#4b384e]">
                  {new Date(sale.createdAt).toLocaleString("pt-BR")}
                </b>

                <small className="mt-1 text-[9px] wrap-break-word text-[#777]">
                  {sale.items
                    .map((i: any) => `${i.quantity}× ${i.productName}`)
                    .join(", ")}
                </small>
              </div>

              <strong className="shrink-0 text-[11px] whitespace-nowrap text-purple-700 max-[680px]:whitespace-normal">
                {money(sale.totalCents)} · falta {money(sale.dueCents)}
              </strong>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}