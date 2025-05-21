import axios from "../utils/axiosConfig";

export const getCategories = () => {
  return axios.get("/categories");
};
