import axios from "axios";
import ErrorHandler from "./error.handler";

export default class ApiService {
  //public baseURL = "https://localhost:7258/api";
  public baseURL = "https://calculx-eaerhtaed6fbb9bu.australiacentral-01.azurewebsites.net/api";

  controller;
  errorHandler = new ErrorHandler();
  isAuthPage: boolean;

  constructor(props: any, isAuthPage = false) {
    if (props) this.controller = props;
    this.isAuthPage = isAuthPage;
  }

  request = (method: string, endpoint = "", data = null, config = {}) => {
    const url = `${this.baseURL}${
      this.controller ? `/${this.controller}` : ""
    }${endpoint ? `/${endpoint}` : ""}`;

    return new Promise((resolve, reject) => {
      axios({ method, url, data, ...config })
        .then((result: any) => {
          resolve(result.data);
        })
        .catch((error: any) => {
          const errorResponse = this.errorHandler.handleApiError(
            error,
            this.isAuthPage
          );
          resolve(errorResponse);
        });
    });
  };

  post = (data: any, endpoint = "") => this.request("post", endpoint, data);

  put = (data: any, endpoint = "") => this.request("put", endpoint, data);

  get = (endpoint = "") => this.request("get", endpoint);

  getById = (id: any) => this.request("get", id);

  delete = (payload: any, endpoint = "") =>
    this.request("delete", endpoint, null, { data: payload });
}
