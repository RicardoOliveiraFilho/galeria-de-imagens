import { ref, listAll, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { v4 as createId } from 'uuid';

import { Imagem } from '../types/Imagem';
import { storage } from '../libs/firebase';

export async function getAll() {
  let imagens: Imagem[] = [];

  const pastaImagens = ref(storage, 'imagens');
  const listaImagens = await listAll(pastaImagens);

  for(let i in listaImagens.items) {
    let photoUrl = await getDownloadURL(listaImagens.items[i]);

    imagens.push({
        nome: listaImagens.items[i].name,
        url: photoUrl
    });
  }

  return imagens;
}

export async function add(imagem: File) {
  if (['image/jpeg', 'image/jpg', 'image/png'].includes(imagem.type)) {
    
    let nomeAleatorio = createId();
    let novoArquivo = ref(storage, `imagens/${nomeAleatorio}`);

    let upload = await uploadBytes(novoArquivo, imagem);
    let imagemURL = await getDownloadURL(upload.ref);

    return { nome: upload.ref.name, url: imagemURL } as Imagem;

  } else {
    return new Error('Tipo de arquivo não permitido!');
  }
}

export const remove = async (nome: string) => {
  let imagemRef = ref(storage, `imagens/${nome}`);
  await deleteObject(imagemRef);
}