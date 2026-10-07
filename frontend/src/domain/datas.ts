/** Utilidades de data sem dependências externas. Datas de formulário usam o formato AAAA-MM-DD no fuso local. */

export function paraDataInput(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

/** Converte AAAA-MM-DD no início (00:00:00.000) ou fim (23:59:59.999) do dia local. */
export function limiteDoDia(valor: string, limite: 'inicio' | 'fim'): Date | null {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
  if (!partes) return null;
  const [, ano, mes, dia] = partes.map(Number);
  const data =
    limite === 'inicio' ? new Date(ano, mes - 1, dia, 0, 0, 0, 0) : new Date(ano, mes - 1, dia, 23, 59, 59, 999);
  return Number.isNaN(data.getTime()) ? null : data;
}

const formatoDataHora = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const formatoData = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export function formatarDataHora(iso: string | Date): string {
  return formatoDataHora.format(typeof iso === 'string' ? new Date(iso) : iso);
}

export function formatarData(valor: string): string {
  const data = limiteDoDia(valor, 'inicio');
  return data ? formatoData.format(data) : valor;
}

/** Descrição curta e relativa ("há 5 min") para listas de atividade. */
export function formatarTempoRelativo(iso: string, agora: Date): string {
  const minutos = Math.round((agora.getTime() - new Date(iso).getTime()) / 60000);
  if (minutos < 1) return 'agora mesmo';
  if (minutos < 60) return `há ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas} h`;
  return formatarDataHora(iso);
}
