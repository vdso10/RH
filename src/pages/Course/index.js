
import { useState, useEffect, useContext } from 'react';

import {db} from '../../services/firebaseConnection';
import { collection, getDocs, getDoc, addDoc, doc, updateDoc} from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';

import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';

import './course.css';
import { FiPlusCircle } from 'react-icons/fi'

const listRef = collection(db, 'drivers');


export default function New(){

  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [loadDrivers, setLoadDrivers] = useState(true);
  const [drivers, setDrivers] = useState([]);
  const [driverselected, setDriverselected] = useState(0);

  const [course, setCourse] = useState('NR20');
  const [status, setStatus] = useState('Ativo');
  const [complemento, setComplemento] = useState('');

  const [dataCurso, setDataCurso] = useState('');
  const [dataValidade, setDataValidade] = useState('');

  const [idDriver, setIdDriver] = useState(false);


  useEffect(()=> {
    async function loadDrivers(){
      const querySnapshot = await getDocs(listRef)     
      .then((snapshot)=>{
        console.log(snapshot)
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            nome: doc.data().nome
          })
        })

        if(lista.length === 0){
          console.log('NENHUMA MOTORISTA FOI ENCONTRADA');
          setDrivers([ { id: '1', nome: 'FREELA' } ]);
          setLoadDrivers(false);
          return;
        }

        setDrivers(lista);
        setLoadDrivers(false);

        if(id){
          loadId(lista);
        }

      })
      .catch((error)=>{
        console.log('DEU ALGUM ERRO!', error);
        setLoadDrivers(false);
        setDrivers([ { id: '1', nome: 'FREELA' } ]);
      })

    }

    loadDrivers();

  }, [id]);


  //editando os registros
  async function loadId(lista){
    
    const docRef = doc(db, 'cursos', id)
    await getDoc(docRef)    
    .then((snapshot) => {
      setCourse(snapshot.data().course);
      setStatus(snapshot.data().status);
      setComplemento(snapshot.data().complemento)
      setDataCurso(snapshot.data().dataCurso)
      setDataValidade(snapshot.data().dataValidade)

      let index = lista.findIndex(item => item.id === snapshot.data().driverId );
      setDriverselected(index);
      setIdDriver(true);

    })
    .catch((err)=>{
      console.log('ERRO NO ID PASSADO: ', err);
      setIdDriver(false);
    })
  }

  //atualizando e cadastrando cursos
  async function handleRegister(e){
    e.preventDefault();

      if(idDriver){
        const docRef = doc(db, 'cursos', id)
        await updateDoc(docRef, {
          created: new Date(),
          driver: drivers[driverselected].nome,
          driverId: drivers[driverselected].id,
          course: course,
          dataCurso: dataCurso,
          dataValidade: dataValidade,
          status: status,
          complemento: complemento,
          userId: user.uid
  
        })
        .then(()=>{
          toast.success('Curso editado com sucesso!');
          setDriverselected(0);
          setComplemento('');
          setDataCurso('')
          setDataValidade('')
          navigate('/dashboard');
        })
        .catch((err)=>{
          toast.error('Ops erro ao atualizar este curso.')
          console.log(err);
        })
        
        return;
      }

      await addDoc(collection(db, 'cursos'), {
        created: new Date(),
        driver: drivers[driverselected].nome,
        driverId: drivers[driverselected].id,
        course: course,
        dataCurso: dataCurso,
        dataValidade: dataValidade,
        status: status,
        complemento: complemento,
        userId: user.uid

      })      
      .then(()=>{
        toast.success('Curso criado com sucesso!');
        setDriverselected(0);
        setComplemento('');
        setDataCurso('')
        setDataValidade('')
        //history.push('/dashboard');
      })
      .catch((err)=>{
        toast.error('Ops erro ao registrar, tente mais tarde.')
        console.log(err);
      })

      return;   
  }


  //Chamado quando troca o curso
  function handleChangeSelect(e){
    setCourse(e.target.value);
    console.log(e.target.value);
  }


  //Chamado quando troca o status
  function handleOptionChange(e){
    setStatus(e.target.value);
  }

  //Chamado quando troca de cliente
  function handleChangeDrivers(e){
    //console.log('INDEX DO CLIENTE SELECIONADO: ', e.target.value);
    console.log('Cliente selecionado ', drivers[e.target.value].nome)
    setDriverselected(e.target.value);
  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name={id ? 'Editando chamado' : 'Novo curso'}>
          <FiPlusCircle size={25} />
        </Title>

        <div className="container">

          <form className="form-profile"  onSubmit={handleRegister} >
            
            <label>Motoristas</label>

            {loadDrivers ? (
              <input type="text" disabled={true} value="Carregando.." />
            ) : (
                <select value={driverselected} onChange={handleChangeDrivers} >
                {drivers.map((item, index) => {
                  return(                                      
                    <option key={item.id} value={index} >
                      {item.nome}
                    </option>                    
                  )
                })}
              </select>
            )}

            <label>Cursos</label>
            <select value={course} onChange={handleChangeSelect}>
              <option value="nr20">NR20</option>
              <option value="nr30">NR30</option>              
            </select>

            
            <div>
              <label>Data realização curso:</label>
              <input
                type='date' 
                placeholder='Data de realização do curso'
                value={dataCurso} 
                onChange={ (e) => setDataCurso(e.target.value)}
              />

              <label>Data validade curso:</label>
              <input
                type='date' 
                placeholder='Data de validade do curso'
                value={dataValidade} 
                onChange={ (e) => setDataValidade(e.target.value)}
              />              
            </div>
                                  

            <label>Status</label>
            <div className="status">
              <input 
              type="radio"
              name="radio"
              value="Ativo"
              onChange={handleOptionChange}
              checked={ status === 'Ativo' }
              />
              <span>Ativo</span>              

              <input 
              type="radio"
              name="radio"
              value="Inativo"
              onChange={handleOptionChange}
              checked={ status === 'Inativo' }
              />
              <span>Inativo</span>
            </div>

            <label>Complemento</label>
            <textarea
              type="text"
              placeholder="Descreva algum detalhe do curso.(opcional)."
              value={complemento}
              onChange={ (e) => setComplemento(e.target.value) }
            />
            
            <button type="submit">Registrar</button>

          </form>

        </div>

      </div>
    </div>
  )
}