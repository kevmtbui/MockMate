import PageShell from "../components/PageShell";

export default function UploadForm() {
  return (
    <PageShell>
      <h2 className="text-2xl font-bold mb-4">Upload Resume / Job Description</h2>
      <form className="space-y-4">
        <input type="file" className="border p-2 w-full" />
        <textarea
          placeholder="Paste job description here..."
          className="border p-2 w-full h-32"
        ></textarea>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
      </form>
    </PageShell>
  );
}