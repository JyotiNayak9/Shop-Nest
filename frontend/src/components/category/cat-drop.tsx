import { useEffect, useState } from "react";
import authSvc from "../../pages/auth/auth.service";
import { useNavigate } from "react-router-dom";

interface Category {
  _id: string;
  title: string;
  subcategories?: Category[];
}

const CategoryDropdown = () => {
  const [categories, setCategories] = useState<Category[]>([]);
    const navigate  = useNavigate();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response:any = await authSvc.getRequest('/category/getcategorieswithsubcategories');
        console.log(response)
        setCategories(response.result);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleClick = (categoryId: string) => {
    navigate(`/categories/${categoryId}`);
  };
  return (
    <div className="w-60 border rounded">
      <div className="font-bold p-3 border-b">Categories</div>
      <ul>
        {categories.map(cat => (
          <li key={cat._id} className="relative group">
            <div className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between"  onClick={() => handleClick(cat._id)} >
              {cat.title}
              {/* {cat.subcategories?.length > 0 && <span>▶</span>} */}
            </div>
            {cat.subcategories && cat.subcategories.length > 0 && (
              <ul className="absolute left-full top-0 bg-white shadow-md border w-36 hidden group-hover:block z-10">
                {cat.subcategories.map(sub => (
                  <li key={sub._id} className="p-2 hover:bg-gray-200 cursor-pointer"  onClick={() => handleClick(sub._id)}>
                    {sub.title}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryDropdown;
