# InvisiHide - Secure Steganography Web Application

## 🔍 **Project Overview**

InvisiHide is a web application designed for secure steganography, allowing users to embed and extract hidden text or images within cover images. The project ensures data privacy with password protection and a user-friendly interface. Built using React.js for the frontend and Python Flask for the backend, InvisiHide leverages OpenCV for image processing and NumPy for efficient data handling.

---

## 🚀 **Features**

- 🔐 Password-protected embedding and extraction.
- 🖼️ Embed images within images.
- 📝 Embed text into images securely.
- 🧩 Extract hidden text or images with the correct password.
- 📂 Downloadable stego images and extracted content.
- ⚡ Real-time process feedback and error handling.
- 💡 Clean and intuitive user interface.

---

## 💻 **Technologies Used**

### Frontend:

- **React.js** – For building the user interface.
- **Axios** – For HTTP requests.
- **CSS** – For responsive UI design.

### Backend:

- **Python Flask** – Server-side operations.
- **OpenCV (cv2)** – Image processing.
- **NumPy** – Efficient array handling.
- **Werkzeug** – Secure file handling.
- **Flask-CORS** – Cross-Origin Resource Sharing.

---

## ⚙️ **Installation and Setup**

### Backend (Python Flask):

1. Clone the repository:
   ```bash
   git clone https://github.com/pavanmahi/Invisi_Hide
   cd InvisiHide
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Flask server:
   ```bash
   python app.py
   ```

### Frontend (React.js):

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React server:
   ```bash
   npm start
   ```

The application will be accessible at `http://localhost:3000` with the Flask backend running on `http://localhost:5000`.

---

## 🛠️ **How to Use**

### 🔒 **Embedding Data**

1. Select **Embed Image in Image** or **Embed Text in Image**.
2. Upload the cover image and hidden content.
3. Enter a password.
4. Click **Embed** to generate and download the stego image.

### 🔍 **Extracting Data**

1. Select **Extract Hidden Data**.
2. Upload the stego image.
3. Enter the correct password.
4. Download the extracted content after processing.

---

## 🎯 **Unique Features (WOW Factors)**

- Comprehensive password protection.
- Real-time feedback during processes.
- Dual-mode steganography (text and image).
- Error handling for incorrect passwords and corrupted files.

---

## 📂 **requirements.txt**

```
Flask==2.0.1
Flask-Cors==3.0.10
numpy==1.21.0
opencv-python==4.5.2.54
Werkzeug==2.0.1
```

---

## 📞 **Contact**

For queries or contributions:

- 📧 Email: [pavanbejawada4376@gmail.com](mailto:pavanbejawada4376@gmail.com)
- 🌐 GitHub: [pavanmahi](https://github.com/pavanmahi)

---

### 🚀 *InvisiHide: Where Security Meets Simplicity!*

