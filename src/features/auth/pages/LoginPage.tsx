import { LoginForm } from '@/features/auth/components/LoginForm'
import logo from '@/assets/logotipo_coringa.png'

export const LoginPage = () => (
  <main className="flex min-h-svh">
    {/* Painel de marca — só aparece em lg+ */}
    <div
      className="relative hidden flex-col items-center justify-center overflow-hidden px-10 py-12 lg:flex lg:basis-[42%]"
      style={{ background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)' }}
    >
      {/* Círculos decorativos */}
      <span className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 rounded-full border border-white/7 bg-white/4" />
      <span className="pointer-events-none absolute -left-16 bottom-14 h-56 w-56 rounded-full border border-white/7 bg-white/4" />
      <span className="pointer-events-none absolute bottom-[-40px] right-10 h-36 w-36 rounded-full border border-white/7 bg-white/4" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <img src={logo} alt="Coringa" className="mb-7 w-28 drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)] brightness-110" />
        <h1 className="mb-3 text-[1.75rem] font-extrabold leading-tight tracking-tight text-white">
          Coringa Vendas
        </h1>
        <p className="max-w-[260px] text-sm leading-relaxed text-white/60">
          Sistema de gerenciamento de pedidos para representantes comerciais
        </p>
      </div>
    </div>

    {/* Painel do formulário */}
    <div className="flex flex-1 items-center justify-center bg-background p-5">
      <div className="w-full max-w-[400px] rounded-2xl bg-white p-10 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05)]">
        {/* Logo mobile */}
        <div className="mb-6 flex justify-center lg:hidden">
          <img src={logo} alt="Coringa" className="w-[90px]" />
        </div>

        <div className="mb-7">
          <h2 className="text-[1.5rem] font-extrabold tracking-tight text-[#0f172a]">Bem-vindo</h2>
          <p className="mt-1 text-sm text-[#64748b]">Acesse sua conta para continuar</p>
        </div>

        <LoginForm />
      </div>
    </div>
  </main>
)
