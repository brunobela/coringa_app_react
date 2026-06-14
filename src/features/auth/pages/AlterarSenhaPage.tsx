import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff, Lock, CheckCircle2, XCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { authService } from '@/features/auth/services/authService'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Informe a senha atual'),
    newPassword: z.string().min(6, 'A nova senha deve ter ao menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme a nova senha'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

const strengthRules = [
  { label: 'Ao menos 6 caracteres', test: (v: string) => v.length >= 6 },
  { label: 'Letra maiúscula', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'Número', test: (v: string) => /\d/.test(v) },
  { label: 'Caractere especial', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
]

const StrengthBar = ({ password }: { password: string }) => {
  const score = strengthRules.filter((r) => r.test(password)).length
  const colors = ['bg-[#ef4444]', 'bg-[#f97316]', 'bg-[#eab308]', 'bg-[#22c55e]']
  const labels = ['', 'Fraca', 'Média', 'Boa', 'Forte']

  if (!password) return null

  return (
    <div className="mt-2.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={cn('h-1.5 flex-1 rounded-sm transition-colors', n <= score ? colors[score - 1] : 'bg-muted')}
          />
        ))}
      </div>
      <p className="mt-1 text-right text-[0.75rem] text-muted-foreground">{labels[score]}</p>
      <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
        {strengthRules.map((r) => {
          const ok = r.test(password)
          return (
            <li key={r.label} className={cn('flex items-center gap-1.5 text-[0.75rem]', ok ? 'text-[#16a34a]' : 'text-muted-foreground')}>
              {ok ? <CheckCircle2 className="size-3.5 shrink-0" /> : <XCircle className="size-3.5 shrink-0" />}
              {r.label}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const PasswordInput = ({
  id,
  placeholder,
  error,
  ...props
}: React.ComponentProps<'input'> & { error?: string }) => {
  const [show, setShow] = useState(false)
  return (
    <div>
      <div className="relative">
        <Input
          id={id}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          className={cn('pr-10', error && 'border-destructive focus-visible:ring-destructive')}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {error && <p className="mt-1 text-[0.78rem] text-destructive">{error}</p>}
    </div>
  )
}

export const AlterarSenhaPage = () => {
  const { user } = useCurrentUser()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const newPassword = watch('newPassword', '')

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) =>
      authService.changePassword({
        email: user!.email,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      toast.success('Senha alterada com sucesso!')
      reset()
    },
    onError: () => {
      toast.error('Erro ao alterar a senha. Verifique a senha atual e tente novamente.')
    },
  })

  return (
    <div className="flex min-h-[calc(100vh-70px)] items-start justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        {/* Header card */}
        <div
          className="flex items-center gap-4 rounded-t-2xl px-7 py-6"
          style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366f1 100%)' }}
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-white/15">
            <Lock className="size-6 text-white" />
          </div>
          <div>
            <h2 className="text-[1.2rem] font-extrabold text-white">Alterar Senha</h2>
            <p className="text-[0.82rem] text-white/70">Mantenha sua conta segura</p>
          </div>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit((d) => mutate(d))}
          className="flex flex-col gap-5 rounded-b-2xl border border-t-0 border-border/60 bg-white px-7 py-6 shadow-sm"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="currentPassword" className="text-sm font-medium text-[#374151]">
              Senha Atual
            </label>
            <PasswordInput
              id="currentPassword"
              placeholder="••••••••"
              error={errors.currentPassword?.message}
              {...register('currentPassword')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="newPassword" className="text-sm font-medium text-[#374151]">
              Nova Senha
            </label>
            <PasswordInput
              id="newPassword"
              placeholder="••••••••"
              error={errors.newPassword?.message}
              {...register('newPassword')}
            />
            <StrengthBar password={newPassword} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-[#374151]">
              Confirmar Nova Senha
            </label>
            <PasswordInput
              id="confirmPassword"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isPending ? 'Salvando...' : 'Salvar Nova Senha'}
          </button>
        </form>
      </div>
    </div>
  )
}
