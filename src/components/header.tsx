import { Settings2, ShoppingBag, Wifi, WifiOff } from "lucide-react"
import { cn } from "@/utils/cn"
import { useNavigate } from "react-router"
import { useContext, useEffect } from "react"
import { DataContext } from "@/context/contentContext"
import { customToast } from "@/utils/toast"
import { api } from "@/services/api"

interface IProps {
  setMode: React.Dispatch<React.SetStateAction<"store" | "admin">>
  online: boolean
  mode: "store" | "admin"
}

export default function Header({
  online,
}: IProps) {
  const navigate = useNavigate()

  const { auth, setUserAuth, userAuth } = useContext(DataContext)

  useEffect(() => {
    if (!userAuth) {
      navigate('/')
      api.defaults.headers["x-admin-password"] = ""
    }
  }, [])

  const goToStore = () => {
    navigate('/')
    setUserAuth(false)
  }

  return (
    <header className="flex z-50 h-19.5 items-center justify-between px-[clamp(18px,5vw,76px)] border-b border-(--line) bg-white">
      <button
        className="flex items-center gap-3 border-0 bg-transparent p-0 text-left text-(--purple)"
        onClick={goToStore}
      >
        <img src="/awake-mark.png" alt="Awake Camp" className="block h-11 w-11 object-contain brand" />
        <span>
          <b className="block font-['Barlow_Condensed',sans-serif] text-[25px] font-black leading-[0.9] tracking-[1px]">AWAKE</b>
          <small className="mt-1.5 text-[9px] font-extrabold tracking-[1.6px]">CANTINA · 2026</small>
        </span>
      </button>

      <div className="flex items-center gap-4.5">
        <span
          className={cn(
            'flex items-center gap-2 text-xs font-bold',
            online ? "text-forest-600" : "text-terracotta-600"
          )}
        >
          {online ? <Wifi size={15} /> : <WifiOff size={15} />}{" "}
          {online ? "Sistema local" : "API desconectada"}
        </span>
        <button
          className={cn(
            'flex items-center gap-2 border border-(--line) rounded-lg bg-white text-purple-700 py-2.75 px-3.5 hover:bg-purple-50 hover:border-purple-200',
            userAuth ? 'bg-purple-700 text-white border-purple-700 hover:text-purple-700' : ''
          )}
          onClick={async () => {
            if (userAuth) {
              goToStore()
            } else {
              const pass = window.prompt("Senha administrativa");
              if (pass) {
                const passIsValid = await auth(pass)
                if (passIsValid) {
                  navigate('/admin')
                } else {
                  customToast({
                    message: "Não foi possível entrar. Verifique sua senha e tente novamente.",
                    type: 'info',
                    options: {
                      position: "bottom-right"
                    }
                  })
                }
              }
            }
          }}
        >
          {userAuth ? (
            <ShoppingBag size={17} />
          ) : (
            <Settings2 size={17} />
          )}{" "}
          <p className={"font-extrabold text-xs"}>
            {userAuth ? "Voltar à cantina" : "Área da equipe"}
          </p>
        </button>
      </div>
    </header>
  )
}