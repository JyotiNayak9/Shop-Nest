import HomeProducts from "../../components/products";
import Recommendations from "../../components/recommended/recommended";
import { useContext } from "react";
import AuthContext from "../../context/auth.context";
import HeroSection from "../../components/hero";
import CategoriesSlider from "../../components/category/category_slider";
const LandingPage = ()=> {
  const {LoggedInUser} = useContext(AuthContext)
    return(
        <>
    <HeroSection/>
      {/* <HomeCategory/> */}
      <CategoriesSlider/>
      <HomeProducts/>
      {LoggedInUser && LoggedInUser.role === "customer" && (
        <Recommendations/>
      )}
      {/* <ProductList/> */}
    
        </>
    )
}
export default LandingPage;