import React from 'react';
import { useLocalize } from '~/hooks';

type TPluginPaginationProps = {
  currentPage: number;
  maxPage: number;
  onChangePage: (page: number) => void;
};

const PluginPagination: React.FC<TPluginPaginationProps> = ({
  currentPage,
  maxPage,
  onChangePage,
}) => {
  const localize = useLocalize();
  
  // Generate a very limited set of page numbers to display
  const getPageNumbers = () => {
    // Only show at most 5 page numbers to avoid overflow
    const pageNumbers: Array<number | string> = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // Show current page and one page before/after if they exist
    const beforeCurrent = currentPage > 2 ? currentPage - 1 : null;
    const afterCurrent = currentPage < maxPage - 1 ? currentPage + 1 : null;
    
    // Add ellipsis if there's a gap between first page and beforeCurrent
    if (beforeCurrent && beforeCurrent > 2) {
      pageNumbers.push('ellipsis-start');
    }
    
    // Add the page before current if it's not the first page
    if (beforeCurrent && beforeCurrent > 1) {
      pageNumbers.push(beforeCurrent);
    }
    
    // Add current page if it's not the first or last page
    if (currentPage > 1 && currentPage < maxPage) {
      pageNumbers.push(currentPage);
    }
    
    // Add the page after current if it's not the last page
    if (afterCurrent && afterCurrent < maxPage) {
      pageNumbers.push(afterCurrent);
    }
    
    // Add ellipsis if there's a gap between afterCurrent and last page
    if (afterCurrent && afterCurrent < maxPage - 1) {
      pageNumbers.push('ellipsis-end');
    }
    
    // Always show last page if it's not the first page
    if (maxPage > 1) {
      pageNumbers.push(maxPage);
    }
    
    return pageNumbers;
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > maxPage) {
      return;
    }
    onChangePage(page);
  };

  return (
    <div className="flex gap-2 text-sm text-black/60 dark:text-white/70">
      <div
        role="button"
        tabIndex={0}
        aria-label="Previous page"
        onClick={() => handlePageChange(currentPage - 1)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onChangePage(currentPage - 1);
          }
        }}
        className={`flex cursor-default items-center text-sm ${
          currentPage === 1
            ? 'text-black/70 opacity-50 dark:text-white/70'
            : 'text-black/70 hover:text-black/50 dark:text-white/70 dark:hover:text-white/50'
        }`}
        style={{ userSelect: 'none' }}
      >
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        {localize('com_ui_prev')}
      </div>
      
      {/* Page number display */}
      <div className="flex items-center">
        <span className="mx-2">
          {currentPage} / {maxPage}
        </span>
      </div>
      
      {/* Optional: Show a few page numbers for quick navigation */}
      <div className="hidden sm:flex">
        {getPageNumbers().map((page, index) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <div
                key={`${page}-${index}`}
                className="flex h-5 w-5 items-center justify-center text-sm text-black/70 dark:text-white/70"
                style={{ userSelect: 'none' }}
              >
                &hellip;
              </div>
            );
          }
          
          return (
            <div
              role="button"
              key={`page-${page}`}
              tabIndex={0}
              className={`flex h-5 w-5 items-center justify-center text-sm ${
                currentPage === page
                  ? 'text-blue-600 hover:text-blue-600 dark:text-blue-600 dark:hover:text-blue-600'
                  : 'text-black/70 hover:text-black/50 dark:text-white/70 dark:hover:text-white/50'
              }`}
              style={{ userSelect: 'none' }}
              onClick={() => onChangePage(page as number)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onChangePage(page as number);
                }
              }}
            >
              {page}
            </div>
          );
        })}
      </div>
      <div
        role="button"
        aria-label="Next page"
        tabIndex={0}
        onClick={() => handlePageChange(currentPage + 1)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onChangePage(currentPage + 1);
          }
        }}
        className={`flex cursor-default items-center text-sm ${
          currentPage === maxPage
            ? 'text-black/70 opacity-50 dark:text-white/70'
            : 'text-black/70 hover:text-black/50 dark:text-white/70 dark:hover:text-white/50'
        }`}
        style={{ userSelect: 'none' }}
      >
        {localize('com_ui_next')}
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  );
};

export default PluginPagination;
