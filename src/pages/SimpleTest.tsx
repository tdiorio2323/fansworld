export default function SimpleTest() {
  return (
    <div style={{ padding: '20px', fontSize: '24px', color: 'blue' }}>
      <h1>✅ React is Working!</h1>
      <p>Simple test component loaded successfully</p>
      <p>Time: {new Date().toLocaleString()}</p>
    </div>
  );
}