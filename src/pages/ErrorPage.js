import './ErrorPage.css';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

function ErrorPage(){
    const navigate = useNavigate();
    return(
        <div className='div_errorpage'>
            <h1>404 page</h1>
            <p>Sorry, the page you are looking for is not available. It is either under construction or invalid!</p>
            <Button label={'Homepage'} onClick={()=>navigate('/')}/>
        </div>
    )
}

export default ErrorPage;