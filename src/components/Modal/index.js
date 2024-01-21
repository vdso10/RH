
import './modal.css';

import { FiX } from 'react-icons/fi';


export default function Modal({conteudo, close}){
  return(
    <div className="modal">
      <div className="container">
        <button className="close" onClick={ close }>
          <FiX size={23} color="#FFF" />
          Voltar
        </button>

        <main>
          <h2>Detalhes do curso</h2>

          <div className="row">
            <span>
              Motorista: <i>{conteudo.driver}</i>
            </span>
          </div>

          <div className="row">
            <span>
              Curso: <i>{conteudo.course}</i>
            </span>
            <span>
              Finalizado: <i>{conteudo.dataCursoFormat}</i>
            </span>
            <span>
              Validade: <i>{conteudo.dataValidadeFormat}</i>
            </span>
          </div>

          <div className="row">
            <span>
              Dias restantes para o vencimento: <i>{conteudo.diferencaDias}</i>
            </span>
          </div>
          
          <div className="row">
            <span>
              Status: <i style={{ backgroundColor: conteudo.status === 'Ativo' ? '#5cb85c' : '#999' }}>{conteudo.status}</i>
            </span>
          </div>

          {conteudo.complemento !== '' && (
            <>
              <h3>Complemento</h3>
              <p>
                {conteudo.complemento}
              </p>
            </>
          )}

        </main>
      </div>
    </div>
  )
}