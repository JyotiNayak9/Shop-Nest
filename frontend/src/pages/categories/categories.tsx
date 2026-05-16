import { useEffect, useState } from "react";
import {  Heading3 } from "../../components/common/title";
import authSvc from "../../pages/auth/auth.service";
import { toast } from "react-toastify";
import { ImageWithTitleCard } from "../../components/common/card/single-card";
export const AllCategory = () => {
  const [category, setCategory] = useState<any[]>([]);
  const getCategory = async () => {
    try{
      // setLoading(true)
      const response: any = await authSvc.getRequest("/categories/all" )
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 lg:px-20 mt-6 lg:mt-10 border-b border-violet-200 pb-3">
      <Heading3><>Categories List </></Heading3>
        <a
          className="bg-violet-700 w-full sm:w-40 rounded-lg text-white text-center py-2.5 text-[16px] sm:text-[18px] mt-2 sm:mt-0"
          href="/categories"
        >
          View more &rarr;
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 px-4 sm:px-6 lg:px-20 my-6 lg:my-10 gap-4">
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
export default AllCategory;