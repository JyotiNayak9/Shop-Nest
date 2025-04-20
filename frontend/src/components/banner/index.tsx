import { useEffect, useState } from "react"
import SliderComponent from "../common/slider"
import SingleSlider from "../common/slider/__contracts/slider.contracts"
// import { Banner } from "flowbite-react"
import banner1 from "../../assets/images/banner1.png";

export const BannerComponent = () =>{

    const [bannerData, setBannerData] = useState([] as Array<SingleSlider>)
    const getAllBanner = () => {

        const response: Array<SingleSlider> = [
            {
            _id: "",
            title:"Banner Image",
            image: {banner1},
            link:"/",
        },
         {
            _id: "",
            title:"Banner Image",
            image: {banner1},
            link:"/",
        },
        // {
        //     _id: "",
        //     title:"Banner Image",
        //     image: "https://icms-image.slatic.net/images/ims-web/7a9f9cb2-0a0d-459e-abf7-911a129a5f64.jpg",
        //     link:"",
        // },
    ]
    setBannerData(response)
    }
    useEffect(()=>{
      getAllBanner()
    }, [])
    return (
        <>       
    <div className="h-60 sm:h-64 xl:h-96 2xl:h-[600px] my-0">
      <SliderComponent data = {bannerData}/>
    </div>
        </>
    )
}