import { BannerComponent } from "../../components/banner";
import { HomeCategory } from "../../components/category";
import HomeProducts from "../../components/products";

const LandingPage = ()=> {
    return(
        <>
      <BannerComponent/>
      <HomeCategory/>
      <HomeProducts/>
        </>
    )
}
export default LandingPage;