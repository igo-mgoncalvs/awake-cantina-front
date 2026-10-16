import { DataContext } from "@/context/contentContext";
import { FinanceRoutes } from "@/services/finance";
import { PaymentRoutes } from "@/services/payments";
import { currencyToCents } from "@/utils/currencyToCents";
import { formatCurrency } from "@/utils/formatCurrency";
import { money } from "@/utils/money";
import { scanKey } from "@/utils/scanKey";
import { customToast } from "@/utils/toast";
import { BadgeCheck, ChartNoAxesCombined, Receipt, Wallet } from "lucide-react";
import { FormEvent, useContext, useEffect, useRef, useState } from "react";

export default function Finance() {
  const [paymentParticipantId, setPaymentParticipantId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentSaleId, setPaymentSaleId] = useState("");
  const [finance, setFinance] = useState<any>(null);

  const { participants, sales, refresh } = useContext(DataContext)

  const participantInput = useRef<HTMLInputElement>(null);
  const amountInput = useRef<HTMLInputElement>(null);

  const isSearching = useRef(false);

  useEffect(() => {
    const participant = participantInput.current;
    const search = amountInput.current;

    if (!participant || !search) return;

    const handleParticipantBlur = () => {
      setTimeout(() => {
        const activeElement = document.activeElement;

        // Não rouba o foco de botões ou outros controles
        if (
          activeElement instanceof HTMLElement &&
          activeElement.closest(
            'button, a, [role="button"], input, select, textarea, [contenteditable="true"]'
          )
        ) {
          return;
        }

        if (!isSearching.current) {
          participant.focus();
        }
      }, 0);
    };

    const handleSearchFocus = () => {
      isSearching.current = true;
    };

    const handleSearchBlur = () => {
      isSearching.current = false;
    };

    participant.addEventListener("blur", handleParticipantBlur);
    search.addEventListener("focus", handleSearchFocus);
    search.addEventListener("blur", handleSearchBlur);

    participant.focus();

    return () => {
      participant.removeEventListener("blur", handleParticipantBlur);
      search.removeEventListener("focus", handleSearchFocus);
      search.removeEventListener("blur", handleSearchBlur);
    };
  }, []);
  async function registerPayment(e: FormEvent) {
    e.preventDefault();
    if (!paymentParticipantId || !paymentAmount) return;
    await PaymentRoutes.register({
      participantCode: paymentParticipantId,
      amountCents: currencyToCents(paymentAmount),
      ...(paymentSaleId ? { saleId: paymentSaleId } : {}),
    })
      .then((data) => {
        customToast({
          message: `Pagamento registrado. Aplicado: ${money(data.allocatedCents)} · Crédito gerado: ${money(data.creditCents)}.`,
          type: "success"
        })
        setPaymentAmount("");
        setPaymentSaleId("");
        refresh();
        loadFinance();
      })
      .catch(({ response }) => {
        customToast({
          message: response.data.message || "Erro ao registrar pagamento.",
          type: "error",
        });
      })
  }

  async function loadFinance() {
    FinanceRoutes.getAll()
      .then((data) => {
        setFinance(data);
      })
      .catch(({ response }) => {
        customToast({
          message: response.data.message || "Erro ao carregar financeiro.",
          type: "error"
        });
      })
  }

  useEffect(() => {
    loadFinance()
  }, [])

  return (

    <>
      <div className="mb-4 flex items-center justify-between gap-3 max-[680px]:flex-col max-[680px]:items-start">
        <div>
          <h2 className="my-1.75 font-['Barlow_Condensed'] text-[26px] leading-[0.95] font-black uppercase text-purple-700">
            Painel financeiro
          </h2>
          <p className="m-0 text-[11px] leading-[1.6] text-muted">
            Visão consolidada de vendas, recebimentos, dívidas e créditos.
          </p>
        </div>

        <button
          className="flex items-center justify-center gap-2.25 rounded-lg border border-line bg-white px-4 py-3.25 text-purple-700"
          onClick={() => void loadFinance()}
        >
          <span className="text-[11px] font-extrabold">
            Atualizar financeiro
          </span>
        </button>
      </div>

      <div className="mb-4.5 grid grid-cols-3 gap-3.25 max-[900px]:grid-cols-2 max-[680px]:gap-2">
        {/* Vendas no período */}
        <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-purple-100 bg-purple-50/70 p-4.75 max-[680px]:p-3.25">
          <div className="flex items-center gap-2">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-purple-100">
              <ChartNoAxesCombined size={18} className="text-purple-800" />
            </div>
            <span className="font-sans text-xs font-bold text-purple-900">
              Vendas no período
            </span>
          </div>

          <strong className="wrap-break-words font-['Barlow_Condensed'] text-[30px] font-black leading-none text-purple-800 max-[680px]:text-[27px]">
            {money(finance?.metrics.salesCents ?? 0)}
          </strong>

          <p className="font-sans text-[11px] text-purple-700/70">
            Total vendido
          </p>
        </div>

        {/* Recebido */}
        <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4.75 max-[680px]:p-3.25">
          <div className="flex items-center gap-2">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
              <Wallet size={18} className="text-emerald-700" />
            </div>
            <span className="font-sans text-xs font-bold text-emerald-900">
              Recebido
            </span>
          </div>

          <strong className="wrap-break-words font-['Barlow_Condensed'] text-[30px] font-black leading-none text-emerald-700 max-[680px]:text-[27px]">
            {money(finance?.metrics.receivedCents ?? 0)}
          </strong>

          <p className="font-sans text-[11px] text-emerald-700/70">
            Total recebido
          </p>
        </div>

        {/* Saldo devedor */}
        <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-red-100 bg-red-50/70 p-4.75 max-[680px]:p-3.25">
          <div className="flex items-center gap-2">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-100">
              <Receipt size={18} className="text-red-700" />
            </div>
            <span className="font-sans text-xs font-bold text-red-900">
              Saldo devedor
            </span>
          </div>

          <strong className="wrap-break-words font-['Barlow_Condensed'] text-[30px] font-black leading-none text-red-700 max-[680px]:text-[27px]">
            {money(finance?.metrics.debtCents ?? 0)}
          </strong>

          <p className="font-sans text-[11px] text-red-700/70">
            Pendente de pagamento
          </p>
        </div>
      </div>

      <section className="mb-4.25 min-w-0 rounded-xl border border-line bg-white p-5.5 max-[900px]:p-4 max-[680px]:p-3.25">
        <div className="mb-4 flex items-center justify-between gap-3 max-[680px]:flex-col max-[680px]:items-start">
          <div>
            <h2 className="my-1.75 font-['Barlow_Condensed'] text-[26px] leading-[0.95] font-black uppercase text-purple-700">
              Registrar pagamento
            </h2>
            <p className="m-0 text-[11px] leading-[1.6] text-muted">
              Deixe a venda vazia para aplicar o pagamento às dívidas mais antigas;
              o excedente vira crédito.
            </p>
          </div>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => void registerPayment(e)}
        >
          <label className="flex flex-col gap-2 text-[11px] font-bold text-ink">
            Participante
            <select
              required
              value={paymentParticipantId}
              onChange={(e) => setPaymentParticipantId(e.target.value)}
              className="h-10 min-w-0 rounded-[7px] border border-line bg-white px-3 text-[11px] font-normal text-ink outline-none focus:border-purple-700 focus:ring-[3px] focus:ring-[#5800520c]"
            >
              <option value="">Selecione...</option>
              {participants.map((p) => (
                <option key={p.id} value={p.code}>
                  {p.name} — {p.code}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-[11px] font-bold text-ink">
            Participante
            <input
              ref={participantInput}
              id="participant-code"
              autoComplete="off"
              value={paymentParticipantId}
              onChange={(e) => setPaymentParticipantId(e.target.value)}
              onKeyDown={(e) =>
                scanKey(e, () => {
                  const form = e.currentTarget.form;
                  form?.requestSubmit();
                })
              }
              autoFocus
              placeholder="Escaneie ou digite o código"
              className="h-10 min-w-0 rounded-[7px] border border-line bg-white px-3 text-[11px] font-normal text-ink outline-none placeholder:text-[#b2a7b3] focus:border-purple-700 focus:ring-[3px] focus:ring-[#5800520c]"
            />
          </label>

          <label className="flex flex-col gap-2 text-[11px] font-bold text-ink">
            Valor recebido (R$)
            <input
              required
              ref={amountInput}
              value={formatCurrency(paymentAmount)}
              onChange={(e) => setPaymentAmount(formatCurrency(e.target.value))}
              placeholder="20,00"
              className="h-10 min-w-0 rounded-[7px] border border-line bg-white px-3 text-[11px] font-normal text-ink outline-none placeholder:text-[#b2a7b3] focus:border-purple-700 focus:ring-[3px] focus:ring-[#5800520c]"
            />
          </label>

          <label className="flex flex-col gap-2 text-[11px] font-bold text-ink">
            Venda específica (opcional)
            <select
              value={paymentSaleId}
              onChange={(e) => setPaymentSaleId(e.target.value)}
              className="h-10 min-w-0 rounded-[7px] border border-line bg-white px-3 text-[11px] font-normal text-ink outline-none focus:border-purple-700 focus:ring-[3px] focus:ring-[#5800520c]"
            >
              <option value="">Aplicar às dívidas mais antigas</option>
              {sales
                .filter(
                  (s) =>
                    !paymentParticipantId ||
                    s.participant.code === paymentParticipantId,
                )
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {money(s.totalCents)} ·{" "}
                    {new Date(s.createdAt).toLocaleDateString("pt-BR")}
                  </option>
                ))}
            </select>
          </label>

          <button className="flex items-center justify-center gap-2.25 rounded-lg border-0 bg-purple-700 px-4 py-3.25 text-[11px] font-extrabold text-white hover:bg-purple-600">
            Registrar recebimento
          </button>
        </form>

        <p className="mt-3 text-[13px] text-[#777]">
          Ao concluir, o sistema informa quanto foi aplicado às dívidas e quanto
          ficou como crédito.
        </p>
      </section>
    </>
  )
}