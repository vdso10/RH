
import { useState, useContext } from 'react';
import './profile.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import avatar from '../../assets/avatar.png';


import { doc, updateDoc} from 'firebase/firestore'
import { db, storage } from '../../services/firebaseConnection';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { AuthContext } from '../../contexts/auth';

import { FiSettings, FiUpload } from 'react-icons/fi';

import { toast } from 'react-toastify'

export default function Profile(){
  const { user, logout, setUser, storageUser } = useContext(AuthContext);

  const [nome, setNome] = useState(user && user.nome);
  const [email, setEmail] = useState(user && user.email);

  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [imageAvatar, setImageAvatar] = useState(null);

  
  //mostrando o preview da imagem
  function handleFile(e){

    if(e.target.files[0]){
      const image = e.target.files[0];
      
      if(image.type === 'image/jpeg' || image.type === 'image/png'){

        setImageAvatar(image);
        setAvatarUrl(URL.createObjectURL(image))

      }else{
        alert('Envie uma imagem do tipo PNG ou JPEG');
        setImageAvatar(null);
        return null;
      }
    }
  }

  //enviando a imagem para o firebase
  async function handleUpload(){
    const currentUid = user.uid;

    const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`)

    const uploadTask = uploadBytes(uploadRef, imageAvatar)
    .then((snapshot) =>{

      getDownloadURL(snapshot.ref).then( async (downloadUrl) => {
        let urlFoto = downloadUrl

        const docRef = doc(db, "users", user.uid)
        await updateDoc(docRef, {
          avatarUrl: urlFoto,
          nome: nome
        })
        .then(()=>{
          let data = {
            ...user,
            nome: nome,
            avatarUrl: urlFoto,
          };
          setUser(data);
          storageUser(data);
          toast.success('Atualizado com sucesso!')
  
        })
      })
    })    
  }


  async function handleSave(e){
    e.preventDefault();

    if(imageAvatar === null && nome !== ''){
      // Atualizando o nome do usuário

      const docRef = doc(db, "users", user.uid)
      await updateDoc(docRef, {
        nome: nome
      })
      .then(()=>{
        let data = {
          ...user,
          nome: nome
        };
        setUser(data);
        storageUser(data);
        toast.success('Atualizado com sucesso!')
      })
    }
    else if(nome !== '' && imageAvatar !== null){
      //Atualizando nome e foto do usuario
      
      handleUpload();
    }
  }


  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Meu perfil">
          <FiSettings size={25} />
        </Title>


        <div className="container">
          <form className="form-profile" onSubmit={handleSave}>
            <label className="label-avatar">
              <span>
                <FiUpload color="#FFF" size={25} />
              </span>

              <input type="file" accept="image/*" onChange={handleFile}  /><br/>
              { avatarUrl === null ? (
                <img src={avatar} width="250" height="250" alt="Foto de perfil do usuario" />
              ) : (
                <img src={avatarUrl} width="250" height="250" alt="Foto de perfil do usuario" />
              )}
            </label>

            <label>Nome</label>
            <input type="text" value={nome} onChange={ (e) => setNome(e.target.value) } />

            <label>Email</label>
            <input type="text" value={email} disabled={true} />     

            <button type="submit">Salvar</button>       

          </form>
        </div>

        <div className="container">
            <button className="logout-btn" onClick={ () => logout() } >
               Sair
            </button>
        </div>

      </div>
    </div>
  )
}