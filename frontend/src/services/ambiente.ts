import { obterStorageNavegador } from './storage';

/** Storage único da aplicação no navegador (localStorage ou, se bloqueado, memória). */
export const ambiente = obterStorageNavegador();
