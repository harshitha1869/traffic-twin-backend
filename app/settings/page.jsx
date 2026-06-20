export default function SettingsPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-4xl font-bold">Settings</h1>

      <div className="bg-card border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          AI Model Configuration
        </h2>

        <div className="space-y-3">
          <p>Current Model: XGBoost v1.0</p>
          <p>Prediction Target: Road Closure Probability</p>
          <p>Accuracy: 87.7%</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Alert Thresholds
        </h2>

        <div className="space-y-2">
          <p>Low Risk: 0 - 39%</p>
          <p>Medium Risk: 40 - 69%</p>
          <p>High Risk: 70%+</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          System Status
        </h2>

        <p>Frontend: Online</p>
        <p>FastAPI Backend: Online</p>
        <p>ML Model: Loaded</p>
      </div>
    </div>
  )
}