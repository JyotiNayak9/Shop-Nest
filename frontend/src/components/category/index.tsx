import { useEffect, useState } from "react";
import {  Heading3 } from "../../components/common/title";
import authSvc from "../../pages/auth/auth.service";
import { ImageWithTitleCard } from "../common/card/single-card";
import { toast } from "react-toastify";
export const HomeCategory = () => {
  const [category, setCategory] = useState<any[]>([]);
  const getCategory = async () => {
    try{
      // setLoading(true)
      const response: any = await authSvc.getRequest("/category/getall" )
      console.log(response)
      setCategory(response.result);
      console.log(category)
      
    }catch(exception){
      toast.error("Error while fetching category list")
      console.log(exception)
    }
    
  }
  useEffect(()=>{
    getCategory()
  },[])

  return (
    <>
      <div className="flex justify-between mx-20 mt-10 border-b border-violet-200 pb-3">
      <Heading3><>Categories List </></Heading3>
        <a
          className="bg-violet-700 w-40 rounded-lg text-white text-center py-2.5 text-[18px]"
          href="/categories"
        >
          View more &rarr;
        </a>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 mx-20 my-10">
        {category.map((item) => (
          <ImageWithTitleCard
            key={item._id}
            data={{
              _id: item._id,
              title: item.title,
              slug: `/categories/${item.slug || item._id}`,
              image: item.image,
            }}
          />
        ))}
      </div>
    </>
  );
}