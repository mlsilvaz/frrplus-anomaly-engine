# ml/train_model.py

import os
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import joblib

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "transactions_sample.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")
MODEL_PATH = os.path.join(MODELS_DIR, "anomaly_model.pkl")


def load_data():
    df = pd.read_csv(DATA_PATH)
    return df


def train_and_save_model():
    df = load_data()

    # Usamos todas las columnas numéricas como features
    X = df.values

    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("model", IsolationForest(
            n_estimators=100,
            contamination=0.1,
            random_state=42
        ))
    ])

    pipeline.fit(X)

    os.makedirs(MODELS_DIR, exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH)
    print(f"Modelo guardado en: {MODEL_PATH}")


if __name__ == "__main__":
    train_and_save_model()
