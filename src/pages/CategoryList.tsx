import { useMemo, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import useCategories from "../modules/useCategories";
import useMenuItems from "../modules/useMenuItems";
import { useLanguage } from "../contexts/LanguageContext";
import React from "react";
import { useView } from "../hooks/useView";
import defaultCategoryIcon from "../assets/logo.png";
import { useTopBarTitle } from "../contexts/TopBarContext";

const CategoryList: React.FC<{ navId: string }> = ({ navId }) => {
  const { getText } = useLanguage();
  const { data: categories } = useCategories();
  const { data: dishes } = useMenuItems();
  const { viewMode } = useView();

  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const subNavRef = useRef<HTMLDivElement>(null);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [arrowVisible, setArrowVisible] = useState(false);

  const filteredCategories = useMemo(
    () => categories?.filter((c) => c.parentId === navId) || [],
    [categories, navId]
  );

  const filteredDishes = useMemo(
    () =>
      dishes?.filter(
        (d) => d.category === selectedCategory && d.active !== false
      ) || [],
    [dishes, selectedCategory]
  );

  const currentCategory = useMemo(
    () => filteredCategories.find((c) => c.ru === selectedCategory),
    [filteredCategories, selectedCategory]
  );

  useEffect(() => {
    if (filteredCategories.length > 0) {
      setSelectedCategory((prev) =>
        prev && filteredCategories.some((c) => c.ru === prev)
          ? prev
          : filteredCategories[0]?.ru
      );
    }
  }, [filteredCategories]);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [viewMode]);

  useEffect(() => {
    const checkScroll = () => {
      const el = subNavRef.current;
      if (!el) return;
      setShowRightArrow(
        el.scrollWidth > el.clientWidth &&
          el.scrollLeft + el.clientWidth < el.scrollWidth - 5
      );
    };
    checkScroll();
    const el = subNavRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [filteredCategories]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showRightArrow) {
      timeout = setTimeout(() => setArrowVisible(true), 400);
    } else {
      setArrowVisible(false);
    }
    return () => clearTimeout(timeout);
  }, [showRightArrow]);

  const handleArrowClick = () => {
    const el = subNavRef.current;
    if (el) {
      el.scrollBy({ left: 120, behavior: "smooth" });
    }
  };

  const categoryTitle = currentCategory ? getText(currentCategory) : "";

  useTopBarTitle(
    currentCategory && (
      <motion.div
        key={currentCategory.id}
        className="category-header"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={currentCategory.icon || defaultCategoryIcon}
          alt=""
          className="icon"
        />
        <span className="active-category">{categoryTitle}</span>
      </motion.div>
    ),
    [currentCategory?.id, currentCategory?.icon, categoryTitle]
  );

  return (
    <div className="category-container">
      <motion.div
        className={`product-container ${viewMode} ${
          isTransitioning ? "transitioning mode-transition" : ""
        }`}
        key={viewMode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {filteredDishes.length === 0 ? (
          <motion.p
            className="no-product"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {getText({
              ru: "В этой категории пока нет товаров.",
              en: "No products in this category yet.",
              ro: "Nu există produse în această categorie.",
            })}
          </motion.p>
        ) : (
          filteredDishes.map((dish) => (
            <ProductCard
              key={`${dish.id}-${viewMode}`}
              {...dish}
              viewMode={viewMode}
            />
          ))
        )}
      </motion.div>

      <div className="sub-nav-wrapper" style={{ position: "relative" }}>
        <motion.div
          className="sub-nav"
          ref={subNavRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {filteredCategories.map((category) => {
            const text = getText(category);
            const isExpanded = expandedCategory === category.id;
            const shouldTruncate = text.length > 12 && !isExpanded;
            return (
              <motion.div
                key={category.id}
                className={`nav-item ${
                  selectedCategory === category.ru ? "active" : ""
                }${isExpanded ? " expanded" : ""}`}
                onClick={() => {
                  setSelectedCategory(category.ru);
                  setExpandedCategory(isExpanded ? null : category.id);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={category.icon || defaultCategoryIcon}
                  alt={text}
                  className="icon"
                />
                <span className="category-title">
                  {shouldTruncate ? text.slice(0, 12) + "..." : text}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      {arrowVisible && (
        <motion.button
          className="sub-nav-arrow-fixed"
          onClick={handleArrowClick}
          aria-label="Прокрутить вправо"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ color: "var(--navbar-text-active-color, #f7b946)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24">
            <path
              d="M8 4l8 8-8 8"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      )}
    </div>
  );
};

export default React.memo(CategoryList);
