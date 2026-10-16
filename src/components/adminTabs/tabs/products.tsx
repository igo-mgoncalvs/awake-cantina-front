import { DataContext } from "@/context/contentContext";
import { ProductsRoutes } from "@/services/products";
import { CreateProduct } from "@/types/product";
import { currencyToCents } from "@/utils/currencyToCents";
import { formatCurrency } from "@/utils/formatCurrency";
import { money } from "@/utils/money";
import { customToast } from "@/utils/toast";
import { Check, CircleX, Edit, Edit2, Package, Plus, Trash2 } from "lucide-react";
import { FormEvent, useCallback, useContext, useRef, useState } from "react";
import { Controller, useForm } from 'react-hook-form'

export default function Products() {
  const [productImage, setProductImage] = useState("");
  const [edit, setEdit] = useState<string | null>('')

  const { products, getProducts } = useContext(DataContext)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const { control, handleSubmit, reset } = useForm<CreateProduct>({
    defaultValues: {
      priceCents: 0
    }
  })

  const createProduct = useCallback((data: CreateProduct) => {
    if (edit) {
      ProductsRoutes.update(edit, {
        ...data,
        priceCents: currencyToCents(data.priceCents.toString()),
        imageUrl: productImage || undefined
      })
        .then(() => {
          customToast({
            message: "Produto editado.",
            type: "success"
          })
          getProducts()
          reset({
            barcode: "",
            imageUrl: null,
            name: "",
            priceCents: 0
          })
          setProductImage('')
          fileInputRef.current!.value = ""
        })
        .catch(({ response }) => {
          customToast({
            message: response.data.message || "Erro ao editar.",
            type: "error"
          })
        })
    } else {
      ProductsRoutes.create({
        ...data,
        imageUrl: productImage || undefined,
        priceCents: currencyToCents(data.priceCents.toString()),
      })
        .then(() => {
          customToast({
            message: "Produto cadastrado.",
            type: "success"
          })
          getProducts();
          reset({
            barcode: "",
            imageUrl: null,
            name: "",
            priceCents: 0
          })
          fileInputRef.current!.value = ""
          setProductImage("")
        })
        .catch(({ response }) => {
          customToast({
            message: response.data.message || "Erro ao cadastrar.",
            type: "error"
          })
        })
    }
  }, [edit, productImage])

  const inactiveProduct = (id: string) => {
    ProductsRoutes.inative(id)
      .then(() => {
        getProducts()
      })
  }

  const ativeProduct = (id: string, data: CreateProduct) => {
    ProductsRoutes.update(id, data)
      .then(() => {
        getProducts()
      })
  }

  return (

    <div className="grid grid-cols-[2fr_3fr] items-start gap-4.25 max-[900px]:grid-cols-1">
      <section className="mb-4.25 min-w-0 rounded-xl border border-line bg-white p-5.5 max-[900px]:p-4 max-[680px]:p-3.25">
        <div className="mb-4 flex items-center justify-between gap-3 max-[680px]:flex-col max-[680px]:items-start">
          <div>
            <h2 className="my-1.75 font-['Barlow_Condensed'] text-[26px] leading-[0.95] font-black uppercase text-purple-700">
              Cadastrar produto
            </h2>
            <p className="m-0 text-[11px] leading-[1.6] text-muted">
              Informe o código impresso na embalagem, se houver.
            </p>
          </div>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(createProduct)}
        >
          <label className="flex flex-col gap-2 text-[11px] font-bold text-ink">
            Foto do produto (opcional)
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                if (file.size > 3 * 1024 * 1024) {
                  customToast({
                    message: "A imagem deve ter até 3 MB.",
                    type: "error",
                  });
                  return;
                }

                const reader = new FileReader();
                reader.onload = () =>
                  setProductImage(String(reader.result || ""));
                reader.readAsDataURL(file);
              }}
              className="w-full min-w-0 text-[11px] font-normal text-muted file:mr-3 file:rounded-md file:border-0 file:bg-purple-50 file:px-3 file:py-2 file:text-[11px] file:font-bold file:text-purple-700"
            />
          </label>

          {productImage && (
            <button
              type="button"
              className="relative h-25 w-25 group hover:cursor-pointer"
              onClick={() => {
                setProductImage('')
                fileInputRef.current!.value = ''
              }}
            >
              <span className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-all">
                <CircleX size={14} />
              </span>
              <img
                className="rounded-lg border border-line object-cover group-hover:opacity-20 transition-all"
                src={productImage}
                alt="Prévia do produto"
              />
            </button>
          )}

          <Controller
            name="name"
            control={control}
            rules={{
              required: true
            }}
            render={({ field }) => (
              <label className="flex flex-col gap-2 text-[11px] font-bold text-ink">
                Nome do produto
                <input
                  {...field}
                  placeholder="Ex.: Refrigerante lata"
                  className="h-10 min-w-0 rounded-[7px] border border-line bg-white px-3 text-[11px] font-normal text-ink outline-none placeholder:text-[#b2a7b3] focus:border-purple-700 focus:ring-[3px] focus:ring-[#5800520c]"
                />
              </label>
            )}
          />

          <Controller
            name="priceCents"
            control={control}
            rules={{
              required: true,
              validate: (value) => currencyToCents(value.toString()) > 0
            }}
            render={({ field }) => (
              <label className="flex flex-col gap-2 text-[11px] font-bold text-ink">
                Preço (R$)
                <input
                  {...field}
                  value={formatCurrency(field.value.toString())}
                  onChange={(e) => field.onChange(formatCurrency(e.target.value.toString()))}
                  placeholder="5,00"
                  className="h-10 min-w-0 rounded-[7px] border border-line bg-white px-3 text-[11px] font-normal text-ink outline-none placeholder:text-[#b2a7b3] focus:border-purple-700 focus:ring-[3px] focus:ring-[#5800520c]"
                />
              </label>
            )}
          />


          <Controller
            name="barcode"
            control={control}
            rules={{
              required: true
            }}
            render={({ field }) => (
              <label className="flex flex-col gap-2 text-[11px] font-bold text-ink">
                Código de barras
                <input
                  {...field}
                  autoFocus
                  placeholder="Escaneie ou digite o código"
                  className="h-10 min-w-0 rounded-[7px] border border-line bg-white px-3 text-[11px] font-normal text-ink outline-none placeholder:text-[#b2a7b3] focus:border-purple-700 focus:ring-[3px] focus:ring-[#5800520c]"
                />
              </label>
            )}
          />

          <button
            type="submit"
            className="flex items-center justify-center gap-2.25 rounded-lg border-0 bg-purple-700 px-4 py-3.25 text-[11px] font-extrabold text-white hover:bg-purple-600"
          >
            {edit ? <Edit2 size={17} /> : <Plus size={17} />}

            {edit ? "Salvar alterações" : "Cadastrar produto"}
          </button>

          {edit && (
            <button
              type="button"
              onClick={() => {
                setEdit(null)
                reset({
                  barcode: "",
                  imageUrl: "",
                  name: "",
                  priceCents: 0
                })
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
              Catálogo
            </h2>
            <p className="m-0 text-[11px] leading-[1.6] text-muted">
              {products.length} produtos ativos
            </p>
          </div>
        </div>

        <div className="flex flex-col">
          {products.map((p) => (
            <div
              className="flex items-center justify-center gap-3 border-b border-[#eee4ef] py-3"
              key={p.id}
            >
              {p.imageUrl ? (
                <img
                  className="h-10 w-10 shrink-0 rounded-lg border border-line object-cover"
                  src={p.imageUrl}
                  alt={p.name}
                />
              ) : (
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-purple-50 text-purple-700">
                  <Package size={18} />
                </span>
              )}

              <div className="min-w-0 flex-1">
                <b className="block text-[11px] text-purple-700">
                  {p.name}
                </b>
                <small className="mt-1 block text-[9px] text-[#a092a3]">
                  {p.category}
                  {p.barcode ? ` · ${p.barcode}` : ""}
                </small>
              </div>

              <strong className="shrink-0 text-[11px] text-purple-700">
                {money(p.priceCents)}
              </strong>

              <span className="flex gap-2 text-purple-700">
                <button
                  type="button"
                  onClick={() => {
                    setEdit(p.id)
                    reset(p)
                    setProductImage(p.imageUrl || '')
                  }}
                >
                  <Edit2 size={16} className="cursor-pointer hover:text-orange-600 transition-all" />
                </button>

                <>
                  <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-ink">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      onChange={(e) => e.target.checked ? ativeProduct(p.id, p) : inactiveProduct(p.id)}
                    />

                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-[5px] border transition-colors ${p.active
                        ? "border-purple-700 bg-purple-700 text-white"
                        : "border-line bg-white text-transparent"
                        }`}
                    >
                      <Check size={14} strokeWidth={3} />
                    </span>
                  </label>

                </>
              </span>
            </div>
          )
          )}
        </div>
      </section>
    </div>

  )
}