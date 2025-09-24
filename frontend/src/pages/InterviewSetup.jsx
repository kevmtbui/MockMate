import PageShell from "../components/PageShell";

export default function InterviewSetup() {
  return (
    <PageShell>
      <h2 className="text-2xl font-bold mb-4">Interview Setup</h2>
      <form className="space-y-4">
        <label className="block">
          Difficulty:
          <select className="border p-2 w-full">
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </label>
        <label className="block">
          Mode:
          <select className="border p-2 w-full">
            <option>Voice</option>
            <option>Text</option>
          </select>
        </label>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Start Interview</button>
      </form>
    </PageShell>
  );
}