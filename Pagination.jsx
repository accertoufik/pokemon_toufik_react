import React from 'react';
import './index.css'; // Import CSS for styling

export const Pagination = ({ totalPages, currentPage, paginate }) => {
  return (
    <div className='pagination'>
      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => paginate(index + 1)}
          className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};
