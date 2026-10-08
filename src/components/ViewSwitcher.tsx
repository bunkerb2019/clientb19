import { LayoutGrid, List } from "lucide-react";
import { useView } from "../hooks/useView";
import { useState } from "react";
import "./ViewSwitcher.scss";

const ViewSwitcher = () => {
  const { viewMode, setViewMode } = useView();
  const [rotating, setRotating] = useState(false);

  const isGrid = viewMode === "grid";

  const toggleView = () => {
    setRotating(true);
    setTimeout(() => {
      setViewMode(isGrid ? "list" : "grid");
      setRotating(false);
    }, 600);
  };

  return (
    <div className="view-container">
      <button
        type="button"
        className="viewSwitcher"
        onClick={toggleView}
        title={`Switch to ${isGrid ? "list" : "grid"} view`}
      >
        <div
          className={`icon-wrapper ${
            isGrid ? (rotating ? "flip" : "") : "flipped"
          }`}
        >
          <div className="icon-front">
            <LayoutGrid className="view-icon" />
          </div>
          <div className="icon-back">
            <List className="view-icon" />
          </div>
        </div>
      </button>
    </div>
  );
};

export default ViewSwitcher;
