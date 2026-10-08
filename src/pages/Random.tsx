import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Dices } from "lucide-react";
import "./Random.scss";
import { useRandomSettings } from "../hooks/useRandomSettings";
import { useRandomizerItems } from "../hooks/useRandomizerItems";
import { useLanguage } from "../contexts/LanguageContext";

const ruPlural = new Intl.PluralRules("ru");
const RU_FORMS: Record<string, string> = { one: "позиция", few: "позиции", many: "позиций" };

const Random = () => {
  const { getText } = useLanguage();
  const navigate = useNavigate();
  const { data: settings, isLoading, error } = useRandomSettings({ onSuccess: () => {} });
  const { getItems, categoriesLoaded, isLoading: categoriesLoading } = useRandomizerItems();

  if (isLoading || categoriesLoading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка загрузки настроек рандомайзера</div>;
  if (!categoriesLoaded) return <div className="error">Ошибка загрузки категорий</div>;

  const randomizers = settings?.randomizers?.filter((r) => r?.active) || [];

  return (
    <div className="slot-machine">
      <div className="header-section">
        <h1>{getText(settings?.pageTitle, "РАНДОМ")}</h1>
        <p>{getText(settings?.pageDescription)}</p>
      </div>

      <div className="slots">
        {randomizers.map((randomizer) => {
          const count = getItems(randomizer).length;
          return (
            <button
              key={randomizer.id}
              className="slot slot-link"
              disabled={!count}
              onClick={() => navigate(`/random/${randomizer.id}`)}
            >
              <span className="slot-dice">
                <Dices />
              </span>
              <span className="slot-info">
                <span className="slot-title">
                  {getText(randomizer.slotTitle, "Случайный выбор")}
                </span>
                <span className="slot-count">
                  {count
                    ? getText({
                        ru: `${count} ${RU_FORMS[ruPlural.select(count)] ?? "позиций"}`,
                        ro: `${count} ${count === 1 ? "poziție" : "poziții"}`,
                        en: `${count} ${count === 1 ? "item" : "items"}`,
                      })
                    : getText({ ru: "Нет позиций", ro: "Fără poziții", en: "No items" })}
                </span>
              </span>
              <span className="slot-arrow">
                <ChevronRight />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(Random);
