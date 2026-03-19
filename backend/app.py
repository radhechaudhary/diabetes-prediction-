from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask("__name__")
CORS(app)

models = {
    "logistic": joblib.load("./models/logistic.pkl"),
    "random_forest": joblib.load("./models/rf.pkl"),
    "svm": joblib.load("./models/svm.pkl"),
    "knn": joblib.load("./models/knn.pkl"),
    "naive_bayes": joblib.load("./models/nb.pkl"),
    "ada": joblib.load("./models/ada.pkl"),
    # "ann": joblib.load("./models/ann.pkl")
}

@app.route('/predict', methods=["POST"])
def getPrediction():
    data = request.get_json()

    model_name = data.get("model")
    input_data = data.get("data")

    # Convert to DataFrame
    df = pd.DataFrame([input_data], columns=[
        "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
        "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"
    ])

    # Get model
    model = models.get(model_name)

    if model is None:
        return jsonify({"error": "Invalid model selected"}), 400

    # Predict
    prediction = model.predict(df)

    # Convert to normal Python type
    if int(prediction[0]) == 0:
        prediction = "No Diabetes"
    else:
        prediction = "Diabetes"

    return jsonify({
        "prediction": prediction
    })
if __name__ == "__main__":
    app.run(debug=True)