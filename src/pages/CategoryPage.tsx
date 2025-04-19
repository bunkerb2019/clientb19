import  { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useMenuItems from '../modules/useMenuItems';
import ProductCard from '../components/ProductCard';
import { saveClientCategoryView } from '../firebase/saveClientView';
import { useLanguage } from '../contexts/LanguageContext';


const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { data: menuItems, isLoading, error } = useMenuItems();
  const { getText } = useLanguage();

  // Трекинг просмотра категории
  useEffect(() => {
    if (categoryId) {
      saveClientCategoryView(categoryId);
    }
  }, [categoryId]);

  // Фильтрация товаров по категории
  const categoryProducts = menuItems?.filter(
    item => item.category === categoryId
  ) || [];

  if (isLoading) {
    return (
      <div className="category-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-error">
        {getText({ ru: 'Ошибка загрузки', en: 'Loading error', ro: 'Eroare de încărcare' })}
      </div>
    );
  }

  return (
    <div className="category-page">
      <h1 className="category-title">
        {getText({ 
          ru: `Категория: ${categoryId}`, 
          en: `Category: ${categoryId}`, 
          ro: `Categoria: ${categoryId}` 
        })}
      </h1>
      
      {categoryProducts.length === 0 ? (
        <p className="no-products">
          {getText({ 
            ru: 'Товары не найдены', 
            en: 'No products found', 
            ro: 'Nu s-au găsit produse' 
          })}
        </p>
      ) : (
        <div className="products-grid">
          {categoryProducts.map(product => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              weight={product.weight}
              weightUnit={product.weightUnit}
              price={product.price}
              currency={product.currency}
              image={product.image}
              category={product.category}
              type={product.type}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;