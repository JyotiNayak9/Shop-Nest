import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "../pages/landing";
import AboutPage from "../pages/about/about-page";
import CategoryPage, { AllCategory } from "../pages/categories/categories";
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
import RegisterPage from "../pages/auth/register/register.page";
import Logout from "../pages/auth/logout";
import ResetPassword from "../pages/auth/forget-password";
import CategoryListingPage from "../pages/Cms/category/category-list-page";
import CreateCategory from "../pages/Cms/category/category-create-page";
import EditCategory from "../pages/Cms/category/category-edit-page";
import BrandListingPage from "../pages/Cms/brand/brand-list-page";
import CreateBrand from "../pages/Cms/brand/brand-create-page";
import EditBrand from "../pages/Cms/brand/brand-edit-page";
import ProductListingPage from "../pages/Cms/product/product-list-page";
import CreateProduct from "../pages/Cms/product/product-create-page";
import EditProduct from "../pages/Cms/product/product-edit-page";
import ProductDetailPage from "../pages/allproducts/product-details";
// import ForgotPasswordPage from "../pages/auth/forget-password";
import DisplayCart from "../pages/cart/cart.tsx"
import SellerRegister from "../pages/auth/register/seller-register.tsx";
import SellerLayout from "../pages/layout/seller.page.tsx";
import CheckoutPage from "../pages/order/checkout-page.tsx";
import OrderHistory from "../pages/order/order-history.tsx";
import OrderListingPage from "../pages/Cms/order/allOrderView.tsx";
import PaymentButton from "../pages/order/payment.tsx";
import SellerProductList from "../pages/Cms/seller/product-list-seller.tsx";
import SellerCreateProduct from "../pages/Cms/seller/product-create-seller.tsx";
import SellerEditProduct from "../pages/Cms/seller/product-edit-seller.tsx";


const RouterConfig = () => {
    const [LoggedInUser, setLoggedInUser] = useState<any>(null);
    const [loading, setLoading] = useState(true)
    const getLoggedInUser = async() => {
        try {
            const response: any = await authSvc.getRequest("/auth/me", {auth:true})
            console.log(response)
            setLoggedInUser(response.result);
        } catch(exception) {
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
            <AuthContext.Provider value={{LoggedInUser, setLoggedInUser}}>
        <ToastContainer/>
        <BrowserRouter>
            <Routes>
                <Route path="/" element = {<HomepageLayout/>}>
                <Route index element={<LandingPage/>}/>
                <Route path="register" element={<RegisterPage/>}/>
                <Route path="/SellerRegister" element={<SellerRegister/>}/>
                <Route path="activate/:token" element={<UserActivation/>}/>
                <Route path="login" element={<LoginPage/>}/>
                <Route path="login" element={<LoginPage/>}/>
                <Route path="resetpassword/:token" element={<ResetPassword/>}/>
                <Route path="logout" element={<Logout/>}/>
                <Route path="about" element={<AboutPage/>}/>
                <Route path="categories" element={<AllCategory/>}/>
                <Route path="products" element={<ProductsPage/>}/>
                <Route path="contact" element={<ContactPage/>}/>
                <Route path="categories/:slug" element={<CategoryDetailsPage/>}/>
                <Route path="products/:slug" element={<ProductDetailPage/>}/>
                 <Route path="/orderhistory" element={<CheckPermission allowedBy={UserRoles.CUSTOMER}>
                    <OrderHistory/>
                    </CheckPermission> }/>
                <Route path="cart" element={<CheckPermission allowedBy={UserRoles.CUSTOMER}>
                    <DisplayCart/> 
                    </CheckPermission> }/>
                     <Route path="/payment/:id/:amount" element={<CheckPermission allowedBy={UserRoles.CUSTOMER}>
                    <PaymentButton/> 
                    </CheckPermission> }/>
                    <Route path="/checkout" element={<CheckPermission allowedBy={UserRoles.CUSTOMER}>
                    <CheckoutPage/> 
                    </CheckPermission> }/>
                <Route path="*" element  = {<NotFoundError url="/" label="Go to Homepage"/>}/>
                </Route>

                <Route path="/admin" element={<CheckPermission allowedBy={UserRoles.ADMIN}>
                    <Adminlayout/>
                    </CheckPermission>}>
                <Route index element={<AdminDashboard/>}/>
                <Route path="category" element = {<CategoryListingPage/>}/>
                <Route path="category/create" element = {<CreateCategory/>}/>
                <Route path="category/:id/edit" element = {<EditCategory/>}/>

                <Route path="brand" element = {<BrandListingPage/>}/>
                <Route path="brand/create" element = {<CreateBrand/>}/>
                <Route path="brand/:id/edit" element = {<EditBrand/>}/>
                <Route path="*" element  = {<NotFoundError url="/admin" label="Go to Dashboard"/>}/>

                <Route path="product" element = {<ProductListingPage/>}/>
                <Route path="product/create" element = {<CreateProduct/>}/>
                <Route path="product/:id/edit" element = {<EditProduct/>}/>
                <Route path="*" element  = {<NotFoundError url="/admin" label="Go to Dashboard"/>}/>

                <Route path="orders" element = {<OrderListingPage/>}/>
                </Route>


                <Route path="/seller" element={<CheckPermission allowedBy={UserRoles.SELLER}>
                <SellerLayout/>                   
                </CheckPermission>}>
                <Route path="product" element = {<SellerProductList/>}/>
                <Route path="product/create" element = {<SellerCreateProduct/>}/>
                <Route path="product/:id/edit" element = {<SellerEditProduct/>}/>
                <Route path="*" element  = {<NotFoundError url="/seller" label="Go to Dashboard"/>}/>
                
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