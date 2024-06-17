import { useState } from "react";

const usePagination = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages] = useState(0);

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (totalPages == currentPage) {
      setCurrentPage(currentPage + 1);
    }
  };
  return {
    goToPreviousPage,
    goToNextPage,
    setCurrentPage,
    currentPage,
  };
};

export default usePagination;
