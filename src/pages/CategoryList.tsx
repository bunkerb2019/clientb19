import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { Icons } from "../components/Icons";
import ProductCard from "../components/ProductCard";
import useCategories from "../modules/useCategories";
import { useEffect, useState } from "react";
import useMenuItems from "../modules/useMenuItems";



interface CategoryListProps {
  navId: string;
}

const CategoryList: React.FC<CategoryListProps> = ({ navId }: CategoryListProps) => {
  // const { t } = 
  useTranslation();
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
    if (Array.isArray(filteredCategories) && filteredCategories.length > 0) {
      const defaultCategory = filteredCategories[0]?.ru;
  
      setSelectedCategory((prev) =>
        prev && filteredCategories.some((cat) => cat.ru === prev) ? prev : defaultCategory
      );
      setSelectedCategoryIcon(filteredCategories[0]?.icon);
    }
  }, [filteredCategories, navId]);

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
        src={selectedCategoryIcon || Icons.asia}
        alt={selectedCategory || "Категория"}
        className="icon"
      />
      <span className="active-category">{selectedCategory || "Категория"}</span>
    </span>

      <div className="product-container">
        <Outlet />
        {filteredDishes?.length === 0 ? (
          <p>В этой категории пока нет товаров.</p>
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
            style={{ cursor: 'pointer' }} // Добавляем указатель при наведении
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