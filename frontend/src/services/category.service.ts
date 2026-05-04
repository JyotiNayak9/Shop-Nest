import httpService from "./http.service";

class CategoryService extends httpService {
  async createCategory(data: any) {
    return this.postRequest('/categories', data, { auth: true, file: true });
  }

  async getCategoryById(id: string) {
    return this.getRequest(`/categories/${id}`, { auth: true });
  }

  async getAllCategories() {
    return this.getRequest('/categories/all', { auth: true });
  }

  async updateCategory(id: string, data: any) {
    return this.patchRequest(`/categories/${id}`, data, { auth: true, file: true });
  }

  async deleteCategory(id: string) {
    return this.deleteRequest(`/categories/${id}`, { auth: true });
  }

  async getCategoriesWithSubcategories() {
    return this.getRequest('/categories/with-subcategories', { auth: true });
  }
}

const categorySvc = new CategoryService();
export { categorySvc };
