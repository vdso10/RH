import { useState, useContext } from "react"
import './company.css'
import Title from '../../components/Title'
import Header from '../../components/Header'
import {db} from "../../services/firebaseConnection"
import {addDoc, collection} from "firebase/firestore"

import {FiSliders} from 'react-icons/fi'

import {toast} from 'react-toastify'


export default function Company(){

  const [nome, setNome] = useState('')
  const [cnpj, setCnpj] = useState('')
    

  async function handleAdd(e){
    e.preventDefault();
    
    if(nome !== '' && cnpj !== ''){
      await addDoc(collection(db, 'companies'), {
        nome: nome,
        cnpj: cnpj
                            
      })
      .then(() =>{
        setNome('');
        setCnpj('')
        
        toast.info('Empresa cadastrada com sucesso!')
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
        <Title name='Empresa'>
          <FiSliders size={25} />

        </Title>

        <div className='container'>
          <form className='form-profile customers' onSubmit={handleAdd}>
            <label>Empresa</label>
            <input
              type='text' 
              placeholder='Nome da Empresa'
              value={nome} 
              onChange={ (e) => setNome(e.target.value)}
            />

            <label>CNPJ</label>
            <input
              type='text' 
              placeholder='Cnpj da empresa'
              value={cnpj} 
              onChange={ (e) => setCnpj(e.target.value)}
            />            

            <button type='submit'>Cadastrar</button>
          
          </form>
        </div>
      </div>
    </div>
  )
}