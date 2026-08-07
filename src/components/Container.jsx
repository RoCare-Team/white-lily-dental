export default function Container({ className = "", children }) {
  return <div className={`wl-container ${className}`}>{children}</div>;
}
