# FRR Plus – Anomaly Detection Engine

Motor de detección de anomalías (outliers) para FRR Plus, orientado a **calidad de datos, riesgos operativos y validación de reportes regulatorios**, utilizando **Machine Learning clásico (scikit-learn)**, **FastAPI** y un **frontend React** de demostración.

Este proyecto representa un **módulo funcional del producto FRR Plus**, específicamente el **Anomaly Dashboard**.

---

## 🎯 Propósito del módulo

El **Anomaly Detection Engine** permite:

- Detectar **registros atípicos** en datos financieros y regulatorios.
- Identificar **inconsistencias** antes de enviar reportes a entes reguladores.
- Apoyar áreas de:
  - Riesgo Operacional
  - Cumplimiento
  - Data Quality
  - Reporting Regulatorio

Este motor está diseñado para integrarse como **microservicio de IA** dentro de la arquitectura de FRR Plus.

---

## 🧠 Enfoque técnico

- **Tipo de modelos**:  
  - No supervisados (Isolation Forest)
- **Casos de uso**:
  - Detección de outliers en montos, saldos, ratios y métricas de reportes
  - Evaluación individual y por lotes
- **Arquitectura**:
  - Microservicio Python especializado en ML
  - Backend desacoplado del frontend
  - Integrable vía API REST

---

## 🏗️ Arquitectura (alto nivel)

