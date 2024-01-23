import React, { useState, useEffect } from 'react'
import { db } from '../../services/firebaseConnection';
import { collection, getDocs, query, orderBy, limit, startAfter} from 'firebase/firestore'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';


import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const listRef = collection(db, 'employees')

const PieChart = () => {
  const [chart, setChart] = useState({})
  const [loading, setLoading] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)
  const [dados, setDados] = useState()
  const [dataChart, setDataChart] = useState([
    ['Ano', 'Qtd.Emp', 'Qtd. Func'],
    ['2012', 8, 120],
    ['2013', 11, 190],
    ['2014', 14, 250],
    ['2015', 16, 280],
    ['2016', 17, 350],
    ['2017', 22, 370],
    ['2018', 24, 390],
    ['2019', 17, 415],
    ['2020', 17, 470],
    ['2021', 17, 520],
    ['2022', 17, 650],
    ['2023', 34, 762]

  ])
  

  useEffect(() => {
    async function loadGraficos(){
      const q = query(listRef, orderBy('created','asc'));

      const querySnapshot = await getDocs(q)
      setDados([])
      
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
          anoCadastro: doc.data().anoCadastro,          
          quantidadeEmpresas: doc.data().quantidadeEmpresas,          
          quantidadeFuncionarios: doc.data().quantidadeFuncionarios,                    
          userId: doc.data().userId           
        })
        
      })         

      setDados(dados => [...dados, ...lista])      

    }else{
      setIsEmpty(true)
    }
    
  }     
   
    console.log("dados", dados);    
    var data = {
    labels: dados?.map(x => x.anoCadastro),
    datasets: [{
      label: 'Quantidade de Funcionários',
      data: dados?.map(x => x.quantidadeEmpresas),
      data: dados?.map(x => x.quantidadeFuncionarios),
      backgroundColor: [
        'RGBA(121,215,252, 1)',
        'RGBA(0,115,143,1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        '#FFD700',
        '#3CB371',
        'rgba(68, 4, 111, 1)',
        'rgba(131, 2, 41, 0.85)',
        'rgba(190, 165, 173, 1)',
        'RGBA(0,135,234,1)'

      ],
      borderColor: [
        'rgba(192, 143, 8, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        '#FFD700',
        '#3CB371',
        'rgba(68, 4, 111, 1)',
        'rgba(131, 2, 41, 0.85)',
        'rgba(190, 165, 173, 1)'
      ],
      borderWidth: 1
    }]
    }

  var options = {
    maintainAspectRatio: false,
    scales: {
    },
    legend: {
      labels: {
        fontSize: 25,
      },
    },
    plugins: {
      subtitle: {
          display: true,
          text: 'Custom Chart Title',
          padding: {
            top: 10,
            bottom: 30
          }
      }
    }  
  }

  return (
    <div>
      <Pie
        title='Quantidade de Funcionarios / ano'
        data={data}
        height={300}
        width={500}
        options={options}

      />
    </div>
  )
}

export default PieChart
