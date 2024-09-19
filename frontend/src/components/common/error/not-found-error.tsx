import { NavLink } from "react-router-dom";

const NotFoundError = ({url, label}:{url: string, label: string}) => {
    return(
        <>
        <section className="bg-white dark:bg-gray-900">
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-red-700 dark:text-red-500">404</h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something's missing.</p>
            <p className="mb-4 text-lg font-normal text-gray-500 dark:text-gray-400">Sorry, we can't find that page. </p>
            <NavLink to={url} className="inline-flex text-white bg-violet-600 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-violet-900 my-4">
                {label}
                </NavLink>
        </div>   
    </div>
</section>
        </>
    )
}

export default NotFoundError;