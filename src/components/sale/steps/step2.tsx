import { DataContext } from "@/context/contentContext";
import { Participant } from "@/types/participant";
import { CartItem, Product } from "@/types/product";
import { money } from "@/utils/money";
import { scanKey } from "@/utils/scanKey";
import { customToast } from "@/utils/toast";
import { ArrowRight, Barcode, Minus, Package, Plus, Search, ShoppingBag, Trash2 } from "lucide-react";
import { FormEvent, useContext, useEffect, useRef, useState } from "react";

interface IProps {
  selected: Participant | null
  cart: CartItem[]
  total: number
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  setStep: React.Dispatch<React.SetStateAction<number>>
  setSelected: React.Dispatch<React.SetStateAction<Participant | null>>
}

export default function Step2({
  selected,
  cart,
  total,
  setCart,
  setStep,
  setSelected
}: IProps) {
  const [productScan, setProductScan] = useState<string>('')
  const [search, setSearch] = useState<string>('')

  const { products } = useContext(DataContext)

  const productInput = useRef<HTMLInputElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  const isSearching = useRef(false);

  useEffect(() => {
    const product = productInput.current;
    const search = searchInput.current;

    if (!product || !search) return;

    const handleProductBlur = () => {
      setTimeout(() => {
        if (!isSearching.current) {
          product.focus();
        }
      }, 0);
    };

    const handleSearchFocus = () => {
      isSearching.current = true;
    };

    const handleSearchBlur = () => {
      isSearching.current = false;

      setTimeout(() => {
        product.focus();
      }, 0);
    };

    product.addEventListener("blur", handleProductBlur);
    search.addEventListener("focus", handleSearchFocus);
    search.addEventListener("blur", handleSearchBlur);

    product.focus();

    return () => {
      product.removeEventListener("blur", handleProductBlur);
      search.removeEventListener("focus", handleSearchFocus);
      search.removeEventListener("blur", handleSearchBlur);
    };
  }, []);

  const filteredProducts = products.filter((p) =>
    `${p.name} ${p.category} ${p.barcode ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  function addProduct(product: Product) {
    setCart((old) => {
      const found = old.find((x) => x.id === product.id);
      return found
        ? old.map((x) =>
          x.id === product.id ? { ...x, quantity: x.quantity + 1 } : x,
        )
        : [...old, { ...product, quantity: 1 }];
    });
  }

  function scanProduct(e: FormEvent) {
    e.preventDefault();
    const code = productScan.trim().toLowerCase();
    if (!code) return;
    const found = products.find(
      (p) =>
        (p.barcode && p.barcode.trim().toLowerCase() === code) ||
        p.id.toLowerCase() === code ||
        p.name.trim().toLowerCase() === code,
    );
    if (!found) {
      setProductScan('')
      customToast({
        message: "Produto não encontrado. Tente localizar pelo catálogo abaixo.",
        type: "error",
        options: {
          autoClose: 3500
        }
      })
      return;
    }
    addProduct(found);
    setProductScan("");
    productInput.current?.focus();
  }

  function changeQuantity(id: string, amount: number) {
    setCart((old) =>
      old
        .map((x) => (x.id === id ? { ...x, quantity: x.quantity + amount } : x))
        .filter((x) => x.quantity > 0),
    );
  }

  function resetPurchase() {
    setSelected(null);
    setCart([]);
    setStep(1);
    setProductScan("");
    setSearch("");
    customToast({
      message: "Compra cancelada. Pode começar novamente.",
      type: "info"
    })
  }

  return (

    <section className="mb-11.25">
      <div className="mb-4.25 flex items-center gap-3.25 rounded-[11px] border border-line bg-white px-4.25 py-3.25 max-[680px]:p-2.5">
        <div className="grid size-10.75 shrink-0 place-items-center rounded-full bg-purple-700 font-['Barlow_Condensed'] text-[21px] font-extrabold text-white">
          {selected?.name.slice(0, 1).toUpperCase()}
        </div>

        <div className="flex flex-1 flex-col gap-0.75">
          <small className="text-[8px] font-extrabold tracking-[1.2px] text-[#9a899c]">
            COMPRANDO COMO
          </small>
          <strong className="text-[13px] text-purple-700 max-[680px]:text-[11px]">
            {selected?.name}
          </strong>
          <span className="text-[10px] text-muted">
            {selected?.code}
          </span>
        </div>

        <button
          className="rounded-[7px] border border-line bg-white px-2.5 py-2 text-[#8d6d8f] max-[680px]:px-1.75 max-[680px]:py-1.75 "
          onClick={resetPurchase}
        >
          <span className="text-[10px] font-extrabold max-[680px]:text-[9px]">Não sou eu</span>
        </button>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_325px] items-start gap-4.5 max-[900px]:grid-cols-[minmax(0,1fr)_290px] max-[900px]:gap-3 max-[680px]:grid-cols-1">
        <section className="min-w-0 rounded-xl border border-line bg-white p-5.5 max-[900px]:p-4 max-[680px]:row-start-2">
          <div className="mb-4.25 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center justify-center gap-2 text-[9px] font-extrabold tracking-[2px] text-orange-500">
                PASSO 02 / PRODUTOS
              </div>
              <h2 className="my-1.75 font-['Barlow_Condensed'] text-[26px] leading-[0.95] font-black text-purple-700 uppercase max-[680px]:text-2xl">
                O que vai levar?
              </h2>
              <p className="m-0 text-[11px] leading-[1.6] text-muted">
                Escaneie cada produto ou selecione no catálogo.
              </p>
            </div>

            <span className="shrink-0 whitespace-nowrap rounded-[7px] bg-[#f5edf6] px-2.5 py-2 text-[10px] font-extrabold text-purple-700">
              {cart.reduce((n, x) => n + x.quantity, 0)} itens
            </span>
          </div>

          <form
            className="flex h-12.25 items-center gap-2.5 rounded-lg border border-[#d9c5db] bg-[#fdfafd] py-0 pr-1.5 pl-3.25 text-purple-700 focus-within:border-purple-700 focus-within:shadow-[0_0_0_3px_#5800520c] max-[680px]:gap-1.5 max-[680px]:pl-2.25"
            onSubmit={scanProduct}
          >
            <Barcode size={21} className="shrink-0" />

            <input
              ref={productInput}
              value={productScan}
              onChange={(e) => setProductScan(e.target.value)}
              onKeyDown={(e) =>
                scanKey(e, () => {
                  const form = e.currentTarget.form;
                  form?.requestSubmit();
                })
              }
              placeholder="Escaneie o código do produto"
              className="min-w-0 flex-1 border-0 bg-transparent text-xs text-ink outline-none placeholder:text-[#b2a7b3] max-[680px]:text-[10px]"
            />

            <button
              type="submit"
              className="flex h-9 shrink-0 items-center gap-1.25 rounded-md border-0 bg-purple-700 px-2.75 text-[10px] font-extrabold text-white max-[680px]:w-9.25 max-[680px]:justify-center max-[680px]:text-[0px]"
            >
              <Plus size={18} className="shrink-0 max-[680px]:size-4.5" />
              Adicionar
            </button>
          </form>

          <div className="my-3.25 mb-4.25">
            <div className="flex h-10 items-center gap-2.25 rounded-[7px] border border-line px-3 text-[#9a8a9d]">
              <Search size={17} className="shrink-0" />
              <input
                ref={searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ou procure pelo nome..."
                className="min-w-0 w-full border-0 bg-transparent text-[11px] text-ink outline-none placeholder:text-[#b2a7b3]"
              />
            </div>
          </div>

          {products.length === 0 ? (
            <div className="flex min-h-36.25 flex-col items-center justify-center gap-2 px-5.5 py-5.5 text-center text-[#b4a5b6]">
              <Package size={32} />
              <b className="text-xs text-[#6f5c73]">
                Catálogo sendo preparado
              </b>
              <span className="max-w-75 text-[10px] leading-[1.6]">
                A equipe precisa cadastrar os produtos na área administrativa.
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2.25 max-[680px]:grid-cols-2">
              {filteredProducts.map((p) => (
                <button
                  className="flex min-h-31.5 flex-col items-start rounded-[9px] border border-[#eee7ef] bg-white p-3.25 text-left transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-px hover:border-[#b895ba] hover:shadow-[0_5px_16px_#5800520b] max-[680px]:min-h-29 max-[680px]:p-2.5"
                  key={p.id}
                  onClick={() => addProduct(p)}
                >
                  <span className="mb-2.5 grid size-7.75 shrink-0 place-items-center overflow-hidden rounded-lg bg-[#f5edf6] text-purple-700">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="size-full rounded-[10px] object-contain"
                      />
                    ) : (
                      <Package size={22} />
                    )}
                  </span>

                  <span className="text-[11px] leading-[1.4] font-extrabold text-[#3c2b40]">
                    {p.name}
                  </span>

                  <span className="mt-auto flex w-full items-center justify-between gap-2 pt-2.5">
                    <b className="text-[13px] text-purple-700">
                      {money(p.priceCents)}
                    </b>
                    <i className="grid size-5.75 shrink-0 place-items-center rounded-md bg-orange-500 text-white not-italic">
                      <Plus size={15} />
                    </i>
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <aside className="sticky top-3.5 min-w-0 rounded-xl border border-line bg-white p-4.75 max-[900px]:p-4 max-[680px]:static max-[680px]:row-start-1">
          <div className="flex items-center justify-between border-b border-dashed border-[#dfd1e0] pb-3.75 text-orange-500">
            <div>
              <span className="flex items-center gap-2 text-[9px] font-extrabold tracking-[2px] text-orange-500">
                SUA COMPRA
              </span>
              <h3 className="mt-1.25 mb-0 font-['Barlow_Condensed'] text-2xl font-black text-purple-700 uppercase">
                Minha sacola
              </h3>
            </div>
            <ShoppingBag size={22} />
          </div>

          <div className="min-h-40 max-h-75 overflow-auto max-[680px]:min-h-25 max-[680px]:max-h-52.5">
            {cart.length === 0 ? (
              <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-[#c0b1c2] max-[680px]:min-h-25">
                <ShoppingBag size={27} />
                <span className="text-[11px] font-extrabold text-[#8b7b8e]">
                  Nenhum produto ainda
                </span>
                <small className="text-[9px]">
                  Os itens escaneados aparecem aqui.
                </small>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  className="flex items-center justify-between gap-2.25 border-b border-[#f0eaf0] py-3.25"
                  key={item.id}
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <b className="text-[11px] text-[#38263c]">
                      {item.name}
                    </b>
                    <small className="text-[9px] text-[#9c8da0]">
                      {money(item.priceCents)} cada
                    </small>
                    <strong className="text-[11px] text-purple-700">
                      {money(item.priceCents * item.quantity)}
                    </strong>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.25">
                    <button
                      className="grid size-6 place-items-center rounded-[5px] border border-line bg-white text-purple-700"
                      onClick={() => changeQuantity(item.id, -1)}
                      aria-label="Diminuir"
                    >
                      <Minus size={13} />
                    </button>

                    <span className="min-w-2.5 text-center text-[11px] font-extrabold">
                      {item.quantity}
                    </span>

                    <button
                      className="grid size-6 place-items-center rounded-[5px] border border-line bg-white text-purple-700"
                      onClick={() => changeQuantity(item.id, 1)}
                      aria-label="Aumentar"
                    >
                      <Plus size={13} />
                    </button>

                    <button
                      className="ml-0.5 grid size-6 place-items-center rounded-[5px] border border-line bg-white text-[#bd5a42]"
                      onClick={() =>
                        setCart((old) =>
                          old.filter((x) => x.id !== item.id),
                        )
                      }
                      aria-label="Remover"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-0.75 flex items-center justify-between border-t border-line pt-4.25 pb-3.25">
            <span className="text-[11px] font-bold text-[#8a7a8d]">
              Total
            </span>
            <strong className="font-['Barlow_Condensed'] text-[28px] font-black text-purple-700">
              {money(total)}
            </strong>
          </div>

          <button
            className="flex w-full items-center justify-between gap-2.25 rounded-lg border-0 bg-orange-500 px-4 py-3.25 text-[11px] font-extrabold text-white shadow-[0_3px_0_#d86100] hover:not-disabled:bg-[#ef7000] disabled:cursor-not-allowed"
            disabled={!cart.length}
            onClick={() => setStep(3)}
          >
            Revisar compra
            <ArrowRight size={18} />
          </button>

          <button
            className="mx-auto mt-2.75 block border-0 bg-transparent text-[10px] font-bold text-[#a28da4] hover:text-[#a33f37]"
            onClick={resetPurchase}
          >
            Cancelar compra
          </button>
        </aside>
      </div>
    </section>

  )
}