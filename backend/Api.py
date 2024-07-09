from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import google.generativeai as genai


app = Flask(__name__, static_folder='static')
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

API_KEY = 'AIzaSyAgMkx-Wlq6IimwP45s5fxnoyyT-sqEakg'
API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

@app.route('/tailor', methods=['POST'])
def tailorresume():
    data = request.get_json()
    latex_code = data.get("latexcode", "")
    job_description = data.get("jobdescription", "")

    prompt = f'''
    You must tailor resumes in LaTeX accurately and well-written.

    Given this LaTeX code: {latex_code}.
    Given this job description: {job_description}.

    Show me the full entire LaTeX code (NO SNIPPETS) of the tailored resume focusing on the following
    1. Borrowing keywords from the job postings into skills, experiences
    2. Using ATS-friendly keywords that match the job description
    3. Removing irrelevant keywords, sentences that don't align with job postings
    4. Bolding keywords that might relate to the job
    
    Make it well-written and specifically tailored to the job description. 

    Do not generate anything else. Just the entire full LaTeX code. 
    '''

    try:
        response = model.generate_content(prompt)
        if response and response.text:
            tailored_latex = response.text
            print(tailored_latex)
            return jsonify({'tailored_latex': tailored_latex})
        else:
            return jsonify({'error': 'Failed to generate tailored LaTeX code'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/match', methods = ['POST'])
def jobmatching():
    data = request.json
    latex_code = data.get('latex_code')
    job_description = data.get('job_description')

    prompt = f'''
    You calculate the percentage that this resume in LaTeX code align to the job description.

    Given this LaTeX code: {latex_code}.
    Give this job description: {job_description}.

    Determine how tailored the LaTeX code is to the job description based on key words, job positions, experiences.
    
    Do not generate anything else. Just the percentage.
    '''

    response = requests.post(API_URL, headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {API_KEY}'
    }, json={
        "contents": [{"parts": [{"text": prompt}]}]
    })

    if response.status_code == 200:
        percentage = response.json().get('contents')[0].get('parts')[0].get('text')
        return jsonify({'percentage': percentage})
    else:
        return jsonify({'error': 'Failed to generate percentage'}), 500

if __name__ == '__main__':
    app.run(debug=True)