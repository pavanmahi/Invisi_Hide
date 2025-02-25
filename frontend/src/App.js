import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [activeForm, setActiveForm] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [hiddenImage, setHiddenImage] = useState(null);
    const [hiddenText, setHiddenText] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [stegoImageUrl, setStegoImageUrl] = useState(null);
    const [extractedData, setExtractedData] = useState(null);
    const [extractedType, setExtractedType] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [showExtractedData, setShowExtractedData] = useState(false);
    const [instructionText, setInstructionText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event, setFile) => {
        setFile(event.target.files[0]);
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const clearInputsOutputs = () => {
        setCoverImage(null);
        setHiddenImage(null);
        setHiddenText('');
        setPassword('');
        setStegoImageUrl(null);
        setExtractedData(null);
        setExtractedType('');
        setShowPopup(false);
        setPopupMessage('');
        setInstructionText('');
        setIsLoading(false);
    };

    const handleSubmitImage = async (event) => {
        event.preventDefault();

        if (!coverImage || !hiddenImage) {
            setShowPopup(true);
            setPopupMessage('Please select both cover and hidden images.');
            return;
        }
        if (!password) {
            setShowPopup(true);
            setPopupMessage('Please enter a password.');
            return;
        }

        setInstructionText('Please wait while we embed the image in the cover image...');
        setIsLoading(true);

        const formData = new FormData();
        formData.append('cover_image', coverImage);
        formData.append('hidden_image', hiddenImage);
        formData.append('password', password);

        try {
            const response = await axios.post('/embed_image', formData, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            setStegoImageUrl(url);
            setInstructionText('');
            setIsLoading(false);
        } catch (error) {
            console.error('Error embedding image:', error);
            setInstructionText('');
            setIsLoading(false);
        }
    };

    const handleSubmitText = async (event) => {
        event.preventDefault();

        if (!coverImage || !hiddenText) {
            setShowPopup(true);
            setPopupMessage("Please upload the cover image and enter the hidden text.");
            return;
        }
        if (!password) {
            setShowPopup(true);
            setPopupMessage('Please enter a password.');
            return;
        }

        setInstructionText('Please wait while we embed the text in the cover image...');
        setIsLoading(true);

        const formData = new FormData();
        formData.append('cover_image', coverImage);
        formData.append('hidden_text', hiddenText);
        formData.append('password', password);

        try {
            const response = await axios.post('/embed_text', formData, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            setStegoImageUrl(url);
            setInstructionText('');
            setIsLoading(false);
        } catch (error) {
            console.error('Error embedding text:', error);
            setInstructionText('');
            setIsLoading(false);
        }
    };

    const handleExtract = async (event) => {
        event.preventDefault();
        console.log("Starting extraction process...");
        if (!coverImage) {
            setShowPopup(true);
            setPopupMessage('Please upload the stego image.');
            return;
        }
    
        if (!password) {
            setShowPopup(true);
            setPopupMessage('Please enter a password.');
            return;
        }
        setShowPopup(false);
        const formData = new FormData();
        formData.append('stego_image', coverImage);
        formData.append('password', password);
    
        try {
            console.log("📡 Sending request to backend...");
            const response = await axios.post('https://invisihide.onrender.com/extract', formData, { responseType: 'blob' });
            console.log("✅ Response received:", response);

            const url = window.URL.createObjectURL(new Blob([response.data]));
            setExtractedType(response.headers['content-type']);
            setExtractedData(url);
            setShowExtractedData(true);
            console.log("🎉 Extraction successful. Data ready for display.");
        } catch (error) {
            console.error('Error extracting data:', error);
    
            if (error.response && error.response.status === 400) {
                setPopupMessage('Incorrect password. Please try again.');
                setShowPopup(true);
                setExtractedData(null);
                setExtractedType(null);
                setShowExtractedData(false);
                console.error("Password error", error);
            } else {
                console.error("❌ Error from backend:", error);
                setPopupMessage('Server Error. Please try again later.');
                setShowPopup(true);
            }
        }
    };

    const closePopup = () => {
        setShowPopup(false);
        setPopupMessage('');
        setInstructionText('');
        setIsLoading(false);
    };

    const downloadFile = (url, filename) => {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="container">
            <h1>InvisiHide - Secure Steganography</h1>
            <div className="feature-buttons">
                <button onClick={() => { setActiveForm('embedImage'); clearInputsOutputs(); }}>
                    Embed Image in Image
                </button>
                <button onClick={() => { setActiveForm('embedText'); clearInputsOutputs(); }}>
                    Embed Text in Image
                </button>
                <button onClick={() => { setActiveForm('extract'); clearInputsOutputs(); }}>
                    Extract Hidden Data
                </button>
            </div>

            {activeForm === 'embedImage' && (
                <form onSubmit={handleSubmitImage}>
                    <h2>Embed Image in Image</h2>
                    <label htmlFor="coverImage">Upload cover Image</label>
                    <input type="file" accept="image/*" id="CoverImage" onChange={(e) => handleFileChange(e, setCoverImage)} required />
                    <label htmlFor="hiddenImage">Upload Secret Image</label>
                    <input type="file" accept="image/*" id="hiddenImage" onChange={(e) => handleFileChange(e, setHiddenImage)} required />
                    <div className="password-container">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span className="toggle-password" onClick={togglePasswordVisibility}>
                            {passwordVisible ? "👁" : "👁‍🗨"}
                        </span>
                    </div>
                    <button type="submit">Embed</button>
                    {isLoading && <p>{instructionText}</p>}
                </form>
            )}

            {activeForm === 'embedText' && (
                <form onSubmit={handleSubmitText}>
                    <h2>Embed Text in Image</h2>
                    <label htmlFor="coverImage">Upload Cover Image</label>
                    <input type="file" accept="image/*" id="coverImage" onChange={(e) => handleFileChange(e, setCoverImage)} required />
                    <textarea placeholder="Hidden Text" value={hiddenText} onChange={(e) => setHiddenText(e.target.value)} required />
                    <div className="password-container">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span className="toggle-password" onClick={togglePasswordVisibility}>
                            {passwordVisible ? "👁" : "👁‍🗨"}
                        </span>
                    </div>
                    <button type="submit">Embed</button>
                    {isLoading && <p>{instructionText}</p>}
                </form>
            )}

            {activeForm === 'extract' && (
                <form onSubmit={handleExtract}>
                    <h2>Extract Hidden Data</h2>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setCoverImage)} placeholder="Choose stego image" required />
                    <div className="password-container">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span className="toggle-password" onClick={togglePasswordVisibility}>
                            {passwordVisible ? "👁" : "👁‍🗨"}
                        </span>
                    </div>
                    <button type="submit">Extract</button>
                    {isLoading && <p>{instructionText}</p>}
                </form>
            )}

            {stegoImageUrl && (
                <div className="stego-image-container">
                    <h2>Stego Image</h2>
                    <div className="image-wrapper">
                        <img src={stegoImageUrl} alt="Stego Image" className="uniform-image" />
                        <button onClick={() => downloadFile(stegoImageUrl, 'stego_image.png')} className="download-button">Download</button>
                    </div>
                </div>
            )}

            {showExtractedData && extractedData && extractedType && (
                <div className="extracted-data">
                    {extractedType.includes('image') ? (
                        <div className="image-wrapper">
                            <img src={extractedData} alt="Extracted" className="uniform-image" />
                            <button onClick={() => downloadFile(extractedData, 'hidden_image.png')} className="download-button">Download</button>
                        </div>
                    ) : (
                        <a href={extractedData} className="download-button" download="hidden_text.txt">Download Extracted Text</a>
                    )}
                </div>
            )}

            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close-popup" onClick={closePopup}>&times;</span>
                        <p>{popupMessage}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;