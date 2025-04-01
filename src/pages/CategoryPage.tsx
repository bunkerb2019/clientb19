import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import { Category } from "../utils/types";
import { useLanguage } from "../contexts/LanguageContext";

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string; productId: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const { getText } = useLanguage();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoriesRef = doc(db, "settings", "categories");
        const docSnap = await getDoc(categoriesRef);

        if (docSnap.exists()) {
          const categoriesList = docSnap.data().list as Category[];
          const foundCategory = categoriesList.find((c) => c.id === categoryId) || null;
          setCategory(foundCategory);
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  if (loading) return <div>Loading...</div>;
  if (!category) return <div>Category not found</div>;

  return (
    <div className="category-page">
      <h1 className="active-category">{getText(category)}</h1>
      {category.icon && <img src={category.icon} alt={getText(category)} />}
    </div>
  );
};

export default CategoryPage;