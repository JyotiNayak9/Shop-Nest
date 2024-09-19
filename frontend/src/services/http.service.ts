import axiosInstance from "../config/axios.config";

interface HeaderConfigProps {
  auth?: boolean;
  file?: boolean;
}
abstract class httpService {
   private headers ={};

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
  };
  postRequest = async (url: string, data: any = {}, config: any = null) => {
    try {
      this.setHeaders(config);

      const response = await axiosInstance.post(url, data, {
        headers: {...this.headers},
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
     headers: {...this.headers}
      }
    );
      return response;
      
      } catch (exception) {
      throw exception;
    }
  }
}

export default httpService;
