import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { cn } from '@/lib/utils'

const schema = z.object({
  login: z.string().min(1, 'Informe o login'),
  password: z.string().min(1, 'Informe a senha'),
})

type FormData = z.infer<typeof schema>

const FieldShell = ({ children, error }: { children: ReactNode; error?: string }) => (
  <div className="flex flex-col gap-1.5">
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border border-input px-4 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50',
        error && 'border-destructive focus-within:ring-destructive/20',
      )}
    >
      {children}
    </div>
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
)

const fieldInputClassName = 'h-12 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0'

export const LoginForm = () => {
  const { mutate: login, isPending, error } = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = (data: FormData) => login(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FieldShell error={errors.login?.message}>
        <User className="size-5 shrink-0 text-muted-foreground" />
        <span className="h-6 w-px shrink-0 bg-border" />
        <Input
          id="login"
          placeholder="Login"
          aria-label="Login"
          autoComplete="username"
          className={fieldInputClassName}
          {...register('login')}
        />
      </FieldShell>

      <FieldShell error={errors.password?.message}>
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Senha"
          aria-label="Senha"
          autoComplete="current-password"
          className={fieldInputClassName}
          {...register('password')}
        />
        <span className="h-6 w-px shrink-0 bg-border" />
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
        >
          {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </FieldShell>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Login ou senha inválidos
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="mt-2 h-12 w-full rounded-xl text-base font-bold text-white shadow-md hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366f1 100%)' }}
      >
        {isPending ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  )
}
