import { useState } from "react";

const usePagination = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    console.log(totalPages +" "+currentPage)
    if (totalPages != currentPage) {
      setCurrentPage(currentPage + 1);
    }
  };
  return {
    goToPreviousPage,
    goToNextPage,
    setCurrentPage,
    currentPage,
    totalPages,
    setTotalPages,
  };
};

export default usePagination;
