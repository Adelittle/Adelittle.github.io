/* PDF Password Protector — Using pdf.js + jsPDF with built-in encryption */
(function () {
    'use strict';

    var MAX_SIZE = 30 * 1024 * 1024;
    var RENDER_SCALE = 2; // 2x for quality
    var dropZone = document.getElementById('pdf-drop');
    var fileInput = document.getElementById('pdf-file');
    var fileInfoEl = document.getElementById('pdf-file-info');
    var userPwInp = document.getElementById('pdf-user-pw');
    var confirmPwInp = document.getElementById('pdf-confirm-pw');
    var ownerPwInp = document.getElementById('pdf-owner-pw');
    var protectBtn = document.getElementById('pdf-protect-btn');
    var statusEl = document.getElementById('pdf-status');
    var strengthBar = document.getElementById('pw-strength-bar');
    var strengthLabel = document.getElementById('pw-strength-label');
    var matchMsg = document.getElementById('pw-match-msg');
    var progressEl = document.getElementById('pdf-progress');
    var progressBar = document.getElementById('pdf-progress-bar');

    var selectedFile = null;
    var pdfArrayBuffer = null;

    /* ====== File selection ====== */
    dropZone.addEventListener('click', function () { fileInput.click(); });
    dropZone.addEventListener('dragover', function (e) { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', function () { dropZone.classList.remove('dragover'); });
    dropZone.addEventListener('drop', function (e) {
        e.preventDefault(); dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener('change', function () { if (this.files.length) handleFile(this.files[0]); });

    function handleFile(file) {
        hideStatus();
        if (!file.name.toLowerCase().endsWith('.pdf')) { showStatus('error', '❌ Please select a PDF file.'); return; }
        if (file.size > MAX_SIZE) { showStatus('error', '❌ File too large. Maximum size is 30 MB.'); return; }
        selectedFile = file;
        var reader = new FileReader();
        reader.onload = function (e) {
            pdfArrayBuffer = e.target.result;
            showFileInfo(file);
            checkReady();
        };
        reader.readAsArrayBuffer(file);
    }

    function showFileInfo(file) {
        var sz = file.size;
        var s = sz < 1024 ? sz + ' B' : sz < 1048576 ? (sz / 1024).toFixed(1) + ' KB' : (sz / 1048576).toFixed(2) + ' MB';
        fileInfoEl.style.display = 'flex';
        fileInfoEl.innerHTML = '<span class="pdf-file-icon">📄</span><div class="pdf-file-details"><div class="pdf-file-name">' + esc(file.name) + '</div><div class="pdf-file-size">' + s + '</div></div><button class="pdf-file-remove" id="pdf-remove" type="button">✕</button>';
        document.getElementById('pdf-remove').addEventListener('click', function () {
            selectedFile = null; pdfArrayBuffer = null; fileInfoEl.style.display = 'none'; fileInput.value = ''; checkReady();
        });
    }

    /* ====== Password UI ====== */
    userPwInp.addEventListener('input', function () { updateStrength(); checkMatch(); checkReady(); });
    confirmPwInp.addEventListener('input', function () { checkMatch(); checkReady(); });
    ownerPwInp.addEventListener('input', checkReady);

    function updateStrength() {
        var pw = userPwInp.value, sc = 0;
        if (pw.length >= 6) sc++; if (pw.length >= 10) sc++; if (pw.length >= 14) sc++;
        if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) sc++; if (/\d/.test(pw)) sc++; if (/[^a-zA-Z0-9]/.test(pw)) sc++;
        var pct = Math.min(100, (sc / 6) * 100);
        var colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];
        var labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
        var idx = Math.min(4, Math.floor(sc * 4 / 6));
        strengthBar.style.width = pct + '%'; strengthBar.style.background = colors[idx];
        strengthLabel.textContent = pw.length > 0 ? labels[idx] : ''; strengthLabel.style.color = colors[idx];
    }

    function checkMatch() {
        var pw = userPwInp.value, c = confirmPwInp.value;
        if (!c) { matchMsg.textContent = ''; return; }
        matchMsg.textContent = pw === c ? '✅ Passwords match' : '❌ Passwords do not match';
        matchMsg.style.color = pw === c ? '#86efac' : '#fca5a5';
    }

    function checkReady() {
        protectBtn.disabled = !(pdfArrayBuffer && userPwInp.value.length > 0 && userPwInp.value === confirmPwInp.value);
    }

    function setupToggle(btnId, inputId) {
        document.getElementById(btnId).addEventListener('click', function () {
            var inp = document.getElementById(inputId);
            inp.type = inp.type === 'password' ? 'text' : 'password';
            this.textContent = inp.type === 'password' ? '👁' : '🙈';
        });
    }
    setupToggle('toggle-user-pw', 'pdf-user-pw');
    setupToggle('toggle-confirm-pw', 'pdf-confirm-pw');
    setupToggle('toggle-owner-pw', 'pdf-owner-pw');

    /* ====== Build permissions array for jsPDF ====== */
    function getPermissions() {
        var perms = [];
        if (document.getElementById('perm-print').checked) perms.push('print');
        if (document.getElementById('perm-modify').checked) perms.push('modify');
        if (document.getElementById('perm-copy').checked) perms.push('copy');
        if (document.getElementById('perm-annotate').checked) perms.push('annot-forms');
        return perms;
    }

    /* ====== PROTECT BUTTON ====== */
    protectBtn.addEventListener('click', async function () {
        if (!pdfArrayBuffer || !userPwInp.value) return;
        showStatus('loading', '🔐 Processing PDF pages...');
        progressEl.style.display = 'block';
        progressBar.style.width = '0%';
        protectBtn.disabled = true;

        try {
            // 1. Load PDF with pdf.js
            var loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfArrayBuffer) });
            var pdfDoc = await loadingTask.promise;
            var numPages = pdfDoc.numPages;

            // 2. Render each page to canvas and collect image data
            var pages = [];
            for (var i = 1; i <= numPages; i++) {
                var page = await pdfDoc.getPage(i);
                var viewport = page.getViewport({ scale: RENDER_SCALE });
                var canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                var ctx = canvas.getContext('2d');

                await page.render({ canvasContext: ctx, viewport: viewport }).promise;

                // Get page dimensions in points (1/72 inch)
                var origViewport = page.getViewport({ scale: 1 });
                pages.push({
                    imgData: canvas.toDataURL('image/jpeg', 0.92),
                    width: origViewport.width,
                    height: origViewport.height
                });

                var pct = Math.round((i / numPages) * 80);
                progressBar.style.width = pct + '%';
                showStatus('loading', '🔐 Rendering page ' + i + ' of ' + numPages + '...');

                // Yield to UI
                await new Promise(function (r) { setTimeout(r, 10); });
            }

            showStatus('loading', '🔐 Creating encrypted PDF...');
            progressBar.style.width = '85%';

            // 3. Create jsPDF document with encryption
            var userPw = userPwInp.value;
            var ownerPw = ownerPwInp.value || userPw;
            var perms = getPermissions();

            // First page determines initial orientation and size
            var firstPage = pages[0];
            var orientation = firstPage.width > firstPage.height ? 'landscape' : 'portrait';

            var doc = new jspdf.jsPDF({
                orientation: orientation,
                unit: 'pt',
                format: [firstPage.width, firstPage.height],
                encryption: {
                    userPassword: userPw,
                    ownerPassword: ownerPw,
                    userPermissions: perms
                }
            });

            // 4. Add each page as an image
            for (var i = 0; i < pages.length; i++) {
                if (i > 0) {
                    var orient = pages[i].width > pages[i].height ? 'l' : 'p';
                    doc.addPage([pages[i].width, pages[i].height], orient);
                }
                doc.addImage(pages[i].imgData, 'JPEG', 0, 0, pages[i].width, pages[i].height);

                progressBar.style.width = (85 + Math.round((i / pages.length) * 15)) + '%';
            }

            progressBar.style.width = '100%';
            showStatus('loading', '🔐 Saving encrypted PDF...');

            // 5. Save and download
            var pdfOutput = doc.output('arraybuffer');
            var origName = selectedFile.name.replace(/\.pdf$/i, '');
            var fileName = origName + '_protected.pdf';

            await downloadBytes(new Uint8Array(pdfOutput), fileName);

            showStatus('success', '✅ PDF protected successfully! Saved as <strong>' + esc(fileName) + '</strong>');
            setTimeout(function () { progressEl.style.display = 'none'; }, 1500);

        } catch (err) {
            showStatus('error', '❌ Error: ' + esc(err.message));
            progressEl.style.display = 'none';
            console.error(err);
        }
        checkReady();
    });

    /* ====== Download (File System Access API) ====== */
    async function downloadBytes(bytes, filename) {
        if (window.showSaveFilePicker) {
            try {
                var handle = await window.showSaveFilePicker({
                    suggestedName: filename,
                    types: [{ description: 'PDF Document', accept: { 'application/pdf': ['.pdf'] } }]
                });
                var writable = await handle.createWritable();
                await writable.write(bytes);
                await writable.close();
                return;
            } catch (e) {
                if (e.name === 'AbortError') return;
            }
        }
        var blob = new Blob([bytes], { type: 'application/octet-stream' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a'); a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
    }

    /* ====== Status ====== */
    function showStatus(type, msg) {
        statusEl.className = 'pdf-status ' + type;
        statusEl.innerHTML = type === 'loading' ? '<div class="pdf-spinner"></div>' + msg : msg;
    }
    function hideStatus() { statusEl.className = 'pdf-status'; statusEl.style.display = 'none'; }
    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
})();
