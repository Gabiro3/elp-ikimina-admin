"use client"

export function PDFViewer({ url }: { url: string }) {
  return (
    <div className="h-[600px] w-full overflow-hidden rounded-lg border">
      <iframe src={url} className="h-full w-full" title="Contribution Proof Document" />
    </div>
  )
}
