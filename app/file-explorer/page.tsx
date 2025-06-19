import { Metadata } from 'next';
import { FileExplorer } from '../../components/file-explorer/components/FileExplorer';

export const metadata: Metadata = {
  title: 'File Explorer Demo | Portfolio',
  description: 'Interactive file system interface for project exploration',
};

export default function FileExplorerPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <FileExplorer className="h-screen" />
    </div>
  );
}
