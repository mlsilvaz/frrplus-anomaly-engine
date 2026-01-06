FROM python:3.11-slim

WORKDIR /app

# Copiamos requirements e instalamos dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el resto del código
COPY . .

# Exponer puerto del servicio
EXPOSE 8000

# Comando de arranque
CMD ["uvicorn", "service.app:app", "--host", "0.0.0.0", "--port", "8000"]
