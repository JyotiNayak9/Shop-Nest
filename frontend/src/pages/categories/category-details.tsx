import { useParams, useSearchParams } from "react-router-dom";
import { Heading3 } from "../../components/common/title"
import { useEffect } from "react";



const CategoryDetailsPage = () => {
    const params = useParams();
    const [query, setQuery] = useSearchParams({});

    useEffect(() => {
        setTimeout(() => {
            setQuery("page=1&title=test")
        },5000)
    },[])
    console.log(query.get("title"))
    return(
        <>
        <div className="h-96">
           Category Details of {params.slug}
      
        </div>
        </>
    )
}

export default CategoryDetailsPage;