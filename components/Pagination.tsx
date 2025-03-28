import ReactPaginate from 'react-paginate';

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, pageCount, onPageChange }: PaginationProps) {
  return (
    <ReactPaginate
      previousLabel="上一页"
      nextLabel="下一页"
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      className="flex items-center justify-center space-x-2"
      pageClassName="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md"
      activeClassName="bg-blue-50 border-blue-500 text-blue-600"
      disabledClassName="opacity-50 cursor-not-allowed"
      previousClassName="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md"
      nextClassName="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md"
    />
  );
} 