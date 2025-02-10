# Shetkari Sahayak - Crop Disease Detection

## 🌿 Overview
Shetkari Sahayak is an AI-powered crop disease detection system that helps farmers identify diseases in plants early and receive treatment recommendations. The platform integrates geospatial visualization, offline functionality, multi-language support, and educational resources to enhance agricultural productivity.

## 🚀 Features
- **AI-Powered Disease Detection**: Uses ResNet-50 with transfer learning to classify crop diseases.
- **Geospatial Visualization**: Maps disease occurrences to highlight regional risks.
- **Offline Support**: Enables farmers to diagnose diseases even without an internet connection.
- **Multi-Language Support**: Ensures accessibility across diverse regions.
- **Expert Advice & Education**: Provides treatment suggestions, farming tips, and government schemes.
- **Weather & Market Insights**: Includes weather forecasting and recommendations.

## 🛠️ Technology Stack
- **Preprocessing**: PIL, NumPy, Pandas
- **Deep Learning Model**: ResNet-50 (TensorFlow, Keras, PyTorch)
- **Backend**: Flask, MongoDB
- **Frontend**: React.js, Tailwind CSS
- **Deployment**: AWS
<!--
## 📌 Installation & Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/shetkari-sahayak.git
   cd shetkari-sahayak
   ```
2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   cd frontend && npm install
   ```
3. Start the backend:
   ```bash
   cd backend
   python app.py
   ```
4. Start the frontend:
   ```bash
   cd frontend
   npm start
   ```
-->
## 📷 Usage
1. Upload an image of the affected crop.
2. The AI model detects the disease and provides a diagnosis.
3. Receive treatment recommendations and preventive measures.
4. Explore geospatial disease maps for regional insights.
5. Access educational resources and government schemes.

## 🛡️ Challenges & Solutions
| Challenge | Solution |
|-----------|----------|
| Model Generalization | Built localized data pipelines with real-world farmer data |
| Internet Dependency | Integrated TensorFlow Lite for offline support |
| Farmer Adoption | Designed a simple UI with interactive tutorials |

## 🔗 Live Demo
Check out the deployed prototype: [Shetkari Sahayak](https://shetkarisahayak.onrender.com/)

## 🤝 Contributing
Contributions are welcome! Feel free to submit issues and pull requests.

## 📜 License
This project is licensed under the MIT License.

---
**Team Name**: Team Shourya  
**Project Lead**: Shubham Pawade
