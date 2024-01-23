import React, { useState, useEffect } from 'react'
import { db } from '../../services/firebaseConnection';
import { collection, getDocs, query, orderBy, limit, startAfter} from 'firebase/firestore'
import {
  Chart as ChartJS,

  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,

} from 'chart.js';

import { Line } from 'react-chartjs-2';

const listRef = collection(db, 'employees')

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
);


const LineChart = () => {
  
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
      tension: 0.2,
      label: 'Quantidade de Funcionários',
      data: dados?.map(x => x.quantidadeEmpresas),
      data: dados?.map(x => x.quantidadeFuncionarios),
      backgroundColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(75,192,192, 1)',
        'rgba(98, 122, 7, 1)',
        'rgba(25, 99, 71, 1)',
        'rgba(90, 43, 50, 0.8)',
        'rgba(26, 6, 100, 1)',
        'rgba(125, 63, 4, 0.67)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 3
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
      
      <Line
        data={data}
        height={300}
        width={500}
        options={options}

      />
      
    </div>
  )
}

export default LineChart
