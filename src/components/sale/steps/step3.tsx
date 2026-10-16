import { DataContext } from "@/context/contentContext";
import { SalesRoutes } from "@/services/sales";
import { Participant } from "@/types/participant";
import { CartItem } from "@/types/product";
import { money } from "@/utils/money";
import { customToast } from "@/utils/toast";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { useContext, useState } from "react";

interface IProps {
  selected: Participant | null
  cart: CartItem[]
  total: number
  setStep: React.Dispatch<React.SetStateAction<number>>
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  setSelected: React.Dispatch<React.SetStateAction<Participant | null>>
}

export default function Step3({
  selected,
  cart,
  total,
  setStep,
  setCart,
  setSelected,
}: IProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const { online, refresh } = useContext(DataContext)

  async function checkout() {
    if (!selected || !cart.length) {
      customToast({
        message: "Adicione pelo menos um produto antes de finalizar.",
        type: "error"
      })
    }

    setLoading(true);
    setError(null)

    SalesRoutes.create({
      cart,
      participantCode: selected?.code!
    })
      .then((result) => {
        customToast({
          message: `Compra registrada! ${result.creditCents ? `Crédito restante: ${money(result.creditCents)}.` : `Saldo devedor: ${money(result.debtCents ?? 0)}.`} Obrigado e aproveite o Awake Camp.`,
          type: "success"
        })
        setCart([]);
        setSelected(null);
        setStep(1);
        refresh();
      })
      .catch(({ response }) => {
        if (response.data.message) {
          setError(response.data.message)

          return
        }

        customToast({
          message: "Não foi possível registrar a compra.",
          type: "error",
          options: {
            autoClose: 3500
          }
        })
      })
      .finally(() => {
        setLoading(false);
      })
  }

  return (
    <section className="mx-auto my-8 mb-16 max-w-167.5 rounded-[15px] border border-line bg-white px-10 py-9 text-center shadow-[0_12px_45px_#3c143a08] max-[900px]:mt-5 max-[680px]:mx-auto max-[680px]:my-5 max-[680px]:mb-10 max-[680px]:px-5 max-[680px]:py-7">
      <div className="mx-auto mb-6 grid size-18 place-items-center rounded-[20px] bg-orange-50 text-orange-500">
        <Check size={34} />
      </div>

      <div className="flex items-center justify-center gap-2 text-[9px] font-extrabold tracking-[2px] text-orange-500">
        PASSO 03 / CONFIRMAÇÃO
      </div>

      <h2 className="my-3 font-['Barlow_Condensed'] text-[37px] leading-[0.98] font-black text-purple-700 uppercase max-[680px]:text-[32px]">
        Confira antes de finalizar
      </h2>

      <p className="mx-auto mb-6.5 max-w-115 text-xs leading-[1.7] text-muted max-[680px]:text-[11px]">
        Depois de confirmar, a compra será lançada na conta vinculada à
        sua pulseira.
      </p>

      {error && (
        <p className="mx-auto mt-4 max-w-121.25 mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-left text-xs leading-relaxed text-red-800">
          {error}
        </p>
      )}

      <div className="mx-auto mb-5 flex max-w-121.25 items-center gap-3 rounded-[10px] border border-line bg-page p-4 text-left">
        <div className="grid size-11 shrink-0 place-items-center rounded-full bg-purple-700 font-['Barlow_Condensed'] text-xl font-bold text-white uppercase">
          {selected?.name.slice(0, 1).toUpperCase()}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <small className="text-[9px] font-extrabold tracking-[1.5px] text-muted">
            PARTICIPANTE
          </small>
          <b className="truncate text-sm font-extrabold text-ink">
            {selected?.name}
          </b>
        </div>

        <ShieldCheck size={20} className="shrink-0 text-[#498257]" />
      </div>

      <div className="mx-auto max-w-121.25 divide-y divide-[#f0eaf0] text-left">
        {cart.map((item) => (
          <div
            className="flex items-center justify-between gap-4 py-3 text-xs text-muted"
            key={item.id}
          >
            <span className="min-w-0 flex-1">
              {item.quantity}× {item.name}
            </span>
            <b className="shrink-0 font-extrabold text-ink">
              {money(item.quantity * item.priceCents)}
            </b>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-4 flex max-w-121.25 items-center justify-between gap-4 border-t border-line pt-5 text-left">
        <span className="text-xs font-bold text-muted">
          Total da compra
        </span>
        <strong className="font-['Barlow_Condensed'] text-[30px] leading-none font-black text-purple-700">
          {money(total)}
        </strong>
      </div>

      <div className="mx-auto mt-7 flex max-w-121.25 gap-3 max-[680px]:flex-col">
        <button
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 py-3 text-xs font-extrabold text-purple-700 transition-colors hover:bg-soft"
          onClick={() => setStep(2)}
        >
          <ArrowLeft size={17} />
          Voltar aos produtos
        </button>

        <button
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-xs font-extrabold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loading || !online}
          onClick={() => void checkout()}
        >
          {loading ? "Registrando..." : "Confirmar compra"}
          <Check size={18} />
        </button>
      </div>

      {!online && (
        <p className="mx-auto mt-4 max-w-121.25 rounded-lg border border-orange-200 bg-orange-50 p-3 text-left text-xs leading-relaxed text-orange-800">
          A API local está indisponível. Aguarde a reconexão antes de
          confirmar.
        </p>
      )}
    </section>

  )
}