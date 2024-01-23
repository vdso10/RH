import React, { useState, useEffect } from 'react'
import { db } from '../../services/firebaseConnection';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { collection, getDocs, query, orderBy, limit, startAfter} from 'firebase/firestore'


import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const listRef = collection(db, 'employees')

const DoughnutChart = () => {
  const [loading, setLoading] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)
  const [dados, setDados] = useState()
 

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
      label: 'Quantidade de Empresas',
      data: dados?.map(x => x.quantidadeEmpresas),    
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
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
        
  }

  return (
    <div>
      <Doughnut
        data={data}
        height={400}
        width={500}
        options={options}

      />
    </div>
  )
}

export default DoughnutChart
