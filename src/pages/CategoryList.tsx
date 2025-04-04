import { Outlet } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import useCategories from "../modules/useCategories";
import { useEffect, useState } from "react";
import useMenuItems from "../modules/useMenuItems";
import { useLanguage } from "../contexts/LanguageContext"; // Import the language hook

interface CategoryListProps {
  navId: string;
}

const CategoryList: React.FC<CategoryListProps> = ({
  navId,
}: CategoryListProps) => {
  const { getText } = useLanguage(); // Get the language helper function

  const { data: categories } = useCategories();
  const { data: dishes, isLoading, error } = useMenuItems();

  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [selectedCategoryIcon, setSelectedCategoryIcon] = useState<
    string | undefined
  >();

  // Фильтруем категории по parentId (navId)
  const filteredCategories = categories?.filter(
    (category) => category.parentId === navId
  );

  // Фильтруем блюда по выбранной категории
  const filteredDishes = dishes?.filter(
    (dish) => dish.category === selectedCategory && dish.active !== false
  );
  console.log('folter');
  // Устанавливаем первую категорию как выбранную по умолчанию
  useEffect(() => {
    if (Array.isArray(filteredCategories) && filteredCategories.length > 0) {
      const defaultCategory = filteredCategories[0]?.ru;

      setSelectedCategory((prev) =>
        prev && filteredCategories.some((cat) => cat.ru === prev)
          ? prev
          : defaultCategory
      );
      setSelectedCategoryIcon(filteredCategories[0]?.icon);
    }
  }, [filteredCategories, navId]);

  // Обновляем иконку при изменении выбранной категории
  useEffect(() => {
    if (selectedCategory && filteredCategories) {
      const category = filteredCategories.find(
        (cat) => cat.ru === selectedCategory
      );
      setSelectedCategoryIcon(category?.icon);
    }
  }, [selectedCategory, filteredCategories]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading dishes</div>;

  return (
    <div>
    {/* Динамический заголовок с иконкой */}
    {(() => {
  const currentCategory = filteredCategories?.find(cat => cat.ru === selectedCategory);
  return (
    <span className="category-header">
      <img
        src={selectedCategoryIcon || "/default-icon.svg"}
        alt={currentCategory ? getText(currentCategory) : getText({ ru: "Категория", en: "Category" })}
        className="icon"
      />
      <span className="active-category">
        {currentCategory ? getText(currentCategory) : getText({ ru: "Категория", en: "Category" })}
      </span>
    </span>
  );
})()}

    <div className="product-container">
      <Outlet />
      {filteredDishes?.length === 0 ? (
        <p>{getText({ ru: "В этой категории пока нет товаров.", en: "No products in this category yet." })}</p>
      ) : (
        filteredDishes?.map((dish, index) => <ProductCard key={index} {...dish} />)
      )}
    </div>

    <div className="sub-nav">
      {filteredCategories?.map((category) => (
        <div
          className={`nav-item ${selectedCategory === category.ru ? 'active' : ''}`}
          key={category.id}
          onClick={() => setSelectedCategory(category.ru)}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={category.icon || "/default-icon.png"}
            alt={getText(category)} // Use getText for alt text
            className="icon"
          />
          {getText(category)} {/* Use getText to display the appropriate language */}
        </div>
      ))}
    </div>
  </div>
  );
};

export default CategoryList;
