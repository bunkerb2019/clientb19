import { useContext } from "react";
import { ImagesContext } from "../ImagesProvider";

const useImageDownload = () => {
  return useContext(ImagesContext);
};

export default useImageDownload;
