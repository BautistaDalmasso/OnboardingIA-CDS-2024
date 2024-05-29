import { useState } from "react";

const usePagination = () => {
  const [totalPages, setTotalPages] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (!totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  return {
    goToPreviousPage,
    goToNextPage,
    setTotalPages,
    setCurrentPage,
    currentPage,
    totalPages,
  };
};

export default usePagination;
