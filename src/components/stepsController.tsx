
import { Check } from "lucide-react";
import { Fragment } from "react";

interface IProps {
  step: number;
}

const steps = [
  { n: 1, label: "Identifique-se" },
  { n: 2, label: "Escaneie produtos" },
  { n: 3, label: "Finalize" },
];

export function StepController({ step }: IProps) {
  return (
    <div
      className="mb-5.75 mt-2.25 flex w-full items-center border-b border-line pb-4.25"
      aria-label="Etapas da compra"
    >
      {steps.map((s, index) => (
        <Fragment key={s.n}>
          <div
            className={`flex shrink-0 items-center justify-center gap-2.5 text-xs font-extrabold ${step === s.n
              ? "text-purple-700"
              : step > s.n
                ? "text-success-600"
                : "text-purple-200"
              }`}
          >
            <span
              className={`grid size-7.5 shrink-0 place-items-center rounded-full border text-xs font-extrabold ${step === s.n
                ? "border-purple-700 bg-purple-700 text-white shadow-[0_0_0_5px_#58005212]"
                : step > s.n
                  ? "border-success-200 bg-success-100 text-success-600"
                  : "border-purple-100 text-purple-200"
                }`}
            >
              {step > s.n ? <Check size={17} /> : s.n}
            </span>

            <span className="whitespace-nowrap">{s.label}</span>
          </div>

          {index < steps.length - 1 && (
            <div className="mx-6 h-px min-w-4 flex-1 bg-[#ded2df]" />
          )}
        </Fragment>
      ))}
    </div>
  );
}
