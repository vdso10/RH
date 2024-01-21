import { useState, useContext } from "react"
import './driver.css'
import Title from '../../components/Title'
import Header from '../../components/Header'
import {db} from "../../services/firebaseConnection"
import {addDoc, collection} from "firebase/firestore"

import {FiUser} from 'react-icons/fi'

import {toast} from 'react-toastify'


export default function Drivers(){

  const [nome, setNome] = useState('')
  

  async function handleAdd(e){
    e.preventDefault();
    
    if(nome !== ''){
      await addDoc(collection(db, 'drivers'), {
        nome: nome,
                            
      })
      .then(() =>{
        setNome('');
        
        toast.info('Motorista cadastrado com sucesso!')
      })
      .catch((error) =>{
        console.log(error)
        toast.error('Ops, error no cadastro da empresa!')
      })
    }      
    else{
      toast.error('Preenchimento obrigatório!')
    }
  }

  return(
    <div>
      <Header />
      <div className='content'>
        <Title name='Motorista'>
          <FiUser size={25} />

        </Title>

        <div className='container'>
          <form className='form-profile customers' onSubmit={handleAdd}>
            <label>Nome</label>
            <input
              type='text' 
              placeholder='Nome do Motorista'
              value={nome} 
              onChange={ (e) => setNome(e.target.value)}
            />            

            <button type='submit'>Cadastrar</button>
          
          </form>
        </div>
      </div>
    </div>
  )
}