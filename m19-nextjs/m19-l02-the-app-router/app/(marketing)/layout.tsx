export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <p className="banner">New: Docker for Developers is live</p>
      {children}
    </div>
  )
}
