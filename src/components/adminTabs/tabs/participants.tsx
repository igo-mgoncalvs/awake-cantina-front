import { DataContext } from "@/context/contentContext";
import { ParticipantsRoutes } from "@/services/participants";
import { Participant } from "@/types/participant";
import { currencyToCents } from "@/utils/currencyToCents";
import { formatCurrency } from "@/utils/formatCurrency";
import { money } from "@/utils/money";
import { customToast } from "@/utils/toast";
import { Check, Edit2, Plus, Search } from "lucide-react";
import { FormEvent, useCallback, useContext, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const roles = [
  {
    id: "",
    label: "Selecionar participante"
  },
  {
    id: "CAMPER",
    label: "Campista"
  },
  {
    id: "LEADER",
    label: "Líder"
  },
  {
    id: "STAFF",
    label: "Membro da equipe"
  }
]

const defaultValues: Partial<Participant> = {
  code: '',
  id: '',
  limitCents: null,
  limitMode: 'INHERIT',
  name: "",
  role: 'CAMPER',
}

export default function Participants() {
  const [checked, setChecked] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('')
  const [edit, setEdit] = useState<string | null>(null)

  const { participants, sales, refresh } = useContext(DataContext)

  const { control, handleSubmit, reset, watch, setValue } = useForm<Participant>({
    defaultValues
  })

  const onSubmit = useCallback(async (data: Participant) => {
    if (edit) {
      ParticipantsRoutes.update(edit, {
        ...data,
        code: data.code || `CAMP-${participants.length.toString().padStart(4, '0')}`,
      })
        .then(() => {
          customToast({
            type: 'success',
            message: "Participante editado."
          })
          refresh();
          reset(defaultValues)
          setEdit(null)
          setChecked(true)
        })
        .catch(({ response }) => {
          customToast({
            message: response.data.message || "Erro ao cadastrar.",
            type: "error"
          })
        })
    } else {
      ParticipantsRoutes.create({
        ...data,
        code: data.code || `CAMP-${participants.length.toString().padStart(4, '0')}`,
      })
        .then(() => {
          customToast({
            type: 'success',
            message: "Participante cadastrado."
          })
          reset(defaultValues)
          refresh();
          setChecked(true)
        })
        .catch(({ response }) => {
          customToast({
            message: response.data.message || "Erro ao cadastrar.",
            type: "error"
          })
        })
    }
  }, [edit, participants, checked])

  const filterParticipants = useMemo(() => {
    return participants.filter((p) => p.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
  }, [participants, search])

  const participantRole = watch('role')

  return (
    <div className="grid grid-cols-[1.3fr_2fr] items-start gap-4.25 max-[900px]:grid-cols-1">
      <section className="mb-4.25 min-w-0 rounded-xl border border-line bg-white p-5.5 max-[900px]:p-4 max-[680px]:p-3.25">
        <div className="mb-4 flex items-center justify-between gap-3 max-[680px]:flex-col max-[680px]:items-start">
          <div>
            <h2 className="my-1.75 font-['Barlow_Condensed'] text-[26px] leading-[0.95] font-black uppercase text-purple-700">
              Novo participante
            </h2>
            <p className="m-0 text-[11px] leading-[1.6] text-muted">
              O código pode ser trocado por pulseira, QR ou RFID futuramente.
            </p>
          </div>
        </div>

        <form
          className="flex flex-col gap-4"
        >
          <Controller
            name="name"
            control={control}
            rules={{
              required: true
            }}
            render={({ field }) => (
              <label className="flex flex-col gap-2 text-[11px] font-bold text-ink">
                Nome completo
                <input
                  {...field}
                  placeholder="Ex.: Maria Oliveira"
                  className="h-10 min-w-0 rounded-[7px] border border-line bg-white px-3 text-[11px] font-normal text-ink outline-none placeholder:text-[#b2a7b3] focus:border-purple-700 focus:ring-[3px] focus:ring-[#5800520c]"
                />
              </label>
            )}
          />

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <label className="flex flex-col gap-2 text-[11px] font-bold text-ink">
                Tipo de participante
                <select
                  {...field}
                  onChange={(e) => {
                    setChecked(e.target.value === 'CAMPER')
                    setValue('limitCents', null)
                    setValue('limitMode', 'INHERIT')
                    field.onChange(e)
                  }}
                  className="h-10 min-w-0 rounded-[7px] border border-line bg-white px-3 text-[11px] font-normal text-ink outline-none placeholder:text-[#b2a7b3] focus:border-purple-700 focus:ring-[3px] focus:ring-[#5800520c]"
                >
                  {roles.map((item) => (
                    <option value={item.id}>{item.label}</option>
                  ))}
                </select>
              </label>
            )}
          />

          {participantRole === 'CAMPER' && (
            <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-ink">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => {
                  setChecked(e.target.checked)
                  setValue('limitMode', e.target.checked ? 'INHERIT' : 'CUSTOM')
                  setValue('limitCents', null)
                }}
                className="peer sr-only"
              />

              <span
                className={`flex h-5 w-5 items-center justify-center rounded-[5px] border transition-colors ${checked
                  ? "border-purple-700 bg-purple-700 text-white"
                  : "border-line bg-white text-transparent"
                  }`}
              >
                <Check size={14} strokeWidth={3} />
              </span>

              <span>Manter limite padrão</span>
            </label>
          )}

          {(!checked && participantRole === 'CAMPER') && (
            <Controller
              name="limitCents"
              control={control}
              render={({ field }) => (
                <label
                  className="flex flex-col gap-2 text-[11px] font-bold text-ink"
                >
                  Definir limite (R$)
                  <input
                    {...field}
                    value={formatCurrency((field.value || '').toString())}
                    onChange={(e) => field.onChange(currencyToCents(e.target.value))}
                    placeholder="5,00"
                    className="h-10 min-w-0 rounded-[7px] border border-line bg-white px-3 text-[11px] font-normal text-ink outline-none placeholder:text-[#b2a7b3] focus:border-purple-700 focus:ring-[3px] focus:ring-[#5800520c]"
                  />
                </label>
              )}
            />
          )}

          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <label
                className="flex flex-col gap-2 text-[11px] font-bold text-ink"
              >
                Código da pulseira
                <input
                  {...field}
                  placeholder="Código"
                  className="h-10 min-w-0 rounded-[7px] border border-line bg-white px-3 text-[11px] font-normal text-ink outline-none placeholder:text-[#b2a7b3] focus:border-purple-700 focus:ring-[3px] focus:ring-[#5800520c]"
                />
              </label>
            )}
          />

          <button
            type="button"
            className="flex items-center justify-center gap-2.25 rounded-lg border-0 bg-purple-700 px-4 py-3.25 text-[11px] font-extrabold text-white hover:bg-purple-600"
            onClick={handleSubmit(onSubmit)}
          >
            {edit ? <Edit2 size={17} /> : <Plus size={17} />}

            {edit ? "Salvar alterações" : "Cadastrar produto"}
          </button>

          {edit && (
            <button
              type="button"
              onClick={() => {
                setEdit(null)
                reset(defaultValues)
              }}
              className="rounded-lg border border-line bg-white px-4 py-3 text-[11px] font-bold text-ink hover:bg-purple-50"
            >
              Cancelar edição
            </button>
          )}
        </form>
      </section>

      <section className="mb-4.25 min-w-0 rounded-xl border border-line bg-white p-5.5 max-[900px]:p-4 max-[680px]:p-3.25">
        <div className="mb-4 flex items-center justify-between gap-3 max-[680px]:flex-col max-[680px]:items-start">
          <div>
            <h2 className="my-1.75 font-['Barlow_Condensed'] text-[26px] leading-[0.95] font-black uppercase text-purple-700">
              Participantes
            </h2>
            <p className="m-0 text-[11px] leading-[1.6] text-muted">
              {participants.length} cadastros
            </p>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="my-3.25 mb-4.25">
            <div className="flex text-[11px] h-10 items-center gap-2.25 rounded-[7px] border border-line px-3 text-[#9a8a9d]">
              <Search size={17} className="shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ou procure pelo nome..."
                className="min-w-0 w-full border-0 bg-transparent text-[11px] text-ink outline-none placeholder:text-[#b2a7b3]"
              />
            </div>
          </div>
          <table className="w-full border-collapse text-left text-[11px]">
            <thead>
              <tr>
                <th className="border-b border-[#f0eaf0] bg-[#fbf8fb] px-2.75 py-3.25 text-[9px] font-extrabold tracking-[0.7px] text-[#9a8c9c] uppercase">
                  Nome
                </th>
                <th className="border-b border-[#f0eaf0] bg-[#fbf8fb] px-2.75 py-3.25 text-[9px] font-extrabold tracking-[0.7px] text-[#9a8c9c] uppercase">
                  Código
                </th>
                <th className="border-b border-[#f0eaf0] bg-[#fbf8fb] px-2.75 py-3.25 text-[9px] font-extrabold tracking-[0.7px] text-[#9a8c9c] uppercase">
                  Tipo
                </th>
                <th className="border-b border-[#f0eaf0] bg-[#fbf8fb] px-2.75 py-3.25 text-[9px] font-extrabold tracking-[0.7px] text-[#9a8c9c] uppercase">
                  Limite
                </th>
                <th className="border-b border-[#f0eaf0] bg-[#fbf8fb] px-2.75 py-3.25 text-[9px] font-extrabold tracking-[0.7px] text-[#9a8c9c] uppercase">
                  Consumo em aberto
                </th>
                <th className="border-b text-center border-[#f0eaf0] bg-[#fbf8fb] px-2.75 py-3.25 text-[9px] font-extrabold tracking-[0.7px] text-[#9a8c9c] uppercase">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {filterParticipants.map((p) => {
                const due = sales
                  .filter(
                    (s) =>
                      s.participant.id === p.id &&
                      s.status !== "PAID" &&
                      s.status !== "CANCELLED",
                  )
                  .reduce((n, s) => n + s.totalCents, 0);

                const limit = p.limitCents ? p.limitCents : p.participantRoles.limitCents

                return (
                  <tr key={p.id}>
                    <td className="border-b border-[#f0eaf0] px-2.75 py-3.25 whitespace-nowrap text-[#5d4b60]">
                      {p.name}
                    </td>
                    <td className="border-b border-[#f0eaf0] px-2.75 py-3.25 whitespace-nowrap text-[#5d4b60]">
                      <code>{p.code}</code>
                    </td>
                    <td className="border-b border-[#f0eaf0] px-2.75 py-3.25 whitespace-nowrap text-[#5d4b60]">
                      <code>{roles.find((role) => role.id === p.role)?.label}</code>
                    </td>
                    <td className="border-b border-[#f0eaf0] px-2.75 py-3.25 whitespace-nowrap text-[#5d4b60]">
                      <b className="text-purple-700">{!limit ? '-' : money(limit)}</b>
                    </td>
                    <td className="border-b border-[#f0eaf0] px-2.75 py-3.25 whitespace-nowrap text-[#5d4b60]">
                      <b className="text-purple-700">{money(due)}</b>
                    </td>
                    <td className="flex items-center justify-center border-b border-[#f0eaf0] px-2.75 py-3.25 whitespace-nowrap text-purple-600">
                      <button
                        type="button"
                        onClick={() => {
                          setEdit(p.code)
                          setChecked(p.limitMode !== 'CUSTOM')
                          reset(p)
                        }}
                      >
                        <Edit2 size={16} className="cursor-pointer hover:text-purple-400 transition-all" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}