import { useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

function App() {
  // Estado para /predict
  const [singleFeatures, setSingleFeatures] = useState({
    amount: 1000,
    txLast30d: 5,
    avgDailyBalance: 1500,
    isForeign: 0,
  });
  const [singleResult, setSingleResult] = useState(null);
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleError, setSingleError] = useState(null);

  // Estado para /predict-batch
  const [batchText, setBatchText] = useState(
    `1000,5,1500,0
1200,4,1300,0
30000,1,5000,1
800,6,1200,0`
  );
  const [batchResult, setBatchResult] = useState(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchError, setBatchError] = useState(null);

  const handleSingleChange = (field, value) => {
    setSingleFeatures((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const callSinglePredict = async () => {
    setSingleLoading(true);
    setSingleError(null);
    setSingleResult(null);

    try {
      const payload = {
        features: [
          Number(singleFeatures.amount),
          Number(singleFeatures.txLast30d),
          Number(singleFeatures.avgDailyBalance),
          Number(singleFeatures.isForeign),
        ],
      };

      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setSingleResult(data);
    } catch (err) {
      console.error(err);
      setSingleError(String(err));
    } finally {
      setSingleLoading(false);
    }
  };

  const callBatchPredict = async () => {
    setBatchLoading(true);
    setBatchError(null);
    setBatchResult(null);

    try {
      // Parsear el textarea: cada línea = 1 registro
      // formato: amount,txLast30d,avgDailyBalance,isForeign
      const lines = batchText
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const items = lines.map((line) => {
        const parts = line.split(",").map((p) => Number(p.trim()));
        if (parts.length !== 4 || parts.some((v) => Number.isNaN(v))) {
          throw new Error(
            `Línea inválida: "${line}". Debe tener 4 números separados por coma.`
          );
        }
        return parts;
      });

      const payload = { items };

      const res = await fetch(`${API_BASE}/predict-batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setBatchResult(data);
    } catch (err) {
      console.error(err);
      setBatchError(String(err));
    } finally {
      setBatchLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>FRR Plus – Demo Motor de Outliers</h1>
      <p style={{ marginBottom: "2rem", color: "#555" }}>
        Frontend de prueba para consumir los endpoints <code>/predict</code> y{" "}
        <code>/predict-batch</code> del servicio FastAPI.
      </p>

      {/* Sección /predict */}
      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h2>Predicción individual (/predict)</h2>
        <p style={{ color: "#666" }}>
          Ingresa un registro con 4 features:{" "}
          <code>amount, transactions_last_30d, avg_daily_balance, is_foreign</code>.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <div>
            <label>Monto (amount)</label>
            <input
              type="number"
              value={singleFeatures.amount}
              onChange={(e) => handleSingleChange("amount", e.target.value)}
              style={{ width: "100%", padding: "0.4rem", marginTop: "0.2rem" }}
            />
          </div>
          <div>
            <label>Transacciones últimos 30 días</label>
            <input
              type="number"
              value={singleFeatures.txLast30d}
              onChange={(e) => handleSingleChange("txLast30d", e.target.value)}
              style={{ width: "100%", padding: "0.4rem", marginTop: "0.2rem" }}
            />
          </div>
          <div>
            <label>Saldo promedio diario</label>
            <input
              type="number"
              value={singleFeatures.avgDailyBalance}
              onChange={(e) =>
                handleSingleChange("avgDailyBalance", e.target.value)
              }
              style={{ width: "100%", padding: "0.4rem", marginTop: "0.2rem" }}
            />
          </div>
          <div>
            <label>Es extranjero (0 = NO, 1 = SÍ)</label>
            <input
              type="number"
              value={singleFeatures.isForeign}
              onChange={(e) => handleSingleChange("isForeign", e.target.value)}
              style={{ width: "100%", padding: "0.4rem", marginTop: "0.2rem" }}
            />
          </div>
        </div>

        <button
          onClick={callSinglePredict}
          disabled={singleLoading}
          style={{
            marginTop: "1.5rem",
            padding: "0.6rem 1.4rem",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {singleLoading ? "Calculando..." : "Evaluar registro"}
        </button>

        {singleError && (
          <p style={{ color: "red", marginTop: "1rem" }}>Error: {singleError}</p>
        )}

        {singleResult && (
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              borderRadius: "8px",
              backgroundColor: singleResult.is_outlier ? "#ffe5e5" : "#e5ffe9",
            }}
          >
            <strong>
              Resultado:{" "}
              {singleResult.is_outlier ? "OUTLIER (sospechoso)" : "Normal"}
            </strong>
            <div>raw_label: {singleResult.raw_label}</div>
          </div>
        )}
      </section>

      {/* Sección /predict-batch */}
      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "1.5rem",
        }}
      >
        <h2>Predicción por lote (/predict-batch)</h2>
        <p style={{ color: "#666" }}>
          Cada línea representa un registro, con 4 valores separados por coma:
          <br />
          <code>amount, transactions_last_30d, avg_daily_balance, is_foreign</code>
        </p>

        <textarea
          value={batchText}
          onChange={(e) => setBatchText(e.target.value)}
          rows={6}
          style={{
            width: "100%",
            marginTop: "1rem",
            padding: "0.6rem",
            fontFamily: "monospace",
          }}
        />

        <button
          onClick={callBatchPredict}
          disabled={batchLoading}
          style={{
            marginTop: "1rem",
            padding: "0.6rem 1.4rem",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {batchLoading ? "Calculando..." : "Evaluar lote"}
        </button>

        {batchError && (
          <p style={{ color: "red", marginTop: "1rem" }}>Error: {batchError}</p>
        )}

        {batchResult && (
          <div style={{ marginTop: "1.5rem" }}>
            <div style={{ marginBottom: "0.5rem" }}>
              Registros evaluados: <strong>{batchResult.count}</strong>
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.9rem",
              }}
            >
              <thead>
                <tr>
                  <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "0.4rem" }}>
                    #
                  </th>
                  <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "0.4rem" }}>
                    Features
                  </th>
                  <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "0.4rem" }}>
                    is_outlier
                  </th>
                  <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "0.4rem" }}>
                    raw_label
                  </th>
                </tr>
              </thead>
              <tbody>
                {batchResult.results.map((item) => (
                  <tr
                    key={item.index}
                    style={{
                      backgroundColor: item.is_outlier ? "#ffecec" : "white",
                    }}
                  >
                    <td style={{ padding: "0.4rem", borderBottom: "1px solid #eee" }}>
                      {item.index}
                    </td>
                    <td style={{ padding: "0.4rem", borderBottom: "1px solid #eee", fontFamily: "monospace" }}>
                      [{item.features.join(", ")}]
                    </td>
                    <td style={{ padding: "0.4rem", borderBottom: "1px solid #eee" }}>
                      {item.is_outlier ? "True" : "False"}
                    </td>
                    <td style={{ padding: "0.4rem", borderBottom: "1px solid #eee" }}>
                      {item.raw_label}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
