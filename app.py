from flask import Flask, request, jsonify, render_template, Response
import yt_dlp
import os
import json
import threading
import urllib.request
import time

app = Flask(__name__)

download_queue = {}
queue_lock = threading.Lock()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/thumb')
def thumb():
    url = request.args.get('url', '')
    if not url:
        return '', 400
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = response.read()
            return data, 200, {'Content-Type': 'image/jpeg', 'Cache-Control': 'max-age=3600'}
    except:
        return '', 404

@app.route('/search')
def search():
    query = request.args.get('q', '').strip()
    count = request.args.get('count', '8')
    if not query:
        return jsonify({'error': 'No query provided'}), 400
    try:
        count = max(1, min(int(count), 20))
    except:
        count = 8

    ydl_opts = {'quiet': True, 'no_warnings': True, 'extract_flat': 'in_playlist'}
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            results = ydl.extract_info(f"ytsearch{count}:{query}", download=False)
            videos = []
            for entry in results.get('entries', []):
                vid_id = entry.get('id')
                videos.append({
                    'id': vid_id,
                    'title': entry.get('title', ''),
                    'thumbnail': f"https://i.ytimg.com/vi/{vid_id}/mqdefault.jpg",
                    'duration': entry.get('duration'),
                    'description': entry.get('description', ''),
                    'channel': entry.get('channel') or entry.get('uploader', ''),
                    'url': f"https://www.youtube.com/watch?v={vid_id}"
                })
            return jsonify({'results': videos})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

@app.route('/download', methods=['POST'])
def download():
    data = request.get_json(force=True, silent=True) or {}
    url = data.get('url')
    format_type = data.get('format', 'audio')
    filename_style = data.get('filename_style', 'title')
    save_path = data.get('save_path', os.path.expanduser('~/Downloads'))
    quality = data.get('quality', 'best')
    audio_format = data.get('audio_format', 'mp3')
    video_format = data.get('video_format', 'mp4')
    download_id = data.get('download_id', str(time.time()))
    video_title = data.get('title', '')

    print("DATA RECIBIDA:", request.json)
    if not url:
        return jsonify({'error': 'No URL provided'}), 400

    if filename_style == 'artist_title':
        outtmpl = os.path.join(save_path, '%(uploader)s - %(title)s.%(ext)s')
    elif filename_style == 'title_year':
        outtmpl = os.path.join(save_path, '%(title)s (%(release_year)s).%(ext)s')
    else:
        outtmpl = os.path.join(save_path, '%(title)s.%(ext)s')

    with queue_lock:
        download_queue[download_id] = {
            'status': 'starting',
            'percent': 0,
            'title': video_title,
            'speed': '',
            'eta': ''
        }

    def progress_hook(d):
        with queue_lock:
            if download_id not in download_queue:
                return
            if d['status'] == 'downloading':
                percent_str = d.get('_percent_str', '0%').strip().replace('%', '')
                try:
                    percent = float(percent_str)
                except:
                    percent = 0
                download_queue[download_id].update({
                    'status': 'downloading',
                    'percent': round(percent, 1),
                    'speed': d.get('_speed_str', '').strip(),
                    'eta': d.get('_eta_str', '').strip(),
                })
            elif d['status'] == 'finished':
                download_queue[download_id].update({'status': 'processing', 'percent': 99})

    if format_type == 'audio':
        kbps = quality if quality != 'best' else '320'
        codec = audio_format if audio_format in ('mp3', 'aac', 'flac', 'opus') else 'mp3'
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': outtmpl,
            'progress_hooks': [progress_hook],
            'postprocessors': [{'key': 'FFmpegExtractAudio', 'preferredcodec': codec, 'preferredquality': kbps}],
            'quiet': True, 'no_warnings': True,
        }
    else:
        height = quality if quality != 'best' else '1080'
        container = video_format if video_format in ('mp4', 'mkv', 'webm') else 'mp4'
        ydl_opts = {
            'format': f'bestvideo[height<={height}]+bestaudio/best[height<={height}]',
            'outtmpl': outtmpl,
            'merge_output_format': container,
            'progress_hooks': [progress_hook],
            'quiet': True, 'no_warnings': True,
        }

    def run_download():
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            try:
                info = ydl.extract_info(url, download=True)
                with queue_lock:
                    if download_id in download_queue:
                        download_queue[download_id].update({
                            'status': 'done', 'percent': 100,
                            'title': info.get('title', video_title)
                        })
            except Exception as e:
                with queue_lock:
                    if download_id in download_queue:
                        download_queue[download_id].update({'status': 'error', 'error': str(e)})

    threading.Thread(target=run_download, daemon=True).start()
    return jsonify({'success': True, 'download_id': download_id})

@app.route('/progress/<download_id>')
def progress(download_id):
    def generate():
        while True:
            with queue_lock:
                state = download_queue.get(download_id)
            if not state:
                yield f"data: {json.dumps({'status': 'not_found'})}\n\n"
                break
            yield f"data: {json.dumps(state)}\n\n"
            if state['status'] in ('done', 'error'):
                time.sleep(2)
                with queue_lock:
                    download_queue.pop(download_id, None)
                break
            time.sleep(0.5)

    return Response(generate(), mimetype='text/event-stream',
                    headers={'Cache-Control': 'no-cache', 'X-Accel-Buffering': 'no'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)