import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import mailIcon from "./assets/mail.png";
import githubIcon from "./assets/github.png";
import linkedinIcon from "./assets/in.png";
import twitterIcon from "./assets/x.png";
import instaIcon from "./assets/insta.jpeg";

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
            const response = await axios.post('https://invisihide.onrender.com/embed_image', formData, { responseType: 'blob' });
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
            const response = await axios.post('https://invisihide.onrender.com/embed_text', formData, { responseType: 'blob' });
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
            const response = await axios.post('https://invisihide.onrender.com/extract', formData, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            setExtractedType(response.headers['content-type']);
            setExtractedData(url);
            setShowExtractedData(true);
        } catch (error) {
            console.error('Error extracting data:', error);
    
            if (error.response && error.response.status === 400) {
                setPopupMessage('Incorrect password. Please try again.');
                setShowPopup(true);
                setExtractedData(null);
                setExtractedType(null);
                setShowExtractedData(false);
            } else {
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
        <div className="app-container">
            <header className="app-header">
                <div className="container-header">
                    <h1>InvisiHide</h1>
                    <nav>
                        <ul className="nav-links">
                            <li class="about-li"><a href="#about">About Us</a></li>
                            <li><a href="#steganography">Steganography</a></li>
                            <li><a href="#contact">Contact</a></li>

                        </ul>
                    </nav>
                </div>
            </header>

            <section id="about" className="about-section">
                <div className="about-container">
                    <h2 className="about-title">
                        About <span className="highlight">InvisiHide</span>
                    </h2>
                    <div class="about-box">
                        <p className="about-description">
                        <strong>InvisiHide</strong> is a secure and intuitive web application that allows users to embed text and images within other images, 
                        ensuring sensitive data remains hidden and protected. With its streamlined design and powerful features, InvisiHide makes 
                        steganography accessible for everyone—no technical expertise required.
                        </p>
                        <p className="about-sub-description">
                            Designed for both personal privacy and professional needs, the platform offers a fast, reliable, and secure experience with 
                            password-protected embedding, instant extraction, and effortless downloads—all wrapped in a clean, responsive interface.
                        </p>
                    </div>
                    <main id="steganography" className="main-container">
                        <div className="content-box">
                            <h2 className="section-title">Secure Steganography</h2>
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
                                    <h3>Embed Image in Image</h3>
                                    <label htmlFor="coverImage">Upload Cover Image</label>
                                    <input type="file" accept="image/*" id="coverImage" onChange={(e) => handleFileChange(e, setCoverImage)} required />
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
                                    <h3>Embed Text in Image</h3>
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
                                    <h3>Extract Hidden Data</h3>
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
                                    <h3 style={{ color: 'white' }}>Stego Image</h3>
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
                    </main>
                    <h3 className="features-heading">✨ Key Features:</h3>
                    <ul className="features-list">
                        <li>✅ <strong>Secure Embedding:</strong> Conceal text and images effortlessly within cover images.</li>
                        <li>🔒 <strong>Password Protection:</strong> Allow access only to authorized users.</li>
                        <li>⚡ <strong>Real-Time Extraction:</strong> Retrieve hidden data instantly with real-time feedback.</li>
                        <li>📁 <strong>Easy Downloads:</strong> One-click downloads for stego images and extracted files.</li>
                    </ul>
                </div>
            </section>

            <footer id="contact" className="app-footer">
                <div className="container-footer">
                    <h2>Contact Us</h2>
                    <div className="social-links">
                        <a href="mailto:pavanbejawada4376@gmail.com"><img src={mailIcon} alt="Mail" /></a>
                        <a href="https://github.com/pavanmahi"><img src={githubIcon} alt="GitHub" /></a>
                        <a href="https://www.linkedin.com/in/pavan-bejawada-81b59a23a"><img src={linkedinIcon} alt="LinkedIn" /></a>
                        <a href="https://x.com/PavanMahi78?t=y6Jp9-58SRgxNqCZibiWeQ&s=09"><img src={twitterIcon} alt="Twitter" /></a>
                        <a href="https://www.instagram.com/_the_anonymous67?igshid=OGQ5ZDc2ODk2ZA=="><img src={instaIcon} alt="Instagram" /></a>
                    </div>
                    <p className="copyright">&copy; 2025 InvisiHide</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
