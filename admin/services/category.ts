import api from "./api";

export const getCategories = () =>
    api.get("/categories");

export const createCategory = (data:any)=>
    api.post("/admin/categories",data);