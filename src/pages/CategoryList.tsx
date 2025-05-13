import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import ProductCard from "../components/ProductCard";
import useCategories from "../modules/useCategories";
import useMenuItems from "../modules/useMenuItems";
import { useLanguage } from "../contexts/LanguageContext";
import Welcome from "../pages/Welcome.tsx"; // импорт приветственного экрана

interface CategoryListProps {
  navId: string;
}

const CategoryList: React.FC<CategoryListProps> = ({ navId }) => {
  const { getText } = useLanguage();
  const { data: categories } = useCategories();
  const { data: dishes, isLoading } = useMenuItems();

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedCategoryIcon, setSelectedCategoryIcon] = useState<string | undefined>();
  const [showWelcome, setShowWelcome] = useState(true);

  // Фильтруем категории по parentId (navId)
  const filteredCategories = categories?.filter((category) => category.parentId === navId);

  // Фильтруем блюда по выбранной категории
  const filteredDishes = dishes?.filter(
    (dish) => dish.category === selectedCategory && dish.active !== false
  );

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

  // Welcome экран: исчезает после загрузки данных
  useEffect(() => {
    if (!isLoading && dishes && categories) {
      const timer = setTimeout(() => setShowWelcome(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isLoading, dishes, categories]);

  return (
    <>
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            key="welcome"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: "absolute", inset: 0, zIndex: 50 }}
          >
            <Welcome />
          </motion.div>
        )}
      </AnimatePresence>

      {!showWelcome && (
        <div>
          {/* Заголовок с иконкой выбранной категории */}
          {(() => {
            const currentCategory = filteredCategories?.find(
              (cat) => cat.ru === selectedCategory
            );
            return (
              <span className="category-header">
                <img
                  src={selectedCategoryIcon || "/default-icon.svg"}
                  alt={
                    currentCategory
                      ? getText(currentCategory)
                      : getText({ ru: "Категория", en: "Category" })
                  }
                  className="icon"
                />
                <span className="active-category">
                  {currentCategory
                    ? getText(currentCategory)
                    : getText({ ru: "Категория", en: "Category" })}
                </span>
              </span>
            );
          })()}

          {/* Товары */}
          <div className="product-container">
            <Outlet />
            {filteredDishes?.length === 0 ? (
              <p className="no-product">
                {getText({
                  ru: "В этой категории пока нет товаров.",
                  ro: "Nu există încă produse în această categorie.",
                  en: "No products in this category yet.",
                })}
              </p>
            ) : (
              filteredDishes?.map((dish, index) => <ProductCard key={index} {...dish} />)
            )}
          </div>

          {/* Навигация по подкатегориям */}
          <div className="sub-nav">
            {filteredCategories?.map((category) => (
              <div
                className={`nav-item ${selectedCategory === category.ru ? "active" : ""}`}
                key={category.id}
                onClick={() => setSelectedCategory(category.ru)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={category.icon || "/default-icon.png"}
                  alt={getText(category)}
                  className="icon"
                />
                {getText(category)}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryList;