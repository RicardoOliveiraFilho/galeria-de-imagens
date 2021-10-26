import { Imagem } from '../../types/Imagem';
import * as Style from './styles';

type AreaImagemProps = {
  imagem: Imagem;
  onDelete: (name: string) => void;
}

export function AreaImagem({ imagem, onDelete }: AreaImagemProps) {
  return (
    <Style.Container>
      <img src={imagem.url} alt={imagem.nome} />
      {imagem.nome}
      <button onClick={ ()=> onDelete(imagem.nome) }>Excluir</button>
    </Style.Container>
  );
}