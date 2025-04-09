import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import './Layout.css';

function Layout(){
    return(
        <div className='div_layout'>
            <NavBar/>
            <div className='layout_mainbody'>
                <Outlet/>
            </div>
        </div>
    )
}

export default Layout;