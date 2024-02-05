export default function ErrorMessage({ err }) {
  return (
    <p className="error">
      {err}
      <span>⛔</span>
    </p>
  );
}
