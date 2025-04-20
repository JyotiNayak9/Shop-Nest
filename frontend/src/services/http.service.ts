import axiosInstance from "../config/axios.config";
import { SearchParams } from "../config/constants";

interface HeaderConfigProps {
  auth?: boolean;
  file?: boolean;
  params?: SearchParams;
}
abstract class httpService {
   private headers ={};
   private params ={};

  private setHeaders = (config: HeaderConfigProps) => {
    if (config && config.auth) {
      const token = localStorage.getItem('_at') || null;
      if(!token) {
        throw {message: "Login First"}
      } else {
      this.headers={
          ...this.headers,
        "Authorization" :"Bearer "+token
      }
      }
    }
    if (config && config.file) {
      this.headers = {
        ...this.headers,
        "Content-Type": "multipart/form-data",
      };
    }
    if (config && config.params) {
      this.params = {
        ...config.params,
      };
    }
  };
  postRequest = async (url: string, data: any = {}, config: any = null) => {
    try {
      this.setHeaders(config);

      const response = await axiosInstance.post(url, data, {
        headers: {...this.headers},
        params: { ...this.params },
      });

      return response;
    } catch (exception) {
      throw exception;
    }
  };
  getRequest = async (url: string, config: any =null  ) => {
    try {
      this.setHeaders(config);

      const response = await axiosInstance.get(url, {
     headers: {...this.headers},
      params: { ...this.params },
      }
    );
      return response;
      
      } catch (exception) {
      throw exception;
    }
  };
  
  patchRequest = async (url: string, data: any = {},config: any =null  ) => {
    try {
      this.setHeaders(config);

      const response = await axiosInstance.patch(url, data,{
     headers: {...this.headers},
     params: { ...this.params },
      }
    );
      return response;
      
      } catch (exception) {
      throw exception;
    }
  }

  deleteRequest = async (url: string, config: any =null  ) => {
    try {
      this.setHeaders(config);

      const response = await axiosInstance.delete(url, {
     headers: {...this.headers},
     params: { ...this.params },
      }
    );
      return response;
      
      } catch (exception) {
      throw exception;
    }
  };
}

export default httpService;
