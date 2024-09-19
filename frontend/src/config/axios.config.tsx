import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout:30000 ,
    timeoutErrorMessage: "Server timed out...",
    // maxContentLength,
    // method
    // maxRate
    // xsrfCookieName
    headers: {
        "Content-Type" : "application/json"
    }
})


//interceptor
axiosInstance.interceptors.response.use((response: any) => {
    return response.data;
}, (error: any) =>{
if(error.code === "ERR_BAD_REQUEST"){
    throw error.response
}else{
    
}
})

export default axiosInstance;