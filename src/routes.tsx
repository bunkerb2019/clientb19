import { Route } from "react-router-dom";
import useCategories from "./modules/useCategories";
import useNavigationConfig from "./modules/useNavigationConfig";
import CategoryList from "./pages/CategoryList";
import CategoryPage from "./pages/CategoryPage";

const CategoryRoutes = () => {
    const { data: categories = [] } = useCategories();
    const { data: navItems = [] } = useNavigationConfig();
    console.log("Categories:", categories);
    console.log("Navigation Items:", navItems);
    // if (catError) console.error("Categories Error:", catError);
    // if (navError) console.error("Navigation Error:", navError);
  
<Route path="/menu/:navId" element={<CategoryPage />}>
  <Route path=":categorySlug" element={<CategoryList navId={""} />} />
</Route>
  };

  export default CategoryRoutes