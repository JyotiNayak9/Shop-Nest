import { Heading3 } from "../common/title";
import { SingleProductCard } from "../common/card/single-card";
const HomeProducts = () => {
    return(
        <>
        <div className="flex justify-between mx-20 mt-10 border-b border-violet-200  pb-3">
        <Heading3><>Products </></Heading3>
      <a className="bg-violet-700 w-50 rounded-lg text-white text-center py-2.5 px-2 text-[18px]" href="/products">View all products &rarr;</a>
      </div>
      <div className=" grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mx-20 my-10">
  
   <SingleProductCard data={{_id:"", title:"Gaming Mouse", slug:"/products/gaming-mouse", image:"https://static-01.daraz.com.np/p/abb97310e8cd81c2db73505bb3c56ceb.jpg_400x400q75-product.jpg_.webp"}} />
   <SingleProductCard data={{_id:"", title:"Gaming Mouse", slug:"/products/gaming-mouse", image:"https://static-01.daraz.com.np/p/abb97310e8cd81c2db73505bb3c56ceb.jpg_400x400q75-product.jpg_.webp"}} />
   <SingleProductCard data={{_id:"", title:"Gaming Mouse", slug:"/products/gaming-mouse", image:"https://static-01.daraz.com.np/p/abb97310e8cd81c2db73505bb3c56ceb.jpg_400x400q75-product.jpg_.webp"}} />
   <SingleProductCard data={{_id:"", title:"Gaming Mouse", slug:"/products/gaming-mouse", image:"https://static-01.daraz.com.np/p/abb97310e8cd81c2db73505bb3c56ceb.jpg_400x400q75-product.jpg_.webp"}} />
   <SingleProductCard data={{_id:"", title:"Gaming Mouse", slug:"/products/gaming-mouse", image:"https://static-01.daraz.com.np/p/abb97310e8cd81c2db73505bb3c56ceb.jpg_400x400q75-product.jpg_.webp"}} />
   <SingleProductCard data={{_id:"", title:"Gaming Mouse", slug:"/products/gaming-mouse", image:"https://static-01.daraz.com.np/p/abb97310e8cd81c2db73505bb3c56ceb.jpg_400x400q75-product.jpg_.webp"}} />
   <SingleProductCard data={{_id:"", title:"Gaming Mouse", slug:"/products/gaming-mouse", image:"https://static-01.daraz.com.np/p/abb97310e8cd81c2db73505bb3c56ceb.jpg_400x400q75-product.jpg_.webp"}} />
   <SingleProductCard data={{_id:"", title:"Gaming Mouse", slug:"/products/gaming-mouse", image:"https://static-01.daraz.com.np/p/abb97310e8cd81c2db73505bb3c56ceb.jpg_400x400q75-product.jpg_.webp"}} />
   <SingleProductCard data={{_id:"", title:"Gaming Mouse", slug:"/products/gaming-mouse", image:"https://static-01.daraz.com.np/p/abb97310e8cd81c2db73505bb3c56ceb.jpg_400x400q75-product.jpg_.webp"}} />
   <SingleProductCard data={{_id:"", title:"Gaming Mouse", slug:"/products/gaming-mouse", image:"https://static-01.daraz.com.np/p/abb97310e8cd81c2db73505bb3c56ceb.jpg_400x400q75-product.jpg_.webp"}} />
   <SingleProductCard data={{_id:"", title:"Gaming Mouse", slug:"/products/gaming-mouse", image:"https://static-01.daraz.com.np/p/abb97310e8cd81c2db73505bb3c56ceb.jpg_400x400q75-product.jpg_.webp"}} />
   <SingleProductCard data={{_id:"", title:"Gaming Mouse", slug:"/products/gaming-mouse", image:"https://static-01.daraz.com.np/p/abb97310e8cd81c2db73505bb3c56ceb.jpg_400x400q75-product.jpg_.webp"}} />
   <SingleProductCard data={{_id:"", title:"Gaming Mouse", slug:"/products/gaming-mouse", image:"https://static-01.daraz.com.np/p/abb97310e8cd81c2db73505bb3c56ceb.jpg_400x400q75-product.jpg_.webp"}} />
   <SingleProductCard data={{_id:"", title:"Gaming Mouse", slug:"/products/gaming-mouse", image:"https://static-01.daraz.com.np/p/abb97310e8cd81c2db73505bb3c56ceb.jpg_400x400q75-product.jpg_.webp"}} />
   <SingleProductCard data={{_id:"", title:"Gaming Mouse", slug:"/products/gaming-mouse", image:"https://static-01.daraz.com.np/p/abb97310e8cd81c2db73505bb3c56ceb.jpg_400x400q75-product.jpg_.webp"}} />
   <SingleProductCard data={{_id:"", title:"Gaming Mouse", slug:"/products/gaming-mouse", image:"https://static-01.daraz.com.np/p/abb97310e8cd81c2db73505bb3c56ceb.jpg_400x400q75-product.jpg_.webp"}} />
   <SingleProductCard data={{_id:"", title:"Gaming Mouse", slug:"/products/gaming-mouse", image:"https://static-01.daraz.com.np/p/abb97310e8cd81c2db73505bb3c56ceb.jpg_400x400q75-product.jpg_.webp"}} />
   <SingleProductCard data={{_id:"", title:"Gaming Mouse", slug:"/products/gaming-mouse", image:"https://static-01.daraz.com.np/p/abb97310e8cd81c2db73505bb3c56ceb.jpg_400x400q75-product.jpg_.webp"}} />

    </div>
        </>
    )
}
export default HomeProducts;