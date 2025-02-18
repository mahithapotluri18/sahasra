from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
from gtts import gTTS
import os
import base64
import tempfile

app = Flask(__name__)
CORS(app)

@app.route('/api/process-voice', methods=['POST'])
def process_voice():
    try:
        # Get audio data from request
        audio_data = request.json.get('audio')
        if not audio_data:
            return jsonify({'error': 'No audio data received'}), 400

        # Decode base64 audio data
        audio_bytes = base64.b64decode(audio_data.split(',')[1])

        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_audio:
            temp_audio.write(audio_bytes)
            temp_audio_path = temp_audio.name

        # Initialize recognizer
        recognizer = sr.Recognizer()
        
        # Read the audio file
        with sr.AudioFile(temp_audio_path) as source:
            audio = recognizer.record(source)

        # Perform speech recognition
        text = recognizer.recognize_google(audio)

        # Clean up temporary file
        os.unlink(temp_audio_path)

        # Process the command
        response = process_command(text.lower())

        # Convert response to speech
        tts = gTTS(text=response, lang='en')
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_speech:
            tts.save(temp_speech.name)
            
            # Read the file and convert to base64
            with open(temp_speech.name, 'rb') as audio_file:
                audio_data = base64.b64encode(audio_file.read()).decode('utf-8')
            
            # Clean up temporary file
            os.unlink(temp_speech.name)

        return jsonify({
            'success': True,
            'text': text,
            'response': response,
            'audio': f'data:audio/mp3;base64,{audio_data}'
        })

    except sr.UnknownValueError:
        return jsonify({'error': 'Could not understand audio'}), 400
    except sr.RequestError as e:
        return jsonify({'error': f'Error with the speech recognition service: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

def process_command(text):
    # Basic command processing
    if 'search for' in text:
        query = text.replace('search for', '').strip()
        return f'Searching for {query}'
    elif 'go to' in text:
        page = text.replace('go to', '').strip()
        return f'Navigating to {page}'
    elif 'scroll' in text:
        direction = 'up' if 'up' in text else 'down' if 'down' in text else 'unknown'
        return f'Scrolling {direction}'
    elif 'change theme' in text:
        theme = 'dark' if 'dark' in text else 'light'
        return f'Changing theme to {theme}'
    elif 'help' in text:
        return 'Available commands: search for, go to, scroll, change theme, help'
    else:
        return "I'm sorry, I didn't understand that command. Say 'help' for available commands."

if __name__ == '__main__':
    app.run(debug=True, port=5000)
