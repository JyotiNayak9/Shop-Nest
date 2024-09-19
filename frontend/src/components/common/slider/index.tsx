import { Carousel } from "flowbite-react";
import SingleSlider from "./__contracts/slider.contracts";

const SliderComponent = ({data}: {data: Array<SingleSlider>}) => {
    return(
        <>
        <Carousel slideInterval={5000}>
        {
            data && data.map((row: SingleSlider, i: number) => (
                row.link? <a key = {i} href={row.link}><img key = {i} src ={row.image} alt = {row.title}/>
                </a> : <img key = {i} src ={row.image} alt = {row.title}/>
            ))
        }
      </Carousel>
        </>
    )
}

export default SliderComponent