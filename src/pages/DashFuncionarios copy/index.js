
import './dashboard.css';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { db } from '../../services/firebaseConnection';
import { collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,  
  sum,
  getAggregateFromServer,
  getCountFromServer,
  where
} from 'firebase/firestore'

import Header from '../../components/Header';
import Title from '../../components/Title';
import Modal from '../../components/Modal';
import {format, differenceInDays} from 'date-fns'

import { Link } from 'react-router-dom';

import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';

import { Chart } from "react-google-charts";

const listRef = collection(db, 'employees')

export default function Dashboard(){

  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true) 

  const [isEmpty, setIsEmpty] = useState(false)
  const [lastDocs, setLastDocs] = useState()
  const [loadingMore, setLoadingMore] = useState(false);

  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();

  const titulo = 'Quantidade de Funcionarios X Empresas'
  const [dados, setDados] = useState([
    ['Ano', 'Qtd.Emp', 'Qtd. Func'],
    ['2012', 8, 120],
    ['2013', 11, 190],
    ['2014', 14, 250],
    ['2015', 16, 280],
    ['2016', 17, 350]

  ])
     
  
  useEffect(() => {
    async function loadGraficos(){          
      
      const q = query(listRef, orderBy('created','desc'), limit(5));

      const querySnapshot = await getDocs(q)
      setEmployees([])
      
      await updateState(querySnapshot)

      setLoading(false)

    }

    loadGraficos()

    return() =>{ }

  }, [])

  async function updateState(querySnapshot){
    const isCollectionEmpty = querySnapshot.size === 0; 
          

    if(!isCollectionEmpty){
      let lista = []

      await querySnapshot.forEach((doc) => {
        lista.push({    
          id: doc.id,
          
          companies: doc.data().companies,          
          companiesId: doc.data().companies,          
          complemento: doc.data().complemento,           
          created: doc.data().created,
          createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),          
          dataCadastro: doc.data().dataCadastro,
          dataCadastroFormat: format(new Date(doc.data().dataCadastro) , 'dd/MM/yyyy'),         
          quantidade: doc.data().quantidade,          
          status: doc.data().status,
          userId: doc.data().userId                                        
        })
        
      })      
      
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] // Pegando o ultimo item

      const totalEmpresas = await getCountFromServer(listRef);
      console.log('count: ', totalEmpresas.data().count);
      

     /*  const q = query(listRef, where("dataCadastro", "==", "2012"));
      const snapshot = await getCountFromServer(q);
      console.log('count: ', snapshot.data().count) */

      const totalFuncionarios = await getAggregateFromServer(listRef, {
        totalFunc: sum('quantidade')
      });
      
      console.log('totalFunc: ', totalFuncionarios.data().totalFunc);

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
          <Title name="Total Funcionários">
            <FiMessageSquare size={25} />
          </Title>

          <div className='container dashboard'>
            <span>Buscando Cadastros...</span>                               
          </div>
        </div>
      </div>
    )
  }

  
  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Total Funcionários">
          <FiMessageSquare size={25} />
        </Title>
          <>                    

            {employees.length === 0 ? (
              <div className='container dashboard'>
                <span>Nenhum dado encontrado...</span>
                <Link to="/new" className="new">
                <FiPlus size={25} color="#FFF" />
                  Novo Cadastro
                </Link>
              </div>
            ):(
              <>

                <div className="cardBox">
                  <div className="card">
                      <div>
                        <div className="numbers">154</div>
                        <div className="cardName">Total Empresas</div>
                      </div>

                      <div className="iconBx">
                        <ion-icon name="eye-outline"></ion-icon>
                      </div>
                  </div>
                  <div className="card">
                      <div>
                          <div className="numbers">35</div>
                          <div className="cardName">Empresa maior nº funcionarios</div>
                      </div>

                      <div className="iconBx">
                          <ion-icon name="eye-outline"></ion-icon>
                      </div>
                  </div>
                  <div className="card">
                      <div>
                          <div className="numbers">12</div>
                          <div className="cardName">Empresa menor nº funcionarios</div>
                      </div>

                      <div className="iconBx">
                          <ion-icon name="eye-outline"></ion-icon>
                      </div>
                  </div>
                </div> 

                <div className='graficos container '>                  
                  <Chart
                    chartType="PieChart"
                    data={dados}
                    width="540px"
                    height="300px"
                    options={{
                      title: titulo,
                      is3D: true
                    }}
                  />
                  <Chart
                    chartType="PieChart"
                    data={dados}
                    width="540px"
                    height="300px"
                    options={{
                      title: titulo,
                      pieHole: 0.4
                    }}
                  />
                  <Chart
                    chartType="BarChart"
                    data={dados}
                    width="540px"
                    height="300px"
                    options={{
                      title: titulo,
                      chartArea: {width: '50%'},                        
                      hAxis: {title: 'quantidade'},
                      vAxis: {title: 'ano'},
                      animation: {duration: 1000, easing: 'out', startup: true }                        
                    }}
                  />
                  <Chart
                    chartType="AreaChart"
                    data={dados}
                    width="800px"
                    height="300px"
                    options={{
                      title: titulo,                        
                      hAxis: {title: 'ano'},
                      vAxis: {title: 'quantidade'},
                      animation: {duration: 1000, easing: 'out', startup: true }                        
                    }}
                    />
                    
                    <Chart
                    chartType="ColumnChart"
                    data={dados}
                    width='800px'
                    height="300px"
                    options={{
                      title: titulo,                        
                      hAxis: {title: 'ano'},
                      vAxis: {title: 'quantidade'},
                      animation: {duration: 1000, easing: 'out', startup: true }                        
                    }}
                    />
                </div>               

                <table>
                  <thead>
                    <tr>
                      <th scope="col">Ano Cadastro</th>
                      <th scope="col">Cursos</th>
                      <th scope="col">Feito em</th>
                      <th scope="col">Valido até</th>
                      <th scope="col">Dias Restantes</th>
                      <th scope="col">Status</th>                      
                      <th scope="col">#</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((item, index) => {
                      
                      return(
                        <tr key={index}>
                          <td data-label="Motorista">{item.dataCadastro}</td>
                          <td data-label="Assunto">{item.companies}</td>
                          <td data-label="Data-Inicio">{item.quantidade}</td>
                          <td data-label="Data-Final">{item.status}</td>
                          <td data-label="Dias-Restantes">teste</td>                          
                          
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
              
                {loadingMore && <h3>Buscando mais dados...</h3>}    
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