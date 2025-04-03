import { Route } from "react-router-dom";
import useCategories from "./modules/useCategories";
import useNavigationConfig from "./modules/useNavigationConfig";

const CategoryRoutes = () => {
    const { data: categories = [] } = useCategories();
    const { data: navItems = [] } = useNavigationConfig();
    console.log("Categories:", categories);
    console.log("Navigation Items:", navItems);
    // if (catError) console.error("Categories Error:", catError);
    // if (navError) console.error("Navigation Error:", navError);
  
  return <Route path={`/test`} element={null}/>
    // return (
    //   <>
        // {navItems.map((nav) => (
        //   <Route
        //     key={nav.id}
        //     path={`/${nav.id}`}
        //     element={<CategoryPage />}
        //     // element={
        //     //   <CategoryList
        //     //     categories={categories.filter((cat) => cat.parentId === nav.id)}
        //     //   />
        //     // }
        //   />
        // ))}
  
    //     {/* Динамические категории внутри навигации */}
        // {categories.map((category) => (
        //   <Route
        //     key={category.id}
        //     path={`/${category.parentId}/${category.id}`}
        //     element={<CategoryPage />}
        //   />
        // ))}
    //   </>
    // );
  };

  export default CategoryRoutes