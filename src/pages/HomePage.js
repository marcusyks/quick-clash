import './HomePage.css';
import Button from '../components/Button'
import { sendRoomMessage } from '../lib/socket';

function HomePage() {
  return (
    <div className='div_homepage_1'>
        <h1>Welcome Quick Clash!</h1>
        <Button label="Solo" onClick={() => sendRoomMessage('startSoloRoom')}/>
        <Button label="VS" onClick={() => console.log('VS mode clicked!')}/>
    </div>
  );
}

export default HomePage;