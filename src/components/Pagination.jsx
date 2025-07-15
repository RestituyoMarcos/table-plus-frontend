
export default function Pagination({ links, onPageChange }) {


  const handlePageClick = (url) => {
    if (url) {

      const pageNumber = new URL(url).searchParams.get('page');
      onPageChange(pageNumber);
    }
  };

  return (
    <div className="flex justify-center items-center mt-6">
      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        {links.map((link, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(link.url)}
            disabled={!link.url}

            dangerouslySetInnerHTML={{ __html: link.label }}
            className={`
              relative inline-flex items-center px-4 py-2 border text-sm font-medium
              ${link.active ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}
              ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          />
        ))}
      </nav>
    </div>
  );
}