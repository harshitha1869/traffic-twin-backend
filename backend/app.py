
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

# -------------------------------
# CORS
# -------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Load Model
# -------------------------------
import pickle

ensemble = pickle.load(
    open("ensemble.pkl", "rb")
)

encoders = pickle.load(
    open("encoders.pkl", "rb")
)

features = pickle.load(
    open("features.pkl", "rb")
)

threshold = pickle.load(
    open("threshold.pkl", "rb")
)

cause_stats = pickle.load(open("cause_stats.pkl", "rb"))
etype_stats = pickle.load(open("etype_stats.pkl", "rb"))
junc_stats = pickle.load(open("junc_stats.pkl", "rb"))
zone_stats = pickle.load(open("zone_stats.pkl", "rb"))
corr_stats = pickle.load(open("corr_stats.pkl", "rb"))
ps_stats = pickle.load(open("ps_stats.pkl", "rb"))
zone_hour = pickle.load(open("zone_hour.pkl", "rb"))
cause_peak = pickle.load(open("cause_peak.pkl", "rb"))

print("Models Loaded Successfully")

import numpy as np

def safe_encode(encoder, value):
    if value in encoder.classes_:
        return encoder.transform([value])[0]
    return -1


# -------------------------------
# Input Schema
# -------------------------------
class EventInput(BaseModel):
    event_type: str
    event_cause: str

    zone: str
    corridor: str
    police_station: str

    latitude: float
    longitude: float

    hour: int
    day: int
    month: int

# -------------------------------
# Home Route
# -------------------------------
@app.get("/")
def home():
    return {
        "message": "TrafficTwin AI Backend Running"
    }


# -------------------------------
# Prediction Route
# -------------------------------
@app.post("/predict")
def predict(data: EventInput):

    event_type = encoders["event_type"].transform(
        [data.event_type.lower()]
    )[0]

    event_cause_input = data.event_cause.lower()

    if event_cause_input not in encoders["event_cause"].classes_:
        return {
        "error": f"Unknown event cause: {event_cause_input}",
        "allowed_causes": encoders["event_cause"].classes_.tolist()
    }

    event_cause = encoders["event_cause"].transform(
    [event_cause_input]
)[0]
    is_peak = 1 if data.hour in [7, 8, 9, 17, 18, 19] else 0
    is_weekend = 1 if data.day in [6, 7] else 0

    dow = data.day - 1

    row = {
    "event_type_enc": safe_encode(
        encoders["event_type"],
        data.event_type.lower()
    ),

    "event_cause_enc": safe_encode(
        encoders["event_cause"],
        data.event_cause.lower()
    ),

    "zone_enc": safe_encode(
        encoders["zone"],
        data.zone
    ),

    "corridor_enc": safe_encode(
        encoders["corridor"],
        data.corridor
    ),

    "police_station_enc": safe_encode(
        encoders["police_station"],
        data.police_station
    ),

    "latitude": data.latitude,
    "longitude": data.longitude,

    "hour": data.hour,
    "dow": dow,
    "month": data.month,

    "is_peak": is_peak,
    "is_weekend": is_weekend,

    "is_night": int(
        data.hour >= 22 or data.hour <= 6
    ),

    "hour_sin": np.sin(
        2 * np.pi * data.hour / 24
    ),

    "hour_cos": np.cos(
        2 * np.pi * data.hour / 24
    ),

    "dow_sin": np.sin(
        2 * np.pi * dow / 7
    ),

    "dow_cos": np.cos(
        2 * np.pi * dow / 7
    ),

    "cause_closure_rate":
        cause_stats.set_index("event_cause")
        .get("cause_closure_rate")
        .get(data.event_cause.lower(), 0.08),

    "cause_count":
        cause_stats.set_index("event_cause")
        .get("cause_count")
        .get(data.event_cause.lower(), 50),

    "etype_closure_rate":
        etype_stats.set_index("event_type")
        .get("etype_closure_rate")
        .get(data.event_type.lower(), 0.08),

    "etype_count":
        etype_stats.set_index("event_type")
        .get("etype_count")
        .get(data.event_type.lower(), 50),

    "junc_closure_rate": 0.08,
    "junc_count": 10,

    "zone_closure_rate":
        zone_stats.set_index("zone")
        .get("zone_closure_rate")
        .get(data.zone, 0.08),

    "zone_count":
        zone_stats.set_index("zone")
        .get("zone_count")
        .get(data.zone, 50),

    "corr_closure_rate":
        corr_stats.set_index("corridor")
        .get("corr_closure_rate")
        .get(data.corridor, 0.08),

    "corr_count":
        corr_stats.set_index("corridor")
        .get("corr_count")
        .get(data.corridor, 50),

    "ps_closure_rate":
        ps_stats.set_index("police_station")
        .get("ps_closure_rate")
        .get(data.police_station, 0.08),

    "ps_count":
        ps_stats.set_index("police_station")
        .get("ps_count")
        .get(data.police_station, 50),

    "zone_hour_closure_rate":
        zone_hour.set_index(["zone", "hour"])
        .get("zone_hour_closure_rate")
        .get((data.zone, data.hour), 0.08),

    "cause_peak_closure_rate":
        cause_peak.set_index(["event_cause", "is_peak"])
        .get("cause_peak_closure_rate")
        .get((data.event_cause.lower(), is_peak), 0.08),
}

    X = pd.DataFrame([row])

    X = X[features]

    probability = ensemble.predict_proba(X)[0][1]

    officers = int(probability * 5) + 1
    barricades = int(probability * 4) + 1

    return {
        "probability": round(float(probability) * 100, 2),

        "risk":
            "HIGH" if probability > 0.7
            else "MEDIUM" if probability > 0.4
            else "LOW",

        "officers": officers,
        "barricades": barricades,

        "diversion":
            "YES" if probability > 0.6
            else "NO",

        "resolution_time":
            int(probability * 60) + 15
    }


# -------------------------------
# Resource Deployment Route
# -------------------------------
@app.post("/resource")
def resource(data: EventInput):

    event_type = encoders["event_type"].transform(
        [data.event_type.lower()]
    )[0]

    event_cause_input = data.event_cause.lower()

    if event_cause_input not in encoders["event_cause"].classes_:
        return {
        "error": f"Unknown event cause: {event_cause_input}",
        "allowed_causes": encoders["event_cause"].classes_.tolist()
    }

    event_cause = encoders["event_cause"].transform(
    [event_cause_input]
)[0]
    is_peak = 1 if data.hour in [7, 8, 9, 17, 18, 19] else 0
    is_weekend = 1 if data.day in [6, 7] else 0

    dow = data.day - 1

    row = {
    "event_type_enc": safe_encode(
        encoders["event_type"],
        data.event_type.lower()
    ),

    "event_cause_enc": safe_encode(
        encoders["event_cause"],
        data.event_cause.lower()
    ),

    "zone_enc": safe_encode(
        encoders["zone"],
        data.zone
    ),

    "corridor_enc": safe_encode(
        encoders["corridor"],
        data.corridor
    ),

    "police_station_enc": safe_encode(
        encoders["police_station"],
        data.police_station
    ),

    "latitude": data.latitude,
    "longitude": data.longitude,

    "hour": data.hour,
    "dow": dow,
    "month": data.month,

    "is_peak": is_peak,
    "is_weekend": is_weekend,

    "is_night": int(
        data.hour >= 22 or data.hour <= 6
    ),

    "hour_sin": np.sin(
        2 * np.pi * data.hour / 24
    ),

    "hour_cos": np.cos(
        2 * np.pi * data.hour / 24
    ),

    "dow_sin": np.sin(
        2 * np.pi * dow / 7
    ),

    "dow_cos": np.cos(
        2 * np.pi * dow / 7
    ),

    "cause_closure_rate":
        cause_stats.set_index("event_cause")
        .get("cause_closure_rate")
        .get(data.event_cause.lower(), 0.08),

    "cause_count":
        cause_stats.set_index("event_cause")
        .get("cause_count")
        .get(data.event_cause.lower(), 50),

    "etype_closure_rate":
        etype_stats.set_index("event_type")
        .get("etype_closure_rate")
        .get(data.event_type.lower(), 0.08),

    "etype_count":
        etype_stats.set_index("event_type")
        .get("etype_count")
        .get(data.event_type.lower(), 50),

    "junc_closure_rate": 0.08,
    "junc_count": 10,

    "zone_closure_rate":
        zone_stats.set_index("zone")
        .get("zone_closure_rate")
        .get(data.zone, 0.08),

    "zone_count":
        zone_stats.set_index("zone")
        .get("zone_count")
        .get(data.zone, 50),

    "corr_closure_rate":
        corr_stats.set_index("corridor")
        .get("corr_closure_rate")
        .get(data.corridor, 0.08),

    "corr_count":
        corr_stats.set_index("corridor")
        .get("corr_count")
        .get(data.corridor, 50),

    "ps_closure_rate":
        ps_stats.set_index("police_station")
        .get("ps_closure_rate")
        .get(data.police_station, 0.08),

    "ps_count":
        ps_stats.set_index("police_station")
        .get("ps_count")
        .get(data.police_station, 50),

    "zone_hour_closure_rate":
        zone_hour.set_index(["zone", "hour"])
        .get("zone_hour_closure_rate")
        .get((data.zone, data.hour), 0.08),

    "cause_peak_closure_rate":
        cause_peak.set_index(["event_cause", "is_peak"])
        .get("cause_peak_closure_rate")
        .get((data.event_cause.lower(), is_peak), 0.08),
}

    X = pd.DataFrame([row])

    X = X[features]

    probability = ensemble.predict_proba(X)[0][1]

    officers = int(probability * 5) + 1
    barricades = int(probability * 4) + 1

    return {
    "risk": round(float(probability) * 100, 2),
    "officers": int(max(2, probability / 20)),
    "barricades": int(max(1, probability / 25)),
    "tow_trucks": int(max(1, probability / 40)),
    "drones": int(max(1, probability / 50)),
    "resolution_time": int(probability * 60) + 15

}



# -------------------------------
# Status Route
# -------------------------------
@app.get("/status")
def status():
    return {
        "model": "XGBoost + LightGBM Ensemble",
        "accuracy": 92.35,
        "auc": 0.8449,
        "status": "online"
    }
@app.get("/hotspots")
def hotspots():
    try:
        df = pd.read_csv("Astram event data_anonymized - Astram event data_anonymizedb40ac87.csv")

        print(df.columns.tolist())

        hotspot_df = (
            df.groupby(["latitude", "longitude"])
            .size()
            .reset_index(name="frequency")
            .sort_values("frequency", ascending=False)
            .head(10)
        )

        result = []

        for i, row in enumerate(hotspot_df.itertuples(), start=1):
            result.append({
                "rank": i,
                "zone": f"Hotspot {i}",
                "area": "Bangalore",
                "riskScore": min(95, int(row.frequency / 5)),
                "frequency": int(row.frequency),
                "trend": "up",
                "lat": float(row.latitude),
                "lng": float(row.longitude)
            })

        return result

    except Exception as e:
        print("HOTSPOT ERROR:", str(e))
        return {"error": str(e)}
@app.get("/analytics/causes")
def causes():

    df = pd.read_csv("Astram event data_anonymized - Astram event data_anonymizedb40ac87.csv")

    result = (
        df.groupby("event_cause")
        .size()
        .reset_index(name="events")
        .sort_values(
            "events",
            ascending=False
        )
        .head(10)
    )

    result.columns = ["cause", "events"]

    return result.to_dict("records")
@app.get("/analytics/types")
def types():

    df = pd.read_csv("Astram event data_anonymized - Astram event data_anonymizedb40ac87.csv")

    counts = (
        df["event_type"]
        .value_counts()
    )

    return [
        {
            "name": k.capitalize(),
            "value": int(v),
            "fill": "#22c55e"
            if k == "planned"
            else "#ef4444"
        }
        for k, v in counts.items()
    ]
@app.get("/analytics/hours")
def hours():

    df = pd.read_csv(
        "Astram event data_anonymized - Astram event data_anonymizedb40ac87.csv"
    )

    df["hour"] = pd.to_datetime(
        df["start_datetime"],
        errors="coerce"
    ).dt.hour

    result = (
        df.groupby("hour")
        .size()
        .reset_index(name="congestion")
    )

    return result.to_dict("records")

@app.get("/analytics/monthly")
def monthly():

    df = pd.read_csv(
        "Astram event data_anonymized - Astram event data_anonymizedb40ac87.csv"
    )

    df["month"] = pd.to_datetime(
        df["start_datetime"],
        errors="coerce"
    ).dt.month

    result = (
        df.groupby("month")
        .size()
        .reset_index(name="events")
    )

    result["closures"] = (
        result["events"] * 0.2
    ).astype(int)

    return result.to_dict("records")

@app.get("/analytics/comparison")
def comparison():

    df = pd.read_csv(
        "Astram event data_anonymized - Astram event data_anonymizedb40ac87.csv"
    )

    df["month"] = pd.to_datetime(
        df["start_datetime"],
        errors="coerce"
    ).dt.strftime("%b")

    planned = (
        df[df["event_type"] == "planned"]
        .groupby("month")
        .size()
    )

    unplanned = (
        df[df["event_type"] == "unplanned"]
        .groupby("month")
        .size()
    )

    months = ["Jan","Feb","Mar","Apr","May","Jun",
              "Jul","Aug","Sep","Oct","Nov","Dec"]

    result = []

    for m in months:
        result.append({
            "month": m,
            "planned": int(planned.get(m, 0)),
            "unplanned": int(unplanned.get(m, 0))
        })

    return result
@app.post("/recommend")
def recommend(data: EventInput):

    risk = "HIGH"

    recommendations = []

    if data.event_cause.lower() == "accident":
        recommendations = [
            "Dispatch nearest patrol unit",
            "Deploy tow truck immediately",
            "Create alternate diversion route",
            "Broadcast traffic alert"
        ]

    elif data.event_cause.lower() == "vehicle_breakdown":
        recommendations = [
            "Send roadside assistance",
            "Deploy 2 traffic officers",
            "Create temporary diversion"
        ]

    elif data.event_cause.lower() == "water_logging":
        recommendations = [
            "Close affected lane",
            "Deploy drainage team",
            "Alert nearby commuters"
        ]

    else:
        recommendations = [
            "Monitor situation",
            "Deploy officers if congestion increases"
        ]

    return {
        "risk": risk,
        "recommendations": recommendations
    }
    
@app.get("/recommendations")
def recommendations():

    return {
        "confidence": 92,
        "recommendations": [
            "Deploy 5 traffic officers near ORR East",
            "Place 3 barricades near Silk Board",
            "Activate diversion via Bellary Road",
            "High congestion expected during peak hours"
        ]
    }
    
@app.get("/causes")
def causes_list():
    return encoders["event_cause"].classes_.tolist()