import './Button.css';

function Button ({label, onClick}) {
    return(
        <button className='btn' onClick={onClick}>
            <p>{label}</p>
        </button>
    )
}

export default Button;