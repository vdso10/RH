
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

import BarChart from '../../components/Charts/BarChart'
import DoughnutChart from '../../components/Charts/DoughnutChart'
import PieChart from '../../components/Charts/PieChart';
import LineChart from '../../components/Charts/LineChart';

const listRef = collection(db, 'employees')

export default function Dashboard(){

  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true) 

  const [isEmpty, setIsEmpty] = useState(false)
  const [lastDocs, setLastDocs] = useState()
  const [loadingMore, setLoadingMore] = useState(false);

  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();

  const [dadosChart, setDadosChart] = useState('')


  useEffect(() => {
    async function loadGraficos(){
      const q = query(listRef, orderBy('created','desc'), limit(5));

      const querySnapshot = await getDocs(q)
      setEmployees([])
      
      await updateState(querySnapshot)

      setLoading(false)

    }

    loadGraficos()

    return() =>{

    }

  }, [])

  async function updateState(querySnapshot){
    const isCollectionEmpty = querySnapshot.size === 0;
    
    if(!isCollectionEmpty){
      let lista = []

      querySnapshot.forEach((doc) => {
        lista.push({    
          id: doc.id,                             
          createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),          
          anoCadastro: doc.data().anoCadastro,          
          quantidadeEmpresas: doc.data().quantidadeEmpresas,          
          quantidadeFuncionarios: doc.data().quantidadeFuncionarios,                    
          userId: doc.data().userId           
        })
        
      })

      
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] // Pegando o ultimo item

      setEmployees(employees => [...employees, ...lista])
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
          <Title name="Dashboard Empresas X Funcionários">
            <FiMessageSquare size={25} />
          </Title>

          <div className='container dashboard'>
            <span>Buscando informações...</span>                               
          </div>
        </div>
      </div>
    )
  }

  
  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Dashboard Empresas X Funcionários">
          <FiMessageSquare size={25} />
        </Title>
          <>                    

            {employees.length === 0 ? (
              <div className='container dashboard'>
                <span>Nenhuma informação foi encontrada...</span>
                <Link to="/new" className="new">
                <FiPlus size={25} color="#FFF" />
                  Novo cadastro
                </Link>
              </div>
            ):(
              <>
                
                <div className="cardBox">
                  <div className="card">
                      <div>
                        <div className="numbers">38</div>
                        <div className="cardName">Total de Empresas</div>
                      </div>                     
                  </div>
                  <div className="card">
                      <div>
                          <div className="numbers">724</div>
                          <div className="cardName">Total de Funcionários</div>
                      </div>                      
                  </div>
                  
                </div> 

                <div className='graficos container '>
                  
                  <DoughnutChart />
                  <PieChart />
                  <LineChart />
                  <div style={{marginTop: '20px'}}><BarChart titulo='quantidade'/></div>
                  
                  
                  
                </div>  

                <Link to="/employee" className="new">
                  <FiPlus size={25} color="#FFF" />
                  Novo cadastro
                </Link>

                <table>
                  <thead>
                    <tr>
                      <th scope="col">Ano Cadastrado</th>
                      <th scope="col">Quantidade Empresas</th>
                      <th scope="col">Quantidade Funcionários</th>                                    
                      
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((item, index) => {                      
                      return(
                        <tr key={index}>
                          <td data-label="Motorista">{item.anoCadastro}</td>
                          <td data-label="Assunto">{item.quantidadeEmpresas}</td>
                          <td data-label="Data-Inicio">{item.quantidadeFuncionarios}</td>                                                                           
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