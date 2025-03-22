import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { Icons } from "../components/Icons";
import ProductCard from "../components/ProductCard";
import useCategories from "../modules/useCategories";
import { useEffect, useState } from "react";
import useMenuItems from "../modules/useMenuItems";

interface Category {
  id: string;
  parentId: string;
  en: string;
  ru: string;
  ro: string;
  icon?: string;
}

interface CategoryListProps {
  navId: string;
}

const CategoryList: React.FC<CategoryListProps> = ({ navId }: CategoryListProps) => {
  const { t } = useTranslation();
  const { data: categories } = useCategories();
  const { data: dishes, isLoading, error } = useMenuItems();

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedCategoryIcon, setSelectedCategoryIcon] = useState<string | undefined>();

  // Фильтруем категории по parentId (navId)
  const filteredCategories = categories?.filter((category) => category.parentId === navId);

  // Фильтруем блюда по выбранной категории
  const filteredDishes = dishes?.filter((dish) => dish.category === selectedCategory);

  // Устанавливаем первую категорию как выбранную по умолчанию
  useEffect(() => {
    if (!selectedCategory && filteredCategories) {
      const defaultCategory = filteredCategories[0];
      setSelectedCategory(defaultCategory?.ru); // Используем ru для выбора категории
      setSelectedCategoryIcon(defaultCategory?.icon); // Устанавливаем иконку категории
    }
  }, [filteredCategories, selectedCategory]);

  // Обновляем иконку при изменении выбранной категории
  useEffect(() => {
    if (selectedCategory && filteredCategories) {
      const category = filteredCategories.find((cat) => cat.ru === selectedCategory);
      setSelectedCategoryIcon(category?.icon);
    }
  }, [selectedCategory, filteredCategories]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading dishes</div>;

  return (
    <div>
      {/* Динамический заголовок с иконкой */}
      <span className="category-header">
        <img
          src={selectedCategoryIcon || Icons.asia} // Иконка категории или fallback
          alt={selectedCategory || "Категория"}
          className="icon"
        />
        {selectedCategory || "Категория"}
      </span>

      <div className="product-container">
        <Outlet />
        {filteredDishes?.length === 0 ? (
          <div>В этой категории пока нет товаров.</div>
        ) : (
          filteredDishes?.map((dish, index) => <ProductCard key={index} {...dish} />)
        )}
      </div>

      <div className="sub-nav">
        {filteredCategories?.map((category) => (
          <div
            className="nav-item"
            key={category.id}
            onClick={() => setSelectedCategory(category.ru)} // Обновляем состояние при клике
          >
            <img
              src={category.icon || "/default-icon.png"}
              alt={category.en}
              className="icon"
            />
            {category.ru}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;