import { useConversion } from './hooks/useConversion';
import { Header } from './components/Header';
import { UploadView } from './components/UploadView';
import { Converting } from './components/Converting';
import { ResultView } from './components/ResultView';
import { Analytics } from "@vercel/analytics/next"

export default function App() {
  const { status, progress, result, error, pendingName, convert, reset } = useConversion();

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <Header showReset={status === 'done' || status === 'error'} onReset={reset} />

      {status === 'idle' && <UploadView onFile={convert} error={null} />}
      {status === 'error' && <UploadView onFile={convert} error={error} />}
      {status === 'working' && <Converting name={pendingName} progress={progress} />}
      {status === 'done' && result && <ResultView result={result} onReset={reset} />}
      <Analytics />
    </div>
  );
}
