from flask import Flask, request, render_template, send_file ,jsonify
import cv2
import numpy as np
import os
from io import BytesIO

app = Flask(__name__)

def text_to_binary(text):
    return ''.join(format(ord(c), '08b') for c in text)

def binary_to_text(binary_data):
    return ''.join(chr(int(binary_data[i:i+8], 2)) for i in range(0, len(binary_data), 8))

def embed_metadata(stego_img, data_type):
    metadata_binary = text_to_binary(data_type)
    idx = 0
    for bit in metadata_binary:
        row, col = divmod(idx, stego_img.shape[1])
        stego_img[row, col, 2] = (stego_img[row, col, 2] & ~1) | int(bit)
        idx += 1

def extract_metadata(stego_img):
    metadata_bits = ""
    for idx in range(24): 
        row, col = divmod(idx, stego_img.shape[1])
        metadata_bits += str(stego_img[row, col, 2] & 1)
    return binary_to_text(metadata_bits)

def embed_password(stego_img, password):
    terminator = "::ENDPWD"
    password_binary = text_to_binary(password + terminator)
    idx = 24 
    for bit in password_binary:
        row, col = divmod(idx, stego_img.shape[1])
        stego_img[row, col, 1] = (stego_img[row, col, 1] & ~1) | int(bit)
        idx += 1

def extract_password(stego_img):
    password_bits = ""
    decoded_password = ""
    idx = 24 
    for col in range(idx, stego_img.shape[0] * stego_img.shape[1]):
        row, col_mod = divmod(col, stego_img.shape[1])
        password_bits += str(stego_img[row, col_mod, 1] & 1)
        if len(password_bits) % 8 == 0:
            decoded_password = binary_to_text(password_bits)
            if "::ENDPWD" in decoded_password:
                return decoded_password.split("::ENDPWD")[0]
    return None

def embed_text_with_length(stego_img, hidden_text, idx_start):
    total_capacity = stego_img.shape[0] * stego_img.shape[1]
    text_length = len(hidden_text)
    text_binary = format(text_length, '032b') + text_to_binary(hidden_text)
    if idx_start + len(text_binary) > total_capacity:
        raise ValueError("The hidden text is too large to embed in the selected image.")
    idx = idx_start
    for bit in text_binary:
        if idx >= total_capacity:
            raise ValueError("Embedding failed: Insufficient capacity in the image.")
        row, col = divmod(idx, stego_img.shape[1])
        stego_img[row, col, 0] = (stego_img[row, col, 0] & ~1) | int(bit)
        idx += 1

def extract_text_with_length(stego_img, idx_start):
    total_capacity = stego_img.shape[0] * stego_img.shape[1]
    length_bits = ""
    for col in range(idx_start, idx_start + 32):
        if col >= total_capacity:
            raise ValueError("Corrupted data or insufficient capacity for text length extraction.")
        row, col_mod = divmod(col, stego_img.shape[1])
        length_bits += str(stego_img[row, col_mod, 0] & 1)
    text_length = int(length_bits, 2)
    if idx_start + 32 + text_length * 8 > total_capacity:
        raise ValueError("Extracted text length exceeds available image capacity.")
    text_bits = ""
    idx = idx_start + 32
    for _ in range(text_length * 8):
        if idx >= total_capacity:
            raise ValueError("Extraction failed: Text length exceeds available image capacity.")
        row, col_mod = divmod(idx, stego_img.shape[1])
        text_bits += str(stego_img[row, col_mod, 0] & 1)
        idx += 1
    return binary_to_text(text_bits)

def embed_image_in_image(cover_img, hidden_img, cover_path, password):
    hidden_resized = cv2.resize(hidden_img, (cover_img.shape[1], cover_img.shape[0]))
    hidden_resized = cv2.GaussianBlur(hidden_resized, (3, 3), 0)
    stego_img = cover_img.copy()
    embed_metadata(stego_img, "IMG")
    embed_password(stego_img, password)
    idx_offset = (24 + len(password + "::ENDPWD") * 8) // stego_img.shape[1] + 1
    for i in range(3):
        for row in range(idx_offset, stego_img.shape[0]):
            for col in range(stego_img.shape[1]):
                stego_img[row, col, i] = (cover_img[row, col, i] & 0b11111000) | (hidden_resized[row, col, i] >> 5)
    return stego_img

def embed_text_in_image(cover_img, hidden_text, cover_path, password):
    stego_img = cover_img.copy()
    embed_metadata(stego_img, "TXT")
    embed_password(stego_img, password)
    idx_offset = (24 + len(password + "::ENDPWD") * 8) // stego_img.shape[1] + 1
    idx_start = idx_offset * stego_img.shape[1]
    embed_text_with_length(stego_img, hidden_text, idx_start)
    return stego_img

def extract_hidden_data(stego_img, password_input):
    data_type = extract_metadata(stego_img)
    if data_type not in ["TXT", "IMG"]:
        raise ValueError("Unknown or corrupted metadata.")
    stored_password = extract_password(stego_img)
    if stored_password != password_input:
        raise ValueError("Incorrect password.")
    if data_type == "TXT":
        idx_offset = (24 + len(stored_password + "::ENDPWD") * 8) // stego_img.shape[1] + 1
        idx_start = idx_offset * stego_img.shape[1]
        extracted_text = extract_text_with_length(stego_img, idx_start)
        return extracted_text, None
    elif data_type == "IMG":
        extracted_img = np.zeros_like(stego_img)
        for i in range(3):
            extracted_img[:, :, i] = ((stego_img[:, :, i] & 0b00000111) << 5)
        return None, extracted_img

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/embed_image', methods=['POST'])
def embed_image():
    cover_image = request.files['cover_image']
    hidden_image = request.files['hidden_image']
    password = request.form['password']
    cover_img = cv2.imdecode(np.frombuffer(cover_image.read(), np.uint8), cv2.IMREAD_COLOR)
    hidden_img = cv2.imdecode(np.frombuffer(hidden_image.read(), np.uint8), cv2.IMREAD_COLOR)
    stego_img = embed_image_in_image(cover_img, hidden_img, cover_image.filename, password)
    _, buffer = cv2.imencode('.png', stego_img)
    return send_file(BytesIO(buffer), mimetype='image/png', as_attachment=True, download_name='stego_image.png')

@app.route('/embed_text', methods=['POST'])
def embed_text():
    cover_image = request.files['cover_image']
    hidden_text = request.form['hidden_text']
    password = request.form['password']
    cover_img = cv2.imdecode(np.frombuffer(cover_image.read(), np.uint8), cv2.IMREAD_COLOR)
    stego_img = embed_text_in_image(cover_img, hidden_text, cover_image.filename, password)
    _, buffer = cv2.imencode('.png', stego_img)
    return send_file(BytesIO(buffer), mimetype='image/png', as_attachment=True, download_name='stego_text_image.png')

@app.route('/extract', methods=['POST'])
def extract():
    stego_image = request.files['stego_image']
    password = request.form['password']
    stego_img = cv2.imdecode(np.frombuffer(stego_image.read(), np.uint8), cv2.IMREAD_COLOR)
    
    try:
        hidden_text, hidden_img = extract_hidden_data(stego_img, password)
        if hidden_text is not None:
            return send_file(BytesIO(hidden_text.encode()), mimetype='text/plain', as_attachment=True, download_name='hidden_text.txt')
        else:
            _, buffer = cv2.imencode('.png', hidden_img)
            return send_file(BytesIO(buffer), mimetype='image/png', as_attachment=True, download_name='hidden_image.png')
    except ValueError as e:
        if "Incorrect password" in str(e):
            return {"error": "Incorrect password"}, 400
        else:
            return {"error": str(e)}, 400

if __name__ == '__main__':
    app.run(debug=True)
