import { Outlet } from "react-router-dom";
import HomeFooter from "../../components/common/footer/footer-page"
import { HomeHeader } from "../../components/common/header"

const HomepageLayout =()=> {
    return( 
        <>
        <HomeHeader/>
        <Outlet/>

        <HomeFooter/>
        </>
    )
}

export default HomepageLayout;