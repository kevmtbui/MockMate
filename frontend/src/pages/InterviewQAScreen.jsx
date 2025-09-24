import PageShell from "../components/PageShell";

export default function InterviewQAScreen() {
  return (
    <PageShell>
      <h2 className="text-2xl font-bold mb-4">Interview Q&A</h2>
      <div className="space-y-4">
        <div className="p-4 bg-white shadow rounded">
          <p className="font-semibold">Q: Tell me about yourself.</p>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <textarea
            placeholder="Type your answer..."
            className="border p-2 w-full h-24"
          ></textarea>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded">Submit Answer</button>
      </div>
    </PageShell>
  );
}