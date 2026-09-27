import { useState } from "react";
import { Search, ChevronDown, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function HelpCenter() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I add a new job application?",
      answer:
        "Go to the Applications page and click the New Application button. Fill in the job details and save the application.",
    },
    {
      question: "How can I edit an application?",
      answer:
        "Open the Applications page, find the application you want to update, and use the Edit option.",
    },
    {
      question: "How do I track an interview?",
      answer:
        "Open the Interview Tracker and add your interview details using the Add Interview button.",
    },
    {
      question: "Can I store my resumes?",
      answer:
        "Yes. The Resume Vault allows you to upload and organize your resumes in one place.",
    },
    {
      question: "How do I update my profile?",
      answer:
        "Go to the Profile page and update your personal, academic, skills, and social information.",
    },
    {
      question: "Where can I manage application status?",
      answer:
        "You can manage the status of each application from the Applications page.",
    },
  ];

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-5xl">

        {/* Blue Header */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-8 py-7 shadow-lg">
          <button
            onClick={() => navigate("/settings")}
            className="mb-6 flex items-center gap-2 text-sm text-blue-100 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Settings
          </button>

          <h1 className="text-4xl font-bold text-white">
            Help Center
          </h1>

          <p className="mt-3 max-w-2xl text-blue-100">
            Find answers to common questions and learn how to use JobTrack AI.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Search size={20} className="text-blue-500" />

            <input
              type="text"
              placeholder="Search for help..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-blue-50"
                >
                  <span className="font-semibold text-gray-800">
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-blue-500 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openIndex === index && (
                  <div className="border-t border-blue-100 bg-blue-50/40 px-6 py-5 text-sm leading-6 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-gray-500">
                No help articles found.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default HelpCenter;