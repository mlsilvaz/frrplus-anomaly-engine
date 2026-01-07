# ml/inference.py

import os
import joblib
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "anomaly_model.pkl")

_model = None


def get_model():
    global _model
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"Model not found  {MODEL_PATH}. "
                f"Execute first ml/train_model.py"
            )
        _model = joblib.load(MODEL_PATH)
    return _model


def predict_outlier(record: list[int | float]) -> int:
    """
    record: lista tipo [amount, transactions_last_30d, avg_daily_balance, is_foreign]
    return: 1 = normal, -1 = outlier (igual que IsolationForest)
    """
    model = get_model()
    x = np.array(record).reshape(1, -1)
    pred = model.predict(x)[0]
    return int(pred)


def predict_outliers(records: list[list[float]]) -> list[int]:
    """
    records: lista de registros, cada uno: [amount, transactions_last_30d, avg_daily_balance, is_foreign]
    return: lista de etiquetas (1 = normal, -1 = outlier)
    """
    model = get_model()
    x = np.array(records)
    preds = model.predict(x)
    return [int(p) for p in preds]
