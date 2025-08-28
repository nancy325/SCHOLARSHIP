const SearchAndApply = () => (
  <div className="bg-gradient-to-r from-blue-100 to-blue-300 py-12 px-4 text-center">
    <div className="max-w-2xl mx-auto bg-white/90 rounded-2xl shadow-lg p-8">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900">Search & Apply for Scholarships</h2>
      <p className="text-lg text-blue-800 mb-8">Find scholarships that match your profile and apply in one click.</p>
      <form className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <input
          type="text"
          placeholder="Search scholarships by keyword, field, or location..."
          className="flex-1 px-4 py-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>
      <div className="mt-8">
        <div className="text-blue-700 text-sm">No scholarships found. Try searching with different keywords.</div>
      </div>
    </div>
  </div>
);

export default SearchAndApply;