export default function FloatingButtons() {
  const handleEmail = () => {
    window.location.href = "mailto:info@thegoanwedding.com?subject=Inquiry from TheGoanWedding.com";
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <button
        onClick={handleEmail}
        className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg animate-float transition-all transform hover:scale-110"
        aria-label="Email us"
      >
        <i className="fas fa-envelope text-xl"></i>
      </button>
    </div>
  );
}
