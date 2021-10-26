import { useEffect, useState, FormEvent } from 'react';
import * as ImagemService from './services/imagensService';
import { Imagem } from './types/Imagem';
import { AreaImagem } from './components/AreaImagem';
import * as Style from './App.styles';

export default function App() {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagens, setImagens] = useState<Imagem[]>([]);

  useEffect(() => {
    getImagens();
  }, []);

  async function getImagens() {
    setLoading(true);
    setImagens(await ImagemService.getAll());
    setLoading(false);
  }

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const arquivo = formData.get('imagem') as File;

    if (arquivo && arquivo.size > 0) {
      setUploading(true);
      let resposta = await ImagemService.add(arquivo);
      setUploading(false);

      if (resposta instanceof Error) {
        alert(`${resposta.name} - ${resposta.message}`);
      } else {
        let newImagens = [...imagens];
        newImagens.push(resposta);
        setImagens(newImagens);
      }
    } else {
      alert('Selecione um arquivo de imagem primeiro!');
    }
  }

  async function handleDelete(nome: string) {
    await ImagemService.remove(nome);
    getImagens();
  }

  return (
    <Style.Container>
      <Style.Content>
        <Style.Header>Galeria de Fotos</Style.Header>

        <Style.UploadForm method="post" onSubmit={handleFormSubmit}>
          <input type="file" name="imagem" />
          <input type="submit" value="Enviar" />
          {uploading && "Enviando..."}
        </Style.UploadForm>

        {
          loading &&
          <Style.Loading>
            <div className="emoji">✋</div>
            <div>Carregando...</div>
          </Style.Loading>
        }

        {
          !loading && imagens.length > 0 &&
          <Style.ListagemImagens>
            {imagens.map((imagem, index) => (
              <AreaImagem
                key={index}
                imagem={imagem}
                onDelete={handleDelete}
              />
            ))}
          </Style.ListagemImagens>
        }

        {
          !loading && imagens.length === 0 &&
          <Style.Loading>
            <div className="emoji">😞</div>
            <div>Não há imagens a serem exibidas!</div>
          </Style.Loading>
        }
      </Style.Content>
    </Style.Container>
  );
}