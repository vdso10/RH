
import './dashboard.css';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { db } from '../../services/firebaseConnection';
import { collection, getDocs, query, orderBy, limit, startAfter} from 'firebase/firestore'

import Header from '../../components/Header';
import Title from '../../components/Title';
import Modal from '../../components/Modal';
import {format, differenceInDays} from 'date-fns'

import { Link } from 'react-router-dom';

import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';

const listRef = collection(db, 'cursos')

export default function Dashboard(){

  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true) 

  const [isEmpty, setIsEmpty] = useState(false)
  const [lastDocs, setLastDocs] = useState()
  const [loadingMore, setLoadingMore] = useState(false);

  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();


  useEffect(() => {
    async function loadCursos(){
      const q = query(listRef, orderBy('created','desc'), limit(5));

      const querySnapshot = await getDocs(q)
      setCursos([])
      
      await updateState(querySnapshot)

      setLoading(false)

    }

    loadCursos()

    return() =>{

    }

  }, [])

  async function updateState(querySnapshot){
    const isCollectionEmpty = querySnapshot.size === 0;
    
    let dataAtual = format(new Date(), 'dd/MM/yyyy');
    
    console.log(dataAtual)

    if(!isCollectionEmpty){
      let lista = []

      querySnapshot.forEach((doc) => {
        lista.push({    
          id: doc.id,  
          complemento: doc.data().complemento,    
          course: doc.data().course,
          created: doc.data().created,
          createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
          dataCurso: doc.data().dataCurso,
          dataCursoFormat: format(new Date(doc.data().dataCurso) , 'dd/MM/yyyy'),
          dataValidade: doc.data().dataValidade,
          dataValidadeFormat: format(new Date(doc.data().dataValidade) , 'dd/MM/yyyy'),
          diferencaDias: differenceInDays((doc.data().dataValidade),(doc.data().dataCurso)),          
          driver: doc.data().driver,
          driverId: doc.data().driverId,
          status: doc.data().status,          
          userId: doc.data().userId            
        })
        
      })      

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] // Pegando o ultimo item

      setCursos(cursos => [...cursos, ...lista])
      setLastDocs(lastDoc);

    }else{
      setIsEmpty(true)
    }

    setLoadingMore(false)
  }

  async function handleMore(){
    setLoadingMore(true);

    const q = query(listRef, orderBy('created', 'desc'), startAfter(lastDocs),  limit(5));
    const querySnapshot = await getDocs(q);
    await updateState(querySnapshot);
  }

  function toggleModal(item){
    setShowPostModal(!showPostModal)
    setDetail(item)

  }
  

  if(loading){
    return(
      <div>
        <Header/>

        <div className='content'>
          <Title name="Cursos">
            <FiMessageSquare size={25} />
          </Title>

          <div className='container dashboard'>
            <span>Buscando cursos...</span>                               
          </div>
        </div>
      </div>
    )
  }

  
  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Cursos">
          <FiMessageSquare size={25} />
        </Title>
          <>                    

            {cursos.length === 0 ? (
              <div className='container dashboard'>
                <span>Nenhum curso encontrado...</span>
                <Link to="/new" className="new">
                <FiPlus size={25} color="#FFF" />
                  Novo curso
                </Link>
              </div>
            ):(
              <>
                <Link to="/course" className="new">
                  <FiPlus size={25} color="#FFF" />
                  Novo curso
                </Link>

                <table>
                  <thead>
                    <tr>
                      <th scope="col">Motorista</th>
                      <th scope="col">Cursos</th>
                      <th scope="col">Feito em</th>
                      <th scope="col">Valido até</th>
                      <th scope="col">Dias Restantes</th>
                      <th scope="col">Status</th>                      
                      <th scope="col">#</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cursos.map((item, index) => {                      
                      return(
                        <tr key={index}>
                          <td data-label="Motorista">{item.driver}</td>
                          <td data-label="Assunto">{item.course}</td>
                          <td data-label="Data-Inicio">{item.dataCursoFormat}</td>
                          <td data-label="Data-Final">{item.dataValidadeFormat}</td>
                          <td data-label="Dias-Restantes">{item.diferencaDias}</td>                          
                          
                          <td data-label="Status">
                          {item.diferencaDias >= 0 ? (
                              <span className="badge" style={{ backgroundColor: '#5cb85c'} }>{item.status}</span>                            
                            ):(
                              <span className="badge" style={{ backgroundColor: '#999'}}>{item.status}</span>
                            )
                          }                           
                            
                          </td>                      
                          <td data-label="#">
                            <button className="action" style={{backgroundColor: '#3583f6' }} onClick={() => toggleModal(item)}>
                                <FiSearch color="#FFF" size={17} />
                            </button>
                            <Link to={`/course/${item.id}`} className="action" style={{backgroundColor: '#F6a935' }}>
                                <FiEdit2 color="#FFF" size={17} />
                            </Link>
                          </td>
                        </tr>
                      )  

                    })}
                  </tbody>
                </table>
              
                {loadingMore && <h3>Buscando mais chamados...</h3>}    
                {!loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar mais</button>  }  

              </>
            )}            
                         
          </>
      </div>

      {showPostModal && (
        <Modal
          conteudo={detail}
          close={() => setShowPostModal(!showPostModal)}
        />    
      )}
      
    </div>
  )
}