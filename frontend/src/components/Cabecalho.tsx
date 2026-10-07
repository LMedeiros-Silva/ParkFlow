import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export interface Migalha {
  rotulo: string;
  para?: string;
}

interface Props {
  titulo: string;
  descricao?: ReactNode;
  migalhas?: Migalha[];
  acoes?: ReactNode;
}

export function CabecalhoPagina({ titulo, descricao, migalhas, acoes }: Props) {
  return (
    <header className="cabecalho-pagina">
      {migalhas && migalhas.length > 0 && (
        <nav aria-label="Trilha de navegação" className="migalhas">
          <ol>
            {migalhas.map((migalha, indice) => {
              const ultima = indice === migalhas.length - 1;
              return (
                <li key={`${migalha.rotulo}-${indice}`}>
                  {migalha.para && !ultima ? (
                    <Link to={migalha.para}>{migalha.rotulo}</Link>
                  ) : (
                    <span aria-current={ultima ? 'page' : undefined}>{migalha.rotulo}</span>
                  )}
                  {!ultima && <ChevronRight aria-hidden="true" size={14} />}
                </li>
              );
            })}
          </ol>
        </nav>
      )}
      <div className="cabecalho-pagina__linha">
        <div>
          <h1>{titulo}</h1>
          {descricao && <p className="cabecalho-pagina__descricao">{descricao}</p>}
        </div>
        {acoes && <div className="cabecalho-pagina__acoes">{acoes}</div>}
      </div>
    </header>
  );
}
