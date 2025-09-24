import PageShell from "../components/PageShell";

export default function FeedbackScreen() {
  return (
    <PageShell>
      <h2 className="text-2xl font-bold mb-4">Feedback</h2>
      <div className="space-y-4">
        <div className="p-4 bg-green-100 rounded">✅ Strong communication skills</div>
        <div className="p-4 bg-yellow-100 rounded">⚠️ Work on structuring answers</div>
        <div className="p-4 bg-red-100 rounded">❌ Avoid long pauses</div>
      </div>
    </PageShell>
  );
}