# service/app.py

from typing import List

from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from ml.inference import predict_outlier, predict_outliers


app = FastAPI(
    title="FRRPlus Anomaly Detection Demo",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class TransactionInput(BaseModel):
    # 4 features: amount, transactions_last_30d, avg_daily_balance, is_foreign
    features: List[float] = Field(..., min_length=4, max_length=4)


class BatchInput(BaseModel):
    # lista de registros, cada uno con 4 features
    items: List[List[float]] = Field(..., min_length=1)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(transaction: TransactionInput):
    result = predict_outlier(transaction.features)
    return {
        "is_outlier": True if result == -1 else False,
        "raw_label": result,
    }


@app.post("/predict-batch")
def predict_batch(batch: BatchInput):
    labels = predict_outliers(batch.items)

    # armamos una respuesta amigable
    results = []
    for idx, label in enumerate(labels):
        results.append(
            {
                "index": idx,
                "is_outlier": True if label == -1 else False,
                "raw_label": label,
                "features": batch.items[idx],
            }
        )

    return {"count": len(results), "results": results}
