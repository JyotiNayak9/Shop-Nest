import { Spinner } from "flowbite-react"

export const LoadingComponent = ({size='xl'}:{size?: string}) =>{
    return(
        <>
        <Spinner aria-label="loading..." size={size}/>
        </>
    )
}