import { BannerComponent } from "../../components/banner";
import { HomeCategory } from "../../components/category";
import HomeProducts from "../../components/products";
import banner2 from "../../assets/images/banner2.png";
const LandingPage = ()=> {
    return(
        <>
      <img src={banner2} alt="banner" className="w-full h-60 sm:h-64 xl:h-[500px]  my-0"/>
      <HomeCategory/>
      <HomeProducts/>
        </>
    )
}
export default LandingPage;