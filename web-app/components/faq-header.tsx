export default function FaqHeader() {
  return (
    <div className="text-center mb-6">
      <div className="inline-block md:hidden mb-4">
        <span className="px-4 py-1 rounded-full text-sm font-medium bg-gray-100">
          FAQs
        </span>
      </div>
      <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-tight">
        <span className="font-normal">Frequently</span>{" "}
        <br className="md:hidden" />
        <span className="font-normal">Asked</span>{" "}
        <span className="italic">Questions</span>
      </h1>
    </div>
  );
}
