import { DataContext } from "@/context/contentContext";
import { ParticipantRolesRoutes } from "@/services/participantRoles";
import { CreateParticipantRole, Role } from "@/types/roles";
import { currencyToCents } from "@/utils/currencyToCents";
import { formatCurrency } from "@/utils/formatCurrency";
import { money } from "@/utils/money";
import { customToast } from "@/utils/toast";
import { Edit2, Plus, ShieldCheck } from "lucide-react";
import { useCallback, useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function ParticipantRoles() {
  const [edit, setEdit] = useState<string | null>(null);

  const { participantRoles, getParticipantRoles } =
    useContext(DataContext);

  const { control, handleSubmit, reset } = useForm<CreateParticipantRole>();

  const createRole = useCallback(
    async (data: CreateParticipantRole) => {
      const payload: CreateParticipantRole = {
        role: data.role.trim().toUpperCase(),
        name: data.name.trim(),
        limitCents: data.limitCents
      };

      try {
        if (edit) {
          await ParticipantRolesRoutes.update(edit, payload);

          customToast({
            message: "Regra editada com sucesso.",
            type: "success",
          });
        } else {
          await ParticipantRolesRoutes.create(payload);

          customToast({
            message: "Regra cadastrada com sucesso.",
            type: "success",
          });
        }

        reset({
          role: "",
          name: "",
          limitCents: 0,
        });

        setEdit(null);
        getParticipantRoles();
      } catch (error: any) {
        customToast({
          message:
            error?.response?.data?.message ||
            "Erro ao salvar a regra.",
          type: "error",
        });
      }
    },
    [edit, getParticipantRoles, reset]
  );

  const editRole = (role: Role) => {
    setEdit(role.id);

    reset({
      role: role.role,
      name: role.name || '',
      limitCents:
        role.limitCents === null
          ? undefined
          : role.limitCents,
    });
  };

  const cancelEdit = () => {
    setEdit(null);

    reset({
      role: "",
      limitCents: undefined,
    });
  };

  return (
    <div className="grid grid-cols-[2fr_3fr] items-start gap-4.25 max-[900px]:grid-cols-1">
      {/* Formulário */}
      <section className="mb-4.25 min-w-0 rounded-xl border border-line bg-white p-5.5 max-[900px]:p-4 max-[680px]:p-3.25">
        <div className="mb-4 flex items-center justify-between gap-3 max-[680px]:flex-col max-[680px]:items-start">
          <div>
            <h2 className="my-1.75 font-['Barlow_Condensed'] text-[26px] leading-[0.95] font-black uppercase text-purple-700">
              {edit ? "Editar regra" : "Cadastrar regra"}
            </h2>

            <p className="m-0 text-[11px] leading-[1.6] text-muted">
              Defina os cargos e os limites de consumo da cantina.
            </p>
          </div>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(createRole)}
        >
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Informe o nome do cargo.",
              validate: (value) =>
                value.trim().length > 0 ||
                "Informe um nome válido.",
            }}
            render={({ field, fieldState }) => (
              <label className="flex flex-col gap-2 text-[11px] font-bold text-ink">
                Nome do cargo

                <input
                  {...field}
                  placeholder="Ex.: CAMPER, LEADER, STAFF"
                  className="h-10 min-w-0 rounded-[7px] border border-line bg-white px-3 text-[11px] font-normal text-ink outline-none placeholder:text-[#b2a7b3] focus:border-purple-700 focus:ring-[3px] focus:ring-[#5800520c]"
                />

                {fieldState.error && (
                  <span className="text-red-600">
                    {fieldState.error.message}
                  </span>
                )}
              </label>
            )}
          />

          <Controller
            name="role"
            control={control}
            rules={{
              required: "Informe o nome do cargo.",
              validate: (value) =>
                value.trim().length > 0 ||
                "Informe um nome válido.",
            }}
            render={({ field, fieldState }) => (
              <label className="flex flex-col gap-2 text-[11px] font-bold text-ink">
                Tag

                <input
                  {...field}
                  placeholder="Ex.: CAMPER, LEADER, STAFF"
                  className="h-10 min-w-0 rounded-[7px] border border-line bg-white px-3 text-[11px] font-normal text-ink outline-none placeholder:text-[#b2a7b3] focus:border-purple-700 focus:ring-[3px] focus:ring-[#5800520c]"
                />

                {fieldState.error && (
                  <span className="text-red-600">
                    {fieldState.error.message}
                  </span>
                )}
              </label>
            )}
          />

          <Controller
            name="limitCents"
            control={control}
            render={({ field, fieldState }) => (
              <label className="flex flex-col gap-2 text-[11px] font-bold text-ink">
                Limite de consumo (R$)

                <input
                  {...field}
                  placeholder="Ex.: 50,00"
                  value={formatCurrency((field.value || 0).toString())}
                  onChange={(e) => field.onChange(currencyToCents(e.target.value.toString()))}
                  className="h-10 min-w-0 rounded-[7px] border border-line bg-white px-3 text-[11px] font-normal text-ink outline-none placeholder:text-[#b2a7b3] focus:border-purple-700 focus:ring-[3px] focus:ring-[#5800520c]"
                />

                <span className="text-[10px] font-normal text-muted">
                  Deixe vazio para não definir um limite padrão.
                </span>

                {fieldState.error && (
                  <span className="text-red-600">
                    {fieldState.error.message}
                  </span>
                )}
              </label>
            )}
          />

          <button
            type="submit"
            className="flex items-center justify-center gap-2.25 rounded-lg border-0 bg-purple-700 px-4 py-3.25 text-[11px] font-extrabold text-white hover:bg-purple-600"
          >
            {edit ? <Edit2 size={17} /> : <Plus size={17} />}

            {edit ? "Salvar alterações" : "Cadastrar regra"}
          </button>

          {edit && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-line bg-white px-4 py-3 text-[11px] font-bold text-ink hover:bg-purple-50"
            >
              Cancelar edição
            </button>
          )}
        </form>
      </section>

      {/* Listagem */}
      <section className="mb-4.25 min-w-0 rounded-xl border border-line bg-white p-5.5 max-[900px]:p-4 max-[680px]:p-3.25">
        <div className="mb-4 flex items-center justify-between gap-3 max-[680px]:flex-col max-[680px]:items-start">
          <div>
            <h2 className="my-1.75 font-['Barlow_Condensed'] text-[26px] leading-[0.95] font-black uppercase text-purple-700">
              Regras cadastradas
            </h2>

            <p className="m-0 text-[11px] leading-[1.6] text-muted">
              {participantRoles.length} cargos cadastrados
            </p>
          </div>
        </div>

        <div className="flex flex-col">
          {participantRoles.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center text-muted">
              <ShieldCheck size={30} />

              <p className="text-[12px]">
                Nenhuma regra cadastrada.
              </p>
            </div>
          ) : (
            participantRoles.map((role: Role) => (
              <div
                key={role.id}
                className="flex items-center gap-3 border-b border-[#eee4ef] py-3"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-purple-50 text-purple-700">
                  <ShieldCheck size={18} />
                </span>

                <div className="min-w-0 flex-1">
                  <b className="block text-[11px] text-purple-700">
                    {role.name}
                  </b>

                  <small className="mt-1 block text-[10px] text-muted">
                    {role.role}
                  </small>
                </div>

                <strong className="shrink-0 text-[11px] text-purple-700">
                  {role.limitCents === null
                    ? "Não definido"
                    : money(role.limitCents)}
                </strong>

                <button
                  type="button"
                  onClick={() => editRole(role)}
                  title="Editar regra"
                  className="shrink-0 text-purple-700 transition-colors hover:text-orange-600"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}