import { DataContext } from "@/context/contentContext";
import { Participant } from "@/types/participant";
import { CartItem } from "@/types/product";
import { scanKey } from "@/utils/scanKey";
import { customToast } from "@/utils/toast";
import { ArrowRight, Barcode, ChevronRight, CreditCard, ShieldCheck } from "lucide-react";
import { FormEvent, useCallback, useContext, useEffect, useRef, useState } from "react";

interface IProps {
  balance: () => void
  setStep: React.Dispatch<React.SetStateAction<number>>
  setSelected: React.Dispatch<React.SetStateAction<Participant | null>>
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
}

export default function Step1({
  setStep,
  setSelected,
  setCart,
  balance
}: IProps) {
  const [participantScan, setParticipantScan] = useState("");

  const participantInput = useRef<HTMLInputElement>(null);

  const { participants } = useContext(DataContext)

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

  const scanParticipant = useCallback((e: FormEvent) => {
    e.preventDefault();
    const code = participantScan.trim().toLowerCase();
    const found = participants.find(
      (p) => p.code.trim().toLowerCase() === code,
    );
    if (!found) {
      customToast({
        message: "Não encontramos esse código. Confira a pulseira ou peça ajuda à equipe.",
        type: "error"
      })
      setParticipantScan("")
      return;
    }

    setSelected(found);
    setParticipantScan("");
    setCart([]);
    customToast({
      message: `Olá, ${found.name.split(" ")[0]}! Agora escaneie seus produtos.`,
      type: "success",
    });
    setStep(2);
  }, [participants, participantScan])


  return (
    <section className="mx-auto my-8 mb-16 max-w-167.5 rounded-[15px] border border-line bg-white px-10 py-9 text-center shadow-[0_12px_45px_#3c143a08] max-[900px]:mt-5 max-[680px]:mx-auto max-[680px]:my-5 max-[680px]:mb-10 max-[680px]:px-5 max-[680px]:py-7">
      <div className="mx-auto mb-6 grid size-18 place-items-center rounded-[20px] bg-soft text-purple-700">
        <Barcode size={34} />
      </div>

      <div className="flex items-center justify-center gap-2 text-[9px] font-extrabold tracking-[2px] text-orange-500">
        PASSO 01 / IDENTIFICAÇÃO
      </div>

      <h2 className="my-3 font-['Barlow_Condensed'] text-[37px] leading-[0.98] font-black text-purple-700 uppercase max-[680px]:text-[32px]">
        Comece pela sua pulseira
      </h2>

      <p className="mx-auto mb-6.5 max-w-115 text-xs leading-[1.7] text-muted max-[680px]:text-[11px]">
        Posicione o código no leitor. A identificação será feita
        automaticamente quando o leitor enviar o código.
      </p>

      <form
        className="mx-auto max-w-121.25 text-left"
        onSubmit={scanParticipant}
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
            value={participantScan}
            onChange={(e) => setParticipantScan(e.target.value)}
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

        <div className="flex flex-col items-center">
          <button
            className="mt-2 flex items-center gap-2 rounded-lg border border-purple-700/15 bg-purple-700/5 px-3 py-2 text-xs font-bold text-purple-700 transition-all duration-200 hover:border-purple-700/30 hover:bg-purple-700/10 hover:shadow-sm active:scale-[0.98]"
            type="button"
            onClick={balance}
          >
            <CreditCard size={16} />
            Consulte seu saldo
            <ChevronRight size={14} className="ml-1 opacity-60" />
          </button>
        </div>
      </form>

      <div className="mt-7 flex items-center justify-center gap-2 border-t border-[#f0eaf0] pt-4.5 text-[10px] text-[#8a7a8d]">
        <ShieldCheck size={16} className="shrink-0 text-[#498257]" />
        <span>Seus gastos ficam vinculados ao seu cadastro.</span>
      </div>
    </section>
  )
}