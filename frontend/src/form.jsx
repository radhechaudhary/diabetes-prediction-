import React, { useState } from "react";
import axios from "axios";

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    Pregnancies: "",
    Glucose: "",
    BloodPressure: "",
    SkinThickness: "",
    Insulin: "",
    BMI: "",
    DiabetesPedigreeFunction: "",
    Age: ""
  });

  const [model, setModel] = useState("logistic");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:5000/predict", {
        model,
        data: Object.values(formData).map(Number)
      });

      setResult(res.data.prediction);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          ML Prediction System
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Inputs */}
          {Object.keys(formData).map((key, index) => (
            <input
              key={index}
              type="number"
              name={key}
              placeholder={`Enter ${key}`}
              value={formData[key]}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          ))}

          {/* Dropdown */}
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="logistic">Logistic Regression</option>
            <option value="random_forest">Random Forest</option>
            <option value="svm">SVM</option>
            <option value="knn">KNN</option>
            <option value="naive_bayes">Naive Bayes</option>
            <option value="ann">ANN</option>
            <option value="ada">ada</option>
          </select>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
        </form>

        {/* Result */}
        {result !== null && (
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold text-gray-700">Prediction:</p>
            <p className="text-2xl font-bold text-green-600">{result}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default PredictionForm;