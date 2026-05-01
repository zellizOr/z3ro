// ─── STATE ────────────────────────────────────────────────────────────────────
let selectedUrl = null;
let selectedFormat = 'audio';
let selectedFilename = 'title';
let selectedQuality = '192';
let selectedAudioFormat = 'mp3';
let selectedVideoFormat = 'mp4';
let selectedVideoTitle = '';
let searchHistory = [];
let downloadHistory = [];
let queueCollapsed = false;

let settings = {
    defaultFormat: 'audio',
    defaultFilename: 'title',
    defaultAudioQuality: '192',
    defaultAudioFormat: 'mp3',
    defaultVideoQuality: '720',
    defaultVideoFormat: 'mp4',
    windowsUsername: '',
    folderName: 'Downloads',
    defaultPath: '',
    searchCount: 8,
    accentColor: '#7c6aff',
    theme: 'dark',
    language: 'es',
    searchHistoryEnabled: true
};

// ─── I18N ─────────────────────────────────────────────────────────────────────
const i18n = {
    es: {
        nav_history: 'historial',
        nav_settings: 'ajustes',
        hero_sub: 'descarga. sin ruido.',
        search_placeholder: 'buscar cancion, artista, album...',
        url_toggle: '↓ pegar enlace directo',
        url_download_btn: 'descargar',
        clipboard_detected: 'link de YouTube detectado en portapapeles',
        clipboard_use: 'usar',
        queue_title: 'cola de descarga',
        modal_label: 'descargar',
        opt_format: 'formato',
        fmt_audio: 'mp3 audio',
        fmt_video: 'mp4 video',
        opt_quality: 'calidad',
        opt_audio_fmt: 'formato de audio',
        opt_video_fmt: 'formato de video',
        btn_best: '★ mejor',
        opt_filename: 'nombre del archivo',
        fn_title: 'titulo',
        fn_artist_title: 'artista — titulo',
        fn_official: 'titulo oficial',
        fn_title_year: 'titulo (año)',
        opt_destination: 'destino',
        path_custom_placeholder: 'o escribe una ruta personalizada...',
        btn_cancel: 'cancelar',
        btn_download: 'descargar',
        history_title: 'historial de descargas',
        sec_user: 'usuario',
        user_label: 'Nombre de usuario de Windows',
        user_desc: 'Se usa para construir la ruta de descarga automaticamente. Ej: Joaquin → C:\\Users\\Joaquin\\...',
        folder_label: 'Carpeta de descarga',
        folder_desc: 'Nombre de la carpeta dentro de tu usuario.',
        folder_downloads: 'Downloads',
        folder_music: 'Music',
        folder_desktop: 'Desktop',
        folder_videos: 'Videos',
        custom_path_label: 'Ruta personalizada',
        custom_path_desc: 'Opcional. Si la completas, ignora el usuario y carpeta de arriba.',
        path_preview_label: 'Vista previa de ruta',
        sec_audio: 'audio — predeterminados',
        audio_quality_label: 'Calidad por defecto',
        audio_quality_desc: 'Kilobits por segundo. A mayor valor, mejor calidad y mayor tamaño de archivo.',
        audio_format_label: 'Formato por defecto',
        audio_format_desc: 'MP3 es el mas compatible. FLAC es sin perdida. AAC y Opus son eficientes en tamaño.',
        sec_video: 'video — predeterminados',
        video_quality_label: 'Calidad por defecto',
        video_quality_desc: 'Resolucion maxima a descargar.',
        video_format_label: 'Formato por defecto',
        video_format_desc: 'MP4 es el mas compatible. MKV soporta mas pistas. WebM es abierto y liviano.',
        default_format_label: 'Tipo de descarga por defecto',
        sec_filename: 'nombre de archivos',
        filename_label: 'Plantilla por defecto',
        filename_desc: 'Como se llamara el archivo descargado.',
        sec_search: 'busqueda',
        search_count_label: 'Resultados por busqueda',
        search_history_label: 'Historial de busquedas',
        search_history_desc: 'Muestra sugerencias al hacer foco en el buscador.',
        toggle_on: 'activado',
        toggle_off: 'desactivado',
        sec_appearance: 'apariencia',
        theme_label: 'Tema',
        theme_dark: 'oscuro',
        theme_light: 'claro',
        theme_auto: 'auto',
        accent_label: 'Color de acento',
        lang_label: 'Idioma / Language',
        btn_save: 'guardar ajustes',
        translation_note: '¿Queres colaborar con una traduccion o reportar un error?',
        toast_saved: 'ajustes guardados',
        toast_searching: 'buscando...',
        toast_conn_error: 'error de conexion',
        toast_no_link: 'pega un enlace primero',
        toast_no_dest: 'ingresa una carpeta de destino',
        toast_downloading: 'descargando...',
        toast_done: 'listo',
        toast_error: 'error durante la descarga',
        toast_path_tip: 'escribe la ruta en el campo',
        empty_history: 'sin descargas aun',
        queue_done: 'listo',
        queue_error: 'error',
        queue_processing: 'procesando...',
        queue_starting: 'iniciando...',
        results_label: 'resultados',
        no_results: 'sin resultados para',
    },
    en: {
        nav_history: 'history',
        nav_settings: 'settings',
        hero_sub: 'download. no noise.',
        search_placeholder: 'search song, artist, album...',
        url_toggle: '↓ paste direct link',
        url_download_btn: 'download',
        clipboard_detected: 'YouTube link detected in clipboard',
        clipboard_use: 'use',
        queue_title: 'download queue',
        modal_label: 'download',
        opt_format: 'format',
        fmt_audio: 'mp3 audio',
        fmt_video: 'mp4 video',
        opt_quality: 'quality',
        opt_audio_fmt: 'audio format',
        opt_video_fmt: 'video format',
        btn_best: '★ best',
        opt_filename: 'file name',
        fn_title: 'title',
        fn_artist_title: 'artist — title',
        fn_official: 'official title',
        fn_title_year: 'title (year)',
        opt_destination: 'destination',
        path_custom_placeholder: 'or type a custom path...',
        btn_cancel: 'cancel',
        btn_download: 'download',
        history_title: 'download history',
        sec_user: 'user',
        user_label: 'Windows username',
        user_desc: 'Used to build the download path automatically. E.g.: Joaquin → C:\\Users\\Joaquin\\...',
        folder_label: 'Download folder',
        folder_desc: 'Folder name inside your user directory.',
        folder_downloads: 'Downloads',
        folder_music: 'Music',
        folder_desktop: 'Desktop',
        folder_videos: 'Videos',
        custom_path_label: 'Custom path',
        custom_path_desc: 'Optional. If filled, overrides username and folder above.',
        path_preview_label: 'Path preview',
        sec_audio: 'audio — defaults',
        audio_quality_label: 'Default quality',
        audio_quality_desc: 'Kilobits per second. Higher value = better quality and larger file.',
        audio_format_label: 'Default format',
        audio_format_desc: 'MP3 is most compatible. FLAC is lossless. AAC and Opus are efficient.',
        sec_video: 'video — defaults',
        video_quality_label: 'Default quality',
        video_quality_desc: 'Maximum resolution to download.',
        video_format_label: 'Default format',
        video_format_desc: 'MP4 is most compatible. MKV supports multiple tracks. WebM is open and light.',
        default_format_label: 'Default download type',
        sec_filename: 'file naming',
        filename_label: 'Default template',
        filename_desc: 'How the downloaded file will be named.',
        sec_search: 'search',
        search_count_label: 'Results per search',
        search_history_label: 'Search history',
        search_history_desc: 'Shows suggestions when focusing the search bar.',
        toggle_on: 'enabled',
        toggle_off: 'disabled',
        sec_appearance: 'appearance',
        theme_label: 'Theme',
        theme_dark: 'dark',
        theme_light: 'light',
        theme_auto: 'auto',
        accent_label: 'Accent color',
        lang_label: 'Idioma / Language',
        btn_save: 'save settings',
        translation_note: 'Want to contribute a translation or report a bug?',
        toast_saved: 'settings saved',
        toast_searching: 'searching...',
        toast_conn_error: 'connection error',
        toast_no_link: 'paste a link first',
        toast_no_dest: 'enter a destination folder',
        toast_downloading: 'downloading...',
        toast_done: 'done',
        toast_error: 'error during download',
        toast_path_tip: 'type the path in the field',
        empty_history: 'no downloads yet',
        queue_done: 'done',
        queue_error: 'error',
        queue_processing: 'processing...',
        queue_starting: 'starting...',
        results_label: 'results',
        no_results: 'no results for',
    }
};

function t(key) { return (i18n[settings.language] || i18n.es)[key] || key; }

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[settings.language]?.[key]) el.textContent = i18n[settings.language][key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (i18n[settings.language]?.[key]) el.placeholder = i18n[settings.language][key];
    });
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadSearchHistory();
    loadDownloadHistory();
    setupEventListeners();
    restoreFromUrl();
    checkClipboard();
    updatePathPreview();
});

function setupEventListeners() {
    document.getElementById('searchBtn').addEventListener('click', doSearch);
    document.getElementById('searchInput').addEventListener('keydown', e => {
        if (e.key === 'Enter') { hideHistoryDropdown(); doSearch(); }
        if (e.key === 'Escape') hideHistoryDropdown();
    });
    document.getElementById('searchInput').addEventListener('focus', showHistoryDropdown);
    document.getElementById('searchInput').addEventListener('input', filterHistoryDropdown);
    document.getElementById('urlToggle').addEventListener('click', toggleUrlInput);
    document.getElementById('urlDownloadBtn').addEventListener('click', handleUrlDownload);
    document.getElementById('settingsBtn').addEventListener('click', openSettings);
    document.getElementById('historyPanelBtn').addEventListener('click', openHistoryPanel);
    document.getElementById('modalOverlay').addEventListener('click', e => {
        if (e.target === document.getElementById('modalOverlay')) closeModal();
    });
    document.getElementById('navLogo').addEventListener('click', goHome);
    document.getElementById('queueBarToggle').addEventListener('click', toggleQueueBar);
    document.getElementById('clipboardUseBtn').addEventListener('click', useClipboardLink);
    document.getElementById('clipboardDismissBtn').addEventListener('click', () => {
        document.getElementById('clipboardSuggestion').style.display = 'none';
    });

    // Settings live preview
    document.getElementById('windowsUsername').addEventListener('input', updatePathPreview);
    document.getElementById('folderName').addEventListener('input', updatePathPreview);
    document.getElementById('defaultPath').addEventListener('input', updatePathPreview);

    // Drag and drop on search box
    const searchBox = document.getElementById('searchBox');
    searchBox.addEventListener('dragover', e => { e.preventDefault(); searchBox.style.borderColor = 'var(--accent)'; });
    searchBox.addEventListener('dragleave', () => { searchBox.style.borderColor = ''; });
    searchBox.addEventListener('drop', e => {
        e.preventDefault();
        searchBox.style.borderColor = '';
        const text = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('text/uri-list');
        if (text && isYouTubeUrl(text)) {
            document.getElementById('urlInputWrapper').classList.add('visible');
            document.getElementById('urlInput').value = text.trim();
            openModal(text.trim(), 'enlace directo');
        } else if (text) {
            document.getElementById('searchInput').value = text.trim();
            doSearch();
        }
    });

    window.addEventListener('scroll', () => {
        document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 10);
    });
    window.addEventListener('popstate', restoreFromUrl);
    document.addEventListener('click', e => {
        if (!e.target.closest('.search-wrapper')) hideHistoryDropdown();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
        if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
        if (e.key === 'Escape') {
            closeModal();
            closeSettings();
            closeHistoryPanel();
        }
    });
}

// ─── URL ROUTING ──────────────────────────────────────────────────────────────
function restoreFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) { document.getElementById('searchInput').value = q; doSearch(true); }
}
function pushSearchUrl(query) {
    const url = new URL(window.location);
    url.searchParams.set('q', query);
    history.pushState({ query }, '', url);
}

// ─── GO HOME ──────────────────────────────────────────────────────────────────
function goHome() {
    history.pushState({}, '', '/');
    document.getElementById('hero').classList.remove('collapsed');
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('searchInput').value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── CLIPBOARD ────────────────────────────────────────────────────────────────
let clipboardUrl = null;
async function checkClipboard() {
    try {
        if (!navigator.clipboard?.readText) return;
        const text = await navigator.clipboard.readText();
        if (isYouTubeUrl(text)) {
            clipboardUrl = text.trim();
            document.getElementById('clipboardSuggestion').style.display = 'flex';
        }
    } catch(e) {}
}

function useClipboardLink() {
    if (!clipboardUrl) return;
    document.getElementById('urlInputWrapper').classList.add('visible');
    document.getElementById('urlInput').value = clipboardUrl;
    document.getElementById('clipboardSuggestion').style.display = 'none';
    openModal(clipboardUrl, 'enlace directo');
}

function isYouTubeUrl(str) {
    return /youtube\.com\/watch|youtu\.be\//.test(str);
}

// ─── SEARCH HISTORY ───────────────────────────────────────────────────────────
function loadSearchHistory() {
    try { searchHistory = JSON.parse(localStorage.getItem('z3ro_search_history') || '[]'); } catch(e) { searchHistory = []; }
}
function saveToSearchHistory(query) {
    if (!settings.searchHistoryEnabled) return;
    searchHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 20);
    localStorage.setItem('z3ro_search_history', JSON.stringify(searchHistory));
}
function showHistoryDropdown() {
    if (document.getElementById('hero').classList.contains('collapsed')) return;
    if (!settings.searchHistoryEnabled) return;
    const query = document.getElementById('searchInput').value.trim();
    const filtered = query ? searchHistory.filter(h => h.toLowerCase().includes(query.toLowerCase())) : searchHistory;
    renderDropdown(filtered);
}
function filterHistoryDropdown() { showHistoryDropdown(); }
function renderDropdown(items) {
    let dropdown = document.getElementById('historyDropdown');
    if (!items.length) { if (dropdown) dropdown.remove(); return; }
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.id = 'historyDropdown';
        dropdown.className = 'history-dropdown';
        document.querySelector('.search-wrapper').appendChild(dropdown);
    }
    dropdown.innerHTML = items.map(item => `
        <div class="history-item" data-query="${escapeHtml(item)}">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${escapeHtml(item)}</span>
            <button class="history-delete" data-query="${escapeHtml(item)}">✕</button>
        </div>
    `).join('');
    dropdown.querySelectorAll('.history-item').forEach(el => {
        el.addEventListener('click', e => {
            if (e.target.closest('.history-delete')) {
                e.stopPropagation();
                const q = e.target.closest('.history-delete').dataset.query;
                searchHistory = searchHistory.filter(h => h !== q);
                localStorage.setItem('z3ro_search_history', JSON.stringify(searchHistory));
                showHistoryDropdown();
                return;
            }
            document.getElementById('searchInput').value = el.dataset.query;
            hideHistoryDropdown();
            doSearch();
        });
    });
}
function hideHistoryDropdown() {
    const el = document.getElementById('historyDropdown');
    if (el) el.remove();
}

// ─── DOWNLOAD HISTORY ─────────────────────────────────────────────────────────
function loadDownloadHistory() {
    try { downloadHistory = JSON.parse(localStorage.getItem('z3ro_dl_history') || '[]'); } catch(e) { downloadHistory = []; }
}
function saveToDownloadHistory(entry) {
    downloadHistory = [entry, ...downloadHistory].slice(0, 50);
    localStorage.setItem('z3ro_dl_history', JSON.stringify(downloadHistory));
}
function openHistoryPanel() {
    const body = document.getElementById('historyPanelBody');
    if (!downloadHistory.length) {
        body.innerHTML = `<div class="history-empty">${t('empty_history')}</div>`;
    } else {
        body.innerHTML = downloadHistory.map(e => `
            <div class="history-entry">
                <div class="history-entry-title">${escapeHtml(e.title)}</div>
                <div class="history-entry-meta">
                    <span>${e.format.toUpperCase()}</span>
                    ${e.quality ? `<span>${e.quality}</span>` : ''}
                    <span style="color:var(--text3)">${e.date}</span>
                    <span style="color:var(--text3);font-size:0.62rem;">${escapeHtml(e.path)}</span>
                </div>
            </div>
        `).join('');
    }
    document.getElementById('historyPanel').classList.add('open');
}
function closeHistoryPanel() { document.getElementById('historyPanel').classList.remove('open'); }

// ─── LOADING BAR ──────────────────────────────────────────────────────────────
function startLoading() { document.getElementById('loadingBar').className = 'loading-bar active'; }
function stopLoading() {
    const bar = document.getElementById('loadingBar');
    bar.className = 'loading-bar done';
    setTimeout(() => bar.className = 'loading-bar', 600);
}

// ─── SEARCH ───────────────────────────────────────────────────────────────────
async function doSearch(fromUrl = false) {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;
    if (!fromUrl) pushSearchUrl(query);
    saveToSearchHistory(query);
    collapseHero();
    startLoading();
    hideHistoryDropdown();
    try {
        const res = await fetch(`/search?q=${encodeURIComponent(query)}&count=${settings.searchCount}`);
        const data = await res.json();
        stopLoading();
        if (data.error) return showToast(data.error, 'error');
        renderResults(data.results, query);
    } catch (e) {
        stopLoading();
        showToast(t('toast_conn_error'), 'error');
    }
}

function renderResults(results, query) {
    const grid = document.getElementById('resultsGrid');
    const section = document.getElementById('resultsSection');
    const count = document.getElementById('resultsCount');
    grid.innerHTML = '';
    section.style.display = 'block';
    if (!results.length) {
        count.textContent = '';
        grid.innerHTML = `<div class="empty-state">${t('no_results')} "${escapeHtml(query)}"</div>`;
        return;
    }
    count.textContent = `${results.length} ${t('results_label')} — "${query}"`;
    results.forEach(video => {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.innerHTML = `
            <img class="result-thumb" src="/thumb?url=${encodeURIComponent('https://i.ytimg.com/vi/' + video.id + '/mqdefault.jpg')}" alt="" loading="lazy">
            <div class="result-info">
                <div class="result-title">${escapeHtml(video.title)}</div>
                <div class="result-channel">${escapeHtml(video.channel || '')}</div>
                <div class="result-description">${escapeHtml(video.description || '')}</div>
                <div class="result-meta"><div class="result-duration">${formatDuration(video.duration)}</div></div>
            </div>
        `;
        card.addEventListener('click', () => openModal(`https://www.youtube.com/watch?v=${video.id}`, video.title));
        grid.appendChild(card);
    });
}

function collapseHero() { document.getElementById('hero').classList.add('collapsed'); }

// ─── URL TOGGLE ───────────────────────────────────────────────────────────────
function toggleUrlInput() { document.getElementById('urlInputWrapper').classList.toggle('visible'); }
function handleUrlDownload() {
    const url = document.getElementById('urlInput').value.trim();
    if (!url) return showToast(t('toast_no_link'), 'error');
    openModal(url, 'enlace directo');
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function openModal(url, title) {
    selectedUrl = url;
    selectedVideoTitle = title;
    selectedFormat = settings.defaultFormat;
    selectedFilename = settings.defaultFilename;
    selectedAudioFormat = settings.defaultAudioFormat;
    selectedVideoFormat = settings.defaultVideoFormat;

    if (selectedFormat === 'audio') {
        selectedQuality = settings.defaultAudioQuality;
    } else {
        selectedQuality = settings.defaultVideoQuality;
    }

    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalOverlay').classList.add('visible');

    // Format buttons
    document.getElementById('btnAudio').classList.toggle('active', selectedFormat === 'audio');
    document.getElementById('btnVideo').classList.toggle('active', selectedFormat === 'video');
    document.getElementById('audioOptions').style.display = selectedFormat === 'audio' ? 'contents' : 'none';
    document.getElementById('videoOptions').style.display = selectedFormat === 'video' ? 'contents' : 'none';

    // Filename
    ['title','artist_title','official','title_year'].forEach(v => {
        document.getElementById('btn' + v.split('_').map(s => s[0].toUpperCase() + s.slice(1)).join('')).classList.toggle('active', selectedFilename === v);
    });

    // Sync quality buttons
    syncQualityButtons();
    syncAudioFormatButtons();
    syncVideoFormatButtons();

    // Path
    updateModalPath();
}

function updateModalPath() {
    const display = document.getElementById('pathDisplay');
    const computed = getComputedPath();
    display.textContent = computed || '—';
    const custom = document.getElementById('savePath');
    if (settings.defaultPath) custom.value = settings.defaultPath;
    else custom.value = '';
    custom.placeholder = computed ? `o escribe otra ruta...` : `C:\\Users\\...`;
}

function getComputedPath() {
    if (settings.defaultPath) return settings.defaultPath;
    if (settings.windowsUsername) {
        const folder = settings.folderName || 'Downloads';
        return `C:\\Users\\${settings.windowsUsername}\\${folder}`;
    }
    return '';
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('visible');
    selectedUrl = null;
}

function selectFormat(format) {
    selectedFormat = format;
    document.getElementById('btnAudio').classList.toggle('active', format === 'audio');
    document.getElementById('btnVideo').classList.toggle('active', format === 'video');
    document.getElementById('audioOptions').style.display = format === 'audio' ? 'contents' : 'none';
    document.getElementById('videoOptions').style.display = format === 'video' ? 'contents' : 'none';
    selectedQuality = format === 'audio' ? settings.defaultAudioQuality : settings.defaultVideoQuality;
    syncQualityButtons();
}

function selectFilename(style) {
    selectedFilename = style;
    ['btnTitle','btnArtistTitle','btnOfficial','btnTitleYear'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    });
    const map = { title: 'btnTitle', artist_title: 'btnArtistTitle', official: 'btnOfficial', title_year: 'btnTitleYear' };
    document.getElementById(map[style])?.classList.add('active');
}

function selectQuality(q) {
    selectedQuality = q;
    syncQualityButtons();
}

function syncQualityButtons() {
    const groupId = selectedFormat === 'audio' ? 'audioQualityGroup' : 'videoQualityGroup';
    document.querySelectorAll(`#${groupId} .toggle-btn:not(.toggle-btn-locked)`).forEach(btn => {
        btn.classList.remove('active');
        const val = btn.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        if (val === selectedQuality) btn.classList.add('active');
    });
}

function selectAudioFormat(fmt) {
    selectedAudioFormat = fmt;
    syncAudioFormatButtons();
}
function syncAudioFormatButtons() {
    document.querySelectorAll('#audioFormatGroup .toggle-btn').forEach(btn => {
        const val = btn.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        btn.classList.toggle('active', val === selectedAudioFormat);
    });
}

function selectVideoFormat(fmt) {
    selectedVideoFormat = fmt;
    syncVideoFormatButtons();
}
function syncVideoFormatButtons() {
    document.querySelectorAll('#videoFormatGroup .toggle-btn').forEach(btn => {
        const val = btn.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        btn.classList.toggle('active', val === selectedVideoFormat);
    });
}

function selectPath() { showToast(t('toast_path_tip'), ''); }

async function startDownload() {
    console.log('selectedUrl al descargar:', selectedUrl);
    const customPath = document.getElementById('savePath').value.trim();
    const savePath = customPath || getComputedPath();
    if (!savePath) return showToast(t('toast_no_dest'), 'error');
    if (!selectedUrl) return;

    const downloadId = 'dl_' + Date.now();

    // Add to queue UI
    addToQueue(downloadId, selectedVideoTitle);

    const body = {
        url: selectedUrl,
        format: selectedFormat,
        filename_style: selectedFilename,
        save_path: savePath,
        quality: selectedQuality,
        audio_format: selectedAudioFormat,
        video_format: selectedVideoFormat,
        download_id: downloadId,
        title: selectedVideoTitle
    };

    closeModal();
    
    try {
        const res = await fetch('/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (!data.success) {
            updateQueueItem(downloadId, 'error', 0, t('queue_error'));
            return;
        }
        // Start SSE progress
        listenToProgress(downloadId, savePath);
    } catch(e) {
        updateQueueItem(downloadId, 'error', 0, t('queue_error'));
    }
}

// ─── QUEUE ────────────────────────────────────────────────────────────────────
function addToQueue(id, title) {
    const bar = document.getElementById('queueBar');
    const list = document.getElementById('queueList');
    bar.style.display = 'block';

    const item = document.createElement('div');
    item.className = 'queue-item';
    item.id = `qi_${id}`;
    item.innerHTML = `
        <div class="queue-item-title">${escapeHtml(title)}</div>
        <div class="queue-item-bar"><div class="queue-item-bar-fill" style="width:0%"></div></div>
        <div class="queue-item-percent">0%</div>
        <div class="queue-item-status">${t('queue_starting')}</div>
    `;
    list.appendChild(item);
}

function updateQueueItem(id, status, percent, statusText) {
    const item = document.getElementById(`qi_${id}`);
    if (!item) return;
    item.className = 'queue-item ' + (status === 'done' ? 'done' : status === 'error' ? 'error' : '');
    item.querySelector('.queue-item-bar-fill').style.width = percent + '%';
    item.querySelector('.queue-item-percent').textContent = percent + '%';
    item.querySelector('.queue-item-status').textContent = statusText;
}

function listenToProgress(id, savePath) {
    const es = new EventSource(`/progress/${id}`);
    es.onmessage = e => {
        const data = JSON.parse(e.data);
        if (data.status === 'downloading') {
            const statusText = data.speed ? `${data.speed} · eta ${data.eta}` : t('toast_downloading');
            updateQueueItem(id, 'downloading', data.percent, statusText);
        } else if (data.status === 'processing') {
            updateQueueItem(id, 'downloading', 99, t('queue_processing'));
        } else if (data.status === 'done') {
            updateQueueItem(id, 'done', 100, t('queue_done'));
            showToast(`${t('toast_done')} — ${data.title}`, 'success');
            saveToDownloadHistory({
                title: data.title,
                format: selectedFormat,
                quality: selectedQuality,
                path: savePath,
                date: new Date().toLocaleDateString()
            });
            es.close();
            setTimeout(() => {
                document.getElementById(`qi_${id}`)?.remove();
                if (!document.querySelector('.queue-item')) {
                    document.getElementById('queueBar').style.display = 'none';
                }
            }, 4000);
        } else if (data.status === 'error') {
            updateQueueItem(id, 'error', 0, t('queue_error'));
            showToast(data.error || t('toast_error'), 'error');
            es.close();
        }
    };
    es.onerror = () => { es.close(); };
}

function toggleQueueBar() {
    queueCollapsed = !queueCollapsed;
    document.getElementById('queueBar').classList.toggle('collapsed', queueCollapsed);
    document.getElementById('queueBarToggle').textContent = queueCollapsed ? '▲' : '▼';
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function openSettings() { document.getElementById('settingsPanel').classList.add('open'); }
function closeSettings() { document.getElementById('settingsPanel').classList.remove('open'); }

function saveSettings() {
    settings.defaultFormat = document.getElementById('defaultFormat').value;
    settings.defaultFilename = document.getElementById('defaultFilename').value;
    settings.defaultAudioQuality = document.getElementById('defaultAudioQuality').value;
    settings.defaultAudioFormat = document.getElementById('defaultAudioFormat').value;
    settings.defaultVideoQuality = document.getElementById('defaultVideoQuality').value;
    settings.defaultVideoFormat = document.getElementById('defaultVideoFormat').value;
    settings.windowsUsername = document.getElementById('windowsUsername').value.trim();
    settings.folderName = document.getElementById('folderName').value.trim() || 'Downloads';
    settings.defaultPath = document.getElementById('defaultPath').value.trim();
    settings.searchCount = parseInt(document.getElementById('searchCount').value);
    localStorage.setItem('z3ro_settings', JSON.stringify(settings));
    showToast(t('toast_saved'), 'success');
    closeSettings();
}

function loadSettings() {
    const saved = localStorage.getItem('z3ro_settings');
    if (saved) {
        try { settings = { ...settings, ...JSON.parse(saved) }; } catch(e) {}
    }

    const dfEl = document.getElementById('defaultFormat');
    if (dfEl) dfEl.value = settings.defaultFormat;
    const dnEl = document.getElementById('defaultFilename');
    if (dnEl) dnEl.value = settings.defaultFilename;
    document.getElementById('defaultAudioQuality').value = settings.defaultAudioQuality;
    document.getElementById('defaultAudioFormat').value = settings.defaultAudioFormat;
    document.getElementById('defaultVideoQuality').value = settings.defaultVideoQuality;
    document.getElementById('defaultVideoFormat').value = settings.defaultVideoFormat;
    document.getElementById('windowsUsername').value = settings.windowsUsername;
    document.getElementById('folderName').value = settings.folderName;
    document.getElementById('defaultPath').value = settings.defaultPath;
    document.getElementById('searchCount').value = settings.searchCount;

    applyAccentColor(settings.accentColor);
    applyTheme(settings.theme);
    applyTranslations();
    setHistoryEnabled(settings.searchHistoryEnabled, false);

    // Theme buttons
    ['dark','light','auto'].forEach(t => {
        document.getElementById(`theme${t[0].toUpperCase()+t.slice(1)}Btn`)?.classList.toggle('active', settings.theme === t);
    });

    // Lang buttons
    document.getElementById('langEsBtn')?.classList.toggle('active', settings.language === 'es');
    document.getElementById('langEnBtn')?.classList.toggle('active', settings.language === 'en');

    // Folder presets
    syncFolderPresets(settings.folderName);

    document.querySelectorAll('.color-dot').forEach(dot => {
        dot.classList.toggle('active', dot.dataset.color === settings.accentColor);
        dot.addEventListener('click', () => {
            document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            settings.accentColor = dot.dataset.color;
            applyAccentColor(dot.dataset.color);
            updateFavicon(dot.dataset.color);
        });
    });
}

function updatePathPreview() {
    const username = document.getElementById('windowsUsername')?.value.trim();
    const folder = document.getElementById('folderName')?.value.trim() || 'Downloads';
    const custom = document.getElementById('defaultPath')?.value.trim();
    const preview = document.getElementById('pathPreview');
    if (!preview) return;
    if (custom) { preview.textContent = custom; return; }
    if (username) { preview.textContent = `C:\\Users\\${username}\\${folder}`; return; }
    preview.textContent = '—';
}

function selectFolderPreset(name) {
    document.getElementById('folderName').value = name;
    syncFolderPresets(name);
    updatePathPreview();
}

function syncFolderPresets(active) {
    document.querySelectorAll('#folderPresets .toggle-btn').forEach(btn => {
        const val = btn.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        btn.classList.toggle('active', val === active);
    });
}

function setHistoryEnabled(val, save = true) {
    settings.searchHistoryEnabled = val;
    document.getElementById('historyOnBtn')?.classList.toggle('active', val);
    document.getElementById('historyOffBtn')?.classList.toggle('active', !val);
    if (save) localStorage.setItem('z3ro_settings', JSON.stringify(settings));
}

function setTheme(theme) {
    settings.theme = theme;
    applyTheme(theme);
    ['dark','light','auto'].forEach(t => {
        document.getElementById(`theme${t[0].toUpperCase()+t.slice(1)}Btn`)?.classList.toggle('active', theme === t);
    });
}

function applyTheme(theme) {
    if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
}

function setLanguage(lang) {
    settings.language = lang;
    document.getElementById('langEsBtn')?.classList.toggle('active', lang === 'es');
    document.getElementById('langEnBtn')?.classList.toggle('active', lang === 'en');
    applyTranslations();
}

function applyAccentColor(color) {
    const r = parseInt(color.slice(1,3),16);
    const g = parseInt(color.slice(3,5),16);
    const b = parseInt(color.slice(5,7),16);
    document.documentElement.style.setProperty('--accent', color);
    document.documentElement.style.setProperty('--accent-hover', lightenColor(color, 20));
    document.documentElement.style.setProperty('--accent-glow', `rgba(${r},${g},${b},0.15)`);
    updateFavicon(color);
}

function updateFavicon(color) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='${color}'/><text x='50' y='76' font-size='62' font-family='monospace' font-weight='bold' fill='white' text-anchor='middle'>z3</text></svg>`;
    const encoded = 'data:image/svg+xml,' + encodeURIComponent(svg);
    let link = document.querySelector("link[rel='icon']");
    if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
    link.href = encoded;
}

function lightenColor(hex, amount) {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.min(255, (num >> 16) + amount);
    const g = Math.min(255, ((num >> 8) & 0xFF) + amount);
    const b = Math.min(255, (num & 0xFF) + amount);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// ─── UTILS ────────────────────────────────────────────────────────────────────
function escapeHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatDuration(seconds) {
    if (!seconds) return '--:--';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    return `${m}:${String(s).padStart(2,'0')}`;
}

function showToast(msg, type) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = 'toast visible' + (type ? ` ${type}` : '');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('visible'), 3500);
}

function toggleSection(header) {
    const body = header.nextElementSibling;
    const isOpen = header.classList.contains('open');
    header.classList.toggle('open', !isOpen);
    body.classList.toggle('open', !isOpen);
}

function selectDefaultFilename(val) {
    settings.defaultFilename = val;
    ['title','artist_title','official'].forEach(v => {
        const id = 'defaultFn' + v.split('_').map(s => s[0].toUpperCase()+s.slice(1)).join('');
        document.getElementById(id)?.classList.toggle('active', v === val);
    });
}

function setDefaultType(type) {
    settings.defaultFormat = type;
    document.querySelector('[onclick="setDefaultType(\'audio\')"]')?.classList.toggle('active', type === 'audio');
    document.querySelector('[onclick="setDefaultType(\'video\')"]')?.classList.toggle('active', type === 'video');
    showToast(type === 'audio' ? 'audio establecido por defecto' : 'video establecido por defecto', 'success');
}

function syncDefaultFilenameButtons() {
    ['title','artist_title','official'].forEach(v => {
        const id = 'defaultFn' + v.split('_').map(s => s[0].toUpperCase()+s.slice(1)).join('');
        document.getElementById(id)?.classList.toggle('active', v === settings.defaultFilename);
    });
}