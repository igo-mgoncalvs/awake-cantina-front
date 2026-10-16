import Sale from "@/components/sale";
import Balance from "@/components/sale/balance";
import { useState } from "react";

export default function Home() {
  const [balance, setBalance] = useState<boolean>(false)

  return (
    <div className="mx-auto max-w-307.5 px-7.5 pb-5.5 max-[900px]:px-5 max-[900px]:py-6.75 max-[680px]:px-3.25 max-[680px]:py-5.75">
      {/* <div className="relative flex min-h-56 items-center justify-between overflow-hidden max-[680px]:min-h-46">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-extrabold tracking-[2px] text-purple-700">
            <span className="inline-block size-2 animate-pulse rounded-full bg-orange-500" />
            MERCADINHO AWAKE CAMP
          </div>

          <h1 className="my-4 mb-3 font-['Barlow_Condensed'] text-[clamp(2.625rem,5vw,4rem)] leading-[0.92] font-black tracking-tight text-purple-700 uppercase max-[680px]:text-[2.8125rem]">
            Seu momento.
            <br />
            <em className="text-orange-500 not-italic">
              Seu próximo nível.
            </em>
          </h1>

          <p className="m-0 text-[13px] leading-[1.7] text-muted max-[680px]:max-w-68 max-[680px]:text-[11px]">
            Escolha o que quiser e finalize sua compra em poucos passos.
          </p>
        </div>

        <div className="relative flex h-50 w-62 shrink-0 items-center justify-center before:absolute before:size-44 before:rounded-full before:bg-orange-500 before:opacity-10 max-[900px]:w-48 max-[680px]:h-35 max-[680px]:w-24 max-[680px]:opacity-75">
          <img
            src="/awake-mark.png"
            alt=""
            className="relative size-44 object-contain opacity-95 mix-blend-multiply max-[900px]:size-36 max-[680px]:size-24"
          />

          <span className="absolute right-0 bottom-3 rotate-[-5deg] bg-orange-500 px-3 py-2 font-['Barlow_Condensed'] text-lg leading-[0.9] font-black tracking-wide text-white shadow-[4px_4px_0_#580052] max-[900px]:text-base max-[680px]:-right-px max-[680px]:bottom-1 max-[680px]:px-1.5 max-[680px]:py-1.5 max-[680px]:text-[10px]">
            IT'S TIME
            <br />
            TO AWAKE
          </span>
        </div>
      </div> */}

      {balance ? (
        <Balance
          setBalance={setBalance}
        />
      ) : (
        <Sale
          balance={() => setBalance(true)}
        />
      )}
    </div>
  )
}