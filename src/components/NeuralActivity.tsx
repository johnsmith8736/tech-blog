export function NeuralActivity() {
  return (
    <section className="panel neural-activity" aria-labelledby="neural-activity-title">
      <h2 id="neural-activity-title">NEURAL ACTIVITY</h2>
      <div className="neural-graph" aria-hidden="true">
        <div className="neural-scan" />
        <svg className="heartbeat-line" viewBox="0 0 280 100" preserveAspectRatio="none">
          <polyline
            points="0,58 24,58 34,56 44,60 54,58 68,58 78,22 92,84 104,48 116,58 144,58 156,55 168,61 180,58 196,58 208,35 220,76 232,52 244,58 280,58"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </section>
  );
}
