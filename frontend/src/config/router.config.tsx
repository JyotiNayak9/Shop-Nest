import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "../pages/landing";
import RegisterPage from "../pages/auth/register/register.page";
import AboutPage from "../pages/about/about-page";
import CategoryPage from "../pages/categories/categories";
import ProductsPage from "../pages/allproducts/all-products";
import ContactPage from "../pages/contact/contact-page";
import CategoryDetailsPage from "../pages/categories/category-details";
import ProduuctDetailsPage from "../pages/allproducts/product-details";
import HomepageLayout from "../pages/layout/home.page";
import Adminlayout from "../pages/layout/cms.page";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css"
import UserActivation from "../pages/auth/activation/activate-user.page";
import { useEffect, useState } from "react";
import AuthContext from "../context/auth.context";
import authSvc from "../pages/auth/auth.service";
import LoginPage from "../pages/auth/login/login-page";
import AdminDashboard from "../pages/dashboard/admin-dashboard.page";
import CheckPermission from "./rbac.config";
import { UserRoles } from "./constants";
import NotFoundError from "../components/common/error/not-found-error";
import BannerListingPage from "../pages/banner/banner-list-page";
import CreateBanner from "../pages/banner/banner-create-page";

const RouterConfig = () => {
    const [LoggedInUser, setLoggedInUser] = useState();
    const [loading, setLoading] = useState(true)
    const getLoggedInUser = async() => {
        try {
const response: any = await authSvc.getRequest("/auth/me", {auth:true})
console.log(response)
setLoggedInUser(response.result);
        }catch(exception) {
           console.log(exception) 
        } finally {
        setLoading(false)
    }
}
    useEffect(() => {
        getLoggedInUser();
    },[])



    return (
        <>
        {loading? <>loading .... </> : <> 
            <AuthContext.Provider value = {{LoggedInUser, setLoggedInUser}}>
        <ToastContainer/>
        <BrowserRouter>
            <Routes>
                <Route path="/" element = {<HomepageLayout/>}>
                <Route index element={<LandingPage/>}/>
                <Route path="register" element={<RegisterPage/>}/>
                <Route path="activate/:token" element={<UserActivation/>}/>
                <Route path="login" element={<LoginPage/>}/>
                <Route path="about" element={<AboutPage/>}/>
                <Route path="categories" element={<CategoryPage/>}/>
                <Route path="products" element={<ProductsPage/>}/>
                <Route path="contact" element={<ContactPage/>}/>
                <Route path="categories/:slug" element={<CategoryDetailsPage/>}/>
                <Route path="products/:slug" element={<ProduuctDetailsPage/>}/>
                <Route path="*" element  = {<NotFoundError url="/" label="Go to Homeage"/>}/>
                </Route>

                <Route path="/admin" element={<CheckPermission allowedBy={UserRoles.ADMIN}>
                    <Adminlayout/>
                    </CheckPermission>}>
                <Route index element={<AdminDashboard/>}/>
                <Route path="banner" element = {<BannerListingPage/>}/>
                <Route path="banner/create" element = {<CreateBanner/>}/>
                <Route path="*" element  = {<NotFoundError url="/admin" label="Go to Dashboard"/>}/>


                </Route>

                <Route path="/seller" element={<CheckPermission allowedBy={UserRoles.SELLER}>
                <Adminlayout/>
                    
                </CheckPermission>}>
                <Route  element={<AboutPage/>}></Route>
                
                </Route>
            </Routes>
        </BrowserRouter>
        </AuthContext.Provider>
        </>
        }
        
        </>
    ) 
}

export default RouterConfig;