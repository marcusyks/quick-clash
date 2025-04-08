import './HomePage.css';
import Button from '../components/Button'

function HomePage() {
  return (
    <div className='div_homepage_1'>
        <h1>Welcome Quick Clash!</h1>
        <Button label="Solo" onClick={() => console.log('Solo mode clicked!')}/>
        <Button label="VS" onClick={() => console.log('VS mode clicked!')}/>
    </div>
  );
}

export default HomePage;