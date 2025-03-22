import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import { Category } from "../utils/types";


const CategoryPage = () => {
  const { categoryId, productId } = useParams<{ categoryId: string; productId: string }>(); // Явно указываем тип параметра
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoriesRef = doc(db, "settings", "categories");
        const docSnap = await getDoc(categoriesRef);

        if (docSnap.exists()) {
          const categoriesList = docSnap.data().list as Category[]; // Приводим к типу
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
      <h1>{category.ru}</h1>
      {category.icon && <img src={category.icon} alt={category.ru} />}
      <div className="translations">
        <p>RO: {category.ro}</p>
        <p>EN: {category.en}</p>
      </div>
    </div>
  );
};

export default CategoryPage;