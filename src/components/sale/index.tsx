import { useMemo, useState } from "react";
import { StepController } from "../stepsController";
import Step1 from "./steps/step1";
import { Participant } from "@/types/participant";
import { CartItem, Product } from "@/types/product";
import Step2 from "./steps/step2";
import Step3 from "./steps/step3";

interface IProps {
  balance: () => void
}

export default function Sale({
  balance
}: IProps) {
  const [step, setStep] = useState<number>(1)
  const [selected, setSelected] = useState<Participant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.priceCents * item.quantity, 0),
    [cart],
  );

  return (
    <main className="mx-auto max-w-307.5">
      <StepController
        step={step}
      />

      {step === 1 && (
        <Step1
          setSelected={setSelected}
          setStep={setStep}
          setCart={setCart}
          balance={balance}
        />
      )
      }
      {step === 2 && (
        <Step2
          cart={cart}
          selected={selected}
          total={total}
          setCart={setCart}
          setSelected={setSelected}
          setStep={setStep}
        />
      )}
      {step === 3 && (
        <Step3
          cart={cart}
          selected={selected}
          total={total}
          setCart={setCart}
          setSelected={setSelected}
          setStep={setStep}
        />
      )}
    </main>
  )
}