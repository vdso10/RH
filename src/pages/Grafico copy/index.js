import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { db } from '../../services/firebaseConnection';
import { collection, getDocs, query, orderBy, limit, startAfter} from 'firebase/firestore'
import './grafico.css'
import Header from '../../components/Header';
import Title from '../../components/Title';
import Modal from '../../components/Modal';
import {format, differenceInDays} from 'date-fns'

import { Link } from 'react-router-dom';

import { FiMessageSquare, FiPlus, FiSearch, FiEdit2, FiMonitor } from 'react-icons/fi';

import { Chart } from "react-google-charts";


const listRef = collection(db, 'employees')


export default function Grafico(){
    
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true) 

  const [isEmpty, setIsEmpty] = useState(false)
  const [lastDocs, setLastDocs] = useState()
  const [loadingMore, setLoadingMore] = useState(false);

  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();

  const titulo = 'Quantidade de Funcionarios X Empresas'
  const [dados, setDados] = useState([
    ['Ano', 'Qtd. Emp', 'Qtd. Func'],
    ['2012', 8, 120],
    ['2013', 11, 190],
    ['2014', 14, 250],
    ['2015', 16, 280],
    ['2016', 17, 350]

  ])


  useEffect(() => {
    async function loadEmployees(){
      const q = query(listRef, orderBy('created','desc'), limit(5));

      const querySnapshot = await getDocs(q)
      setEmployees([])
      
      await updateState(querySnapshot)

      setLoading(false)

    }

    loadEmployees()

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
          complemento: doc.data().complemento,    
          employees: doc.data().employees ,
          created: doc.data().created,
          createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
          quantidade: doc.data().quantidade,
          dataCadastro: doc.data().dataCadastro,
          dataCadastroFormat: format(new Date(doc.data().dataCadastro) , 'dd/MM/yyyy'),         
          companies: doc.data().companies,
          companiesId: doc.data().companiesId,
          status: doc.data().status,          
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
          <Title name="Cadastros">
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
    <>
      <Header/>                     
      <div className='main'>
          
        <Title name='Dashboard'>
            <FiMonitor size={25} />
        </Title>

        {employees.length === 0 ? (
        <div className='container dashboard'>
          <span>Nenhuma empresa encontrada...</span>
          <Link to="/employee" className="new">
          <FiPlus size={25} color="#FFF" />
            Nova empresa
          </Link>
        </div>
        ):(
          <>

            <Link to="/employee" className="new">
              <FiPlus size={25} color="#FFF" />
                Nova Empresa
            </Link>
                                     
                <div className="cardBox">
                  <div class="card">
                      <div>
                          <div class="numbers">45</div>
                          <div class="cardName">Total Empresas</div>
                      </div>

                      <div class="iconBx">
                          <ion-icon name="eye-outline"></ion-icon>
                      </div>
                  </div>
                  <div class="card">
                      <div>
                          <div class="numbers">35</div>
                          <div class="cardName">Empresa maior nº funcionarios</div>
                      </div>

                      <div class="iconBx">
                          <ion-icon name="eye-outline"></ion-icon>
                      </div>
                  </div>
                  <div class="card">
                      <div>
                          <div className="numbers">12</div>
                          <div className="cardName">Empresa menor nº funcionarios</div>
                      </div>

                      <div className="iconBx">
                          <ion-icon name="eye-outline"></ion-icon>
                      </div>
                  </div>
                </div>  
              
            <div className="details">
              <div className="recentOrders">
                <div style={{backgroundColor: 'red', float: 'left'}}>
                  <Chart
                    chartType="Bar"
                    data={dados}
                    width="300px"
                    height="300px"
                    options={{
                      title: titulo
                    }}
                  />
                  <Chart
                    chartType="Bar"
                    data={dados}
                    width="300px"
                    height="300px"
                    options={{
                      title: titulo
                    }}
                  />
                </div>            
                
              </div>                              
            
            </div>
            

          </>
        )}
            

        

 
      </div>                
    </>
  )

}
