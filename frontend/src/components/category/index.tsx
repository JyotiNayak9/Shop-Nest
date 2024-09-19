import { Heading3 } from "../../components/common/title";
import { ImageWithTitleCard } from "../common/card/single-card";
export const HomeCategory = () => {
return(
<>
<div className="flex justify-between mx-20 mt-10 border-b border-violet-200  pb-3">
        <Heading3><>Category List</></Heading3>
      <a className="bg-violet-700 w-40 rounded-lg text-white text-center py-2.5 text-[18px]" href="/categories">View more &rarr;</a>
      </div>
      <div className=" grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 mx-20 my-10">
      <ImageWithTitleCard data={{_id:"", title:"Wireless earbuds", slug:"/categories/wireless-earbuds",image:"https://static-01.daraz.com.np/p/21b6e039594300f5d5cfe0e860d168cc.jpg"}}/>
      <ImageWithTitleCard data={{_id:"", title:"Wireless earbuds", slug:"/categories/wireless-earbuds",image:"https://static-01.daraz.com.np/p/21b6e039594300f5d5cfe0e860d168cc.jpg"}}/>
      <ImageWithTitleCard data={{_id:"", title:"Wireless earbuds", slug:"/categories/wireless-earbuds",image:"https://static-01.daraz.com.np/p/21b6e039594300f5d5cfe0e860d168cc.jpg"}}/>
      <ImageWithTitleCard data={{_id:"", title:"Wireless earbuds", slug:"/categories/wireless-earbuds",image:"https://static-01.daraz.com.np/p/21b6e039594300f5d5cfe0e860d168cc.jpg"}}/>
      <ImageWithTitleCard data={{_id:"", title:"Wireless earbuds", slug:"/categories/wireless-earbuds",image:"https://static-01.daraz.com.np/p/21b6e039594300f5d5cfe0e860d168cc.jpg"}}/>
      <ImageWithTitleCard data={{_id:"", title:"Wireless earbuds", slug:"/categories/wireless-earbuds",image:"https://static-01.daraz.com.np/p/21b6e039594300f5d5cfe0e860d168cc.jpg"}}/>
      </div>
      </>
)
}