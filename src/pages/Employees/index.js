
import { useState, useEffect, useContext } from 'react';

import {db} from '../../services/firebaseConnection';
import { collection, getDocs, getDoc, addDoc, doc, updateDoc} from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';

import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';

import './employee.css';
import { FiPlusCircle } from 'react-icons/fi'

const listRef = collection(db, 'companies');


export default function New(){

  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [quantidadeEmpresas, setQuantidadeEmpresas] = useState('');
  const [quantidadeFuncionarios, setQuantidadeFuncionarios] = useState('');
  
  const [anoCadastro, setAnoCadastro] = useState('');
  
  
  //atualizando e cadastrando funcionario
  async function handleRegister(e){
    e.preventDefault();

      
      await addDoc(collection(db, 'employees'), {
        created: new Date(),        
        quantidadeEmpresas: parseInt(quantidadeEmpresas),
        quantidadeFuncionarios: parseInt(quantidadeFuncionarios),
        anoCadastro: anoCadastro,                
        userId: user.uid

      })      
      .then(()=>{
        toast.success('Empresa criada com sucesso!');
        setQuantidadeEmpresas('')        
        setQuantidadeFuncionarios('')
        setAnoCadastro('')
        
      })
      .catch((err)=>{
        toast.error('Ops erro ao registrar, tente mais tarde.')
        console.log(err);
      })
      navigate('/dashfuncionario')

      return;   
  }  

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name={id ? 'Editando cadastro' : 'Novo cadastro'}>
          <FiPlusCircle size={25} />
        </Title>

        <div className="container">

          <form className="form-profile"  onSubmit={handleRegister} >

            <div>
              <label>Quantidade de Empresas:</label>
              <input
                type='number' 
                placeholder='Quantidade de Empresas'
                value={quantidadeEmpresas} 
                onChange={ (e) => setQuantidadeEmpresas(e.target.value)}
              />              
            </div>           

            <div>
              <label>Quantidade de funcionarios:</label>
              <input
                type='number' 
                placeholder='Quantidade de funcionários'
                value={quantidadeFuncionarios} 
                onChange={ (e) => setQuantidadeFuncionarios(e.target.value)}
              />              
            </div>
            
            <div>
              <label>Ano de cadastro:</label>
              <input
                type='text' 
                placeholder='Data de cadastro'
                value={anoCadastro} 
                onChange={ (e) => setAnoCadastro(e.target.value)}
              />              
            </div>
            
            <button type="submit">Registrar</button>

          </form>

        </div>

      </div>
    </div>
  )
}