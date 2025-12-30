# 이 코드를 Google Colab의 코드 셀에 복사하여 붙여넣고 실행하세요.
# Copy and paste this code into a code cell in Google Colab and run it.

# 1. 필요 패키지 설치 / Install necessary packages
# "!"로 시작하는 명령은 Colab 셀에서 시스템 명령으로 실행됩니다.
# Commands starting with "!" are executed as system commands in Colab.
try:
    import google.colab
    !pip install flask pyngrok google-generativeai
except ImportError:
    print("Not running in Google Colab or similar environment.")

import os
from flask import Flask, request, jsonify
from pyngrok import ngrok
import google.generativeai as genai

# 2. 설정 입력 / Configuration Input
print("Enter your Ngrok Authtoken (from https://dashboard.ngrok.com/get-started/your-authtoken):")
NGROK_AUTH_TOKEN = input()

print("Enter your Gemini API Key:")
GEMINI_API_KEY = input()

# 3. 서비스 설정 / Setup Services
# Ngrok 인증
if NGROK_AUTH_TOKEN:
    ngrok.set_auth_token(NGROK_AUTH_TOKEN)

# Gemini 설정
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')

app = Flask(__name__)

@app.route('/')
def home():
    return "Colab Server is Running! (정상 작동 중)"

@app.route('/test-gemini', methods=['GET', 'POST'])
def test_gemini():
    if not GEMINI_API_KEY:
        return jsonify({"error": "Gemini API Key not provided"}), 400

    try:
        # 간단한 테스트 프롬프트
        response = model.generate_content("Hello, satisfy the request: say 'Hello from Colab!'")
        return jsonify({
            "status": "success",
            "gemini_response": response.text
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# 4. 서버 실행 / Run Server
if __name__ == '__main__':
    # 5000번 포트로 Ngrok 터널 열기
    public_url = ngrok.connect(5000).public_url
    print(f"\n* Public URL: {public_url}")
    print(f"* Test Gemini: {public_url}/test-gemini")
    
    app.run(port=5000)
