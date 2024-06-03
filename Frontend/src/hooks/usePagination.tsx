import { useState } from "react";

const usePagination = () => {
  const [isAtLastPage, setIsAtLastPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (!isAtLastPage) {
      setCurrentPage(currentPage + 1);
    }
  };
  return {
    goToPreviousPage,
    goToNextPage,
    setIsAtLastPage,
    setCurrentPage,
    currentPage,
    isAtLastPage,
  };
};

export default usePagination;
