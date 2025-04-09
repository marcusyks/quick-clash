import './NavBar.css';

function NavBar(){
    return(
        <div className='div_navbar'>
            <a className='a_navbar_1' href='https://github.com/marcusyks/quick-clash' target='_blank' rel='noopener noreferrer'>
                <span>Check out the github repository!</span>
                <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="github" className='img_github'/>
            </a>
        </div>
    )
}

export default NavBar;