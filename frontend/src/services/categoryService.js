import axios from "../utils/axiosConfig";

export const getCategories = () => {
  return axios.get("/categories");
};
// Xóa theo id
export const deleteCategory = (id) => {
  return axios.delete(`/categories/${id}`);
};
