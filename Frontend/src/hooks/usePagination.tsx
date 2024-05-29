import { useState } from "react";

const usePagination = () => {
  const [showNextPage, setShowNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (!showNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };
  return {
    goToPreviousPage,
    goToNextPage,
    setShowNextPage,
    setCurrentPage,
    currentPage,
    showNextPage,
  };
};

export default usePagination;
