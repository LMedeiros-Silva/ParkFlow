import type { Sessao } from './storage';

/**
 * Autenticação SIMULADA para demonstração (RF01/RF02). Não há backend, hash de senha nem token:
 * as credenciais abaixo são públicas e servem apenas para o protótipo acadêmico.
 */
export const CREDENCIAIS_DEMO = {
  email: 'admin@parkflow.com',
  senha: '123456',
  nome: 'Administrador Demo',
} as const;

export function autenticar(email: string, senha: string, agora: Date = new Date()): Sessao | null {
  const emailNormalizado = email.trim().toLowerCase();
  if (emailNormalizado !== CREDENCIAIS_DEMO.email || senha !== CREDENCIAIS_DEMO.senha) {
    return null;
  }
  return { email: CREDENCIAIS_DEMO.email, nome: CREDENCIAIS_DEMO.nome, iniciadaEm: agora.toISOString() };
}
