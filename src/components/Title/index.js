import './title.css'
import Header from '../../components/Header'


export default function Title({children, name}) {
    return(
        <>
            <div className='title'>
                {children}
                
                <span>{name}</span>
            </div>

        </>
    )
}