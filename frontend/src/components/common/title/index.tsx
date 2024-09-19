import {  ReactElement, useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa"
import { NavLink } from "react-router-dom"


export const Heading2 = (props:{value:string}) => {
    return(
        <>
        <h1>
            {props.value}
            </h1></>
    )
}

export const Heading3  = ({children}:{children: ReactElement}) => {
    
    return(
        <>
        <h3 className="font-bold text-gray-700 hover:text-gray-700 hover-cursor-pointer text-[20px] md:text-[28px] lg:text-[30px] xl:text-[32px] 2xl:text-[34px] py-2 ">
            {children}
            <hr />
        </h3>
        </>
    )
}

export const HeadingWithLink = ({title, link, btnText }: {title: string, link : string, btnText: string}) => {
    return (
        <>
        <div className="flex justify-between my-5">
            <Heading3><>{title}</></Heading3>
            <NavLink to={link} className={"bg-violet-600 text-white p-3.5 rounded-lg mt-2 text-center flex "}> 
               <FaPlus className="me-3 h-5 pt-1 "/> {btnText}
            </NavLink>
        </div>
        </>
    )
}


