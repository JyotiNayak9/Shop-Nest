import httpService from "./http.service";

class CategoryService extends httpService {
  async createCategory(data: any) {
    return this.postRequest('/category/create', data, { auth: true, file: true });
  }

  async getCategoryById(id: string) {
    return this.getRequest(`/category/${id}`, { auth: true });
  }

  async getAllCategories() {
    return this.getRequest('/category/getall', { auth: true });
  }

  async updateCategory(id: string, data: any) {
    return this.patchRequest(`/category/${id}`, data, { auth: true, file: true });
  }

  async deleteCategory(id: string) {
    return this.deleteRequest(`/category/${id}`, { auth: true });
  }

  async getCategoriesWithSubcategories() {
    return this.getRequest('/category/getallwithsubcategories', { auth: true });
  }
}

const categorySvc = new CategoryService();
export { categorySvc };
