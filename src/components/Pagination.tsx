import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination() {
  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" disabled aria-label="Previous page">
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      <span>Page 1 / 1</span>
      <button type="button" disabled aria-label="Next page">
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </nav>
  );
}
