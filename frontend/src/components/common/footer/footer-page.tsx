import { Footer } from "flowbite-react";
import logo from "../../../assets/images/logo.png"

const HomeFooter = () => {
  return (
    <>
    <Footer container className="border-t border-gray-300/100 ">
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div>
            <Footer.Brand href="/" src= ''>
              <img src={logo} className="ml-2 sm:ml-4 lg:ml-20 h-16 sm:h-18 lg:h-20 w-auto" alt="Logo"/>
       
            </Footer.Brand>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.LinkGroup col>
              <Footer.Link href="/">Home</Footer.Link>
                <Footer.Link href="/about">About Us</Footer.Link>
              
               

              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.LinkGroup col>
              <Footer.Link href="/products">Products</Footer.Link>
              <Footer.Link href="/contact">Contact</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.LinkGroup col>
              <Footer.Link href="/contact">Contact</Footer.Link>
              <Footer.Link href="/categories">Categories</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        {/* <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright href="#" by="Flowbite™" year={2022} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon href="#" icon={BsGithub} />
            <Footer.Icon href="#" icon={BsDribbble} />
          </div>
        </div> */}
      </div>
    </Footer>
    </>
  );
}

export default HomeFooter;