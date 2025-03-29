import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { app } from "./firebase.config";
import ErrorHandler from "./error.handler";

export default class ApiService {
  db;
  controller;
  errorHandler = new ErrorHandler();
  isAuthPage: boolean;

  constructor(props: any, isAuthPage = false) {
    this.db = getFirestore(app);
    if (props) this.controller = props;
    this.isAuthPage = isAuthPage;
  }

  async request(method: string, endpoint = "", data: any = null) {
    try {
      if (!this.controller) throw new Error("No controller defined");

      const ref = endpoint ? doc(this.db, this.controller, endpoint) : collection(this.db, this.controller);

      switch (method.toLowerCase()) {
        case "post":
          if (!data || !data.id) throw new Error("Data must have an 'id' field");
          await setDoc(doc(this.db, this.controller, data.id), data);
          return { success: true, message: "Data added successfully" };

        case "put":
          if (!data || !data.id) throw new Error("Data must have an 'id' field");
          await updateDoc(doc(this.db, this.controller, data.id), data);
          return { success: true, message: "Data updated successfully" };

        case "get":
          if (endpoint) {
            const docSnap = await getDoc(ref as any);
            return docSnap.exists() ? docSnap.data() : { error: "Not found" };
          } else {
            const querySnapshot = await getDocs(ref as any);
            return querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
          }

        case "delete":
          if (!endpoint) throw new Error("Endpoint (Document ID) is required for deletion");
          await deleteDoc(ref as any);
          return { success: true, message: "Data deleted successfully" };

        default:
          throw new Error("Invalid method");
      }
    } catch (error) {
      return this.errorHandler.handleApiError(error, this.isAuthPage);
    }
  }

  post = (data: any, endpoint = "") => this.request("post", endpoint, data);

  put = (data: any, endpoint = "") => this.request("put", endpoint, data);

  get = (endpoint = "") => this.request("get", endpoint);

  getById = (id: any) => this.request("get", id);

  delete = (id: any) => this.request("delete", id);
}