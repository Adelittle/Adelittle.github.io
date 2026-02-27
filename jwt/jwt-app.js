/* JWT Debugger — Application Logic */
(function () {
    'use strict';

    var encoded = document.getElementById('jwt-encoded');
    var overlay = document.getElementById('jwt-overlay');
    var headerBox = document.getElementById('jwt-header');
    var payloadBox = document.getElementById('jwt-payload');
    var algoSel = document.getElementById('jwt-algo');
    var secretInp = document.getElementById('jwt-secret');
    var b64Check = document.getElementById('jwt-b64secret');
    var verifyRes = document.getElementById('jwt-verify-result');
    var claimsInfo = document.getElementById('claims-info');
    var sampleBtn = document.getElementById('sample-btn');
    var clearBtn = document.getElementById('clear-btn');

    var SAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjIsInJvbGUiOiJhZG1pbiIsImlzcyI6Im5ha2Fub3NlYy10b29scyJ9.8pDF_39YQZB_3nw2xG0jsS-xOOtjGctHBbM-XCoxemk';

    /* ======= Base64URL helpers ======= */
    function b64urlEncode(str) {
        return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    function b64urlDecode(s) {
        s = s.replace(/-/g, '+').replace(/_/g, '/');
        while (s.length % 4) s += '=';
        return atob(s);
    }
    function utf8ToB64url(obj) {
        return b64urlEncode(unescape(encodeURIComponent(JSON.stringify(obj))));
    }
    function b64urlToUtf8(s) {
        try { return decodeURIComponent(escape(b64urlDecode(s))); }
        catch (e) { return b64urlDecode(s); }
    }

    /* ======= Escape HTML ======= */
    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    /* ======= Known claims ======= */
    var CLAIMS = {
        iss: 'Issuer', sub: 'Subject', aud: 'Audience', exp: 'Expiration Time',
        nbf: 'Not Before', iat: 'Issued At', jti: 'JWT ID',
        name: 'Full Name', email: 'Email', role: 'Role', scope: 'Scope',
        azp: 'Authorized Party', nonce: 'Nonce', auth_time: 'Auth Time',
        at_hash: 'Access Token Hash', c_hash: 'Code Hash',
    };

    /* ======= Overlay coloring ======= */
    function colorizeOverlay(jwt) {
        var parts = jwt.split('.');
        if (parts.length < 2) { overlay.innerHTML = esc(jwt); return; }
        var h = '<span class="jwt-h">' + esc(parts[0]) + '</span>';
        var p = '<span class="jwt-p">' + esc(parts[1]) + '</span>';
        var s = parts[2] ? '<span class="jwt-s">' + esc(parts[2]) + '</span>' : '';
        var rest = parts.slice(3).map(function (x) { return esc(x); }).join('.');
        overlay.innerHTML = h + '<span class="jwt-dot">.</span>' + p +
            (parts.length >= 3 ? '<span class="jwt-dot">.</span>' + s : '') +
            (rest ? '.' + rest : '');
    }

    /* ======= Sync overlay scroll ======= */
    encoded.addEventListener('scroll', function () {
        overlay.scrollTop = encoded.scrollTop;
        overlay.scrollLeft = encoded.scrollLeft;
    });

    /* ======= Decode JWT from encoded box ======= */
    function decodeFromEncoded() {
        var jwt = encoded.value.trim();
        colorizeOverlay(jwt);
        if (!jwt) { headerBox.value = ''; payloadBox.value = ''; verifyRes.innerHTML = ''; claimsInfo.innerHTML = ''; return; }
        var parts = jwt.split('.');
        if (parts.length < 2) { headerBox.value = '// Invalid JWT format'; payloadBox.value = ''; return; }
        try {
            var hdr = JSON.parse(b64urlToUtf8(parts[0]));
            headerBox.value = JSON.stringify(hdr, null, 2);
            // Set algo dropdown
            if (hdr.alg) {
                for (var i = 0; i < algoSel.options.length; i++) {
                    if (algoSel.options[i].value === hdr.alg) { algoSel.selectedIndex = i; break; }
                }
            }
        } catch (e) { headerBox.value = '// Cannot decode header: ' + e.message; }
        try {
            var payload = JSON.parse(b64urlToUtf8(parts[1]));
            payloadBox.value = JSON.stringify(payload, null, 2);
            renderClaims(payload);
        } catch (e) { payloadBox.value = '// Cannot decode payload: ' + e.message; claimsInfo.innerHTML = ''; }
        verifySignature();
    }

    /* ======= Encode JWT from decoded boxes ======= */
    function encodeFromDecoded() {
        try {
            var hdr = JSON.parse(headerBox.value);
            var payload = JSON.parse(payloadBox.value);
            var h64 = utf8ToB64url(hdr);
            var p64 = utf8ToB64url(payload);
            var signingInput = h64 + '.' + p64;

            var algo = algoSel.value;
            hdr.alg = algo;
            headerBox.value = JSON.stringify(hdr, null, 2);
            h64 = utf8ToB64url(hdr);
            signingInput = h64 + '.' + p64;

            if (algo === 'none') {
                encoded.value = signingInput + '.';
                colorizeOverlay(encoded.value);
                verifyRes.innerHTML = '<div class="jwt-verify-status unknown">⚠ Unsecured token (alg: none)</div>';
                renderClaims(payload);
                return;
            }

            if (ASYM_ALGOS.indexOf(algo) !== -1) {
                // Asymmetric: can't sign in-browser without private key, keep existing signature
                var existing = encoded.value.trim().split('.');
                var existingSig = (existing.length >= 3) ? existing[2] : 'REQUIRES_PRIVATE_KEY';
                encoded.value = signingInput + '.' + existingSig;
                colorizeOverlay(encoded.value);
                verifyRes.innerHTML = '<div class="jwt-verify-status unknown">⚠ ' + esc(algo) + ' requires private key to sign — paste signed token on the left to decode</div>';
                renderClaims(payload);
                return;
            }

            signHMAC(algo, signingInput).then(function (sig) {
                encoded.value = signingInput + '.' + sig;
                colorizeOverlay(encoded.value);
                verifyRes.innerHTML = '<div class="jwt-verify-status valid">✅ Signature Valid</div>';
                renderClaims(payload);
            }).catch(function (e) {
                encoded.value = signingInput + '.SIGNATURE_ERROR';
                colorizeOverlay(encoded.value);
                verifyRes.innerHTML = '<div class="jwt-verify-status invalid">❌ ' + esc(e.message) + '</div>';
            });
        } catch (e) {
            // Don't update if JSON is invalid
        }
    }

    /* ======= HMAC Signing with Web Crypto API ======= */
    var HMAC_MAP = { HS256: 'SHA-256', HS384: 'SHA-384', HS512: 'SHA-512' };
    var ASYM_ALGOS = ['RS256', 'RS384', 'RS512', 'PS256', 'PS384', 'PS512', 'ES256', 'ES384', 'ES512', 'EdDSA'];

    function getSecretBytes() {
        var secret = secretInp.value;
        if (b64Check.checked) {
            try {
                var raw = atob(secret.replace(/-/g, '+').replace(/_/g, '/'));
                var arr = new Uint8Array(raw.length);
                for (var i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
                return arr;
            } catch (e) { return new TextEncoder().encode(secret); }
        }
        return new TextEncoder().encode(secret);
    }

    function signHMAC(algo, data) {
        var hash = HMAC_MAP[algo];
        if (!hash) return Promise.reject(new Error('Unsupported algo: ' + algo));
        var keyBytes = getSecretBytes();
        return crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: hash }, false, ['sign'])
            .then(function (key) {
                return crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
            }).then(function (sig) {
                var bytes = new Uint8Array(sig);
                var binary = '';
                for (var i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
                return b64urlEncode(binary);
            });
    }

    function verifyHMAC(algo, data, expectedSig) {
        return signHMAC(algo, data).then(function (computed) {
            return computed === expectedSig;
        });
    }

    /* ======= Verify Signature ======= */
    function verifySignature() {
        var jwt = encoded.value.trim();
        var parts = jwt.split('.');
        if (parts.length < 3) { verifyRes.innerHTML = ''; return; }
        try {
            var hdr = JSON.parse(b64urlToUtf8(parts[0]));
            var algo = hdr.alg || algoSel.value;
            if (algo === 'none') {
                verifyRes.innerHTML = '<div class="jwt-verify-status unknown">⚠ Unsecured token (alg: none)</div>';
                return;
            }
            if (!HMAC_MAP[algo]) {
                if (ASYM_ALGOS.indexOf(algo) !== -1) {
                    verifyRes.innerHTML = '<div class="jwt-verify-status unknown">⚠ ' + esc(algo) + ' — paste your public key / certificate to verify (not yet supported in-browser)</div>';
                } else {
                    verifyRes.innerHTML = '<div class="jwt-verify-status unknown">⚠ ' + esc(algo) + ' verification not supported</div>';
                }
                return;
            }
            var signingInput = parts[0] + '.' + parts[1];
            verifyHMAC(algo, signingInput, parts[2]).then(function (valid) {
                if (valid) {
                    verifyRes.innerHTML = '<div class="jwt-verify-status valid">✅ Signature Verified</div>';
                } else {
                    verifyRes.innerHTML = '<div class="jwt-verify-status invalid">❌ Invalid Signature</div>';
                }
            }).catch(function () {
                verifyRes.innerHTML = '<div class="jwt-verify-status invalid">❌ Verification failed</div>';
            });
        } catch (e) {
            verifyRes.innerHTML = '<div class="jwt-verify-status unknown">⚠ Cannot parse header</div>';
        }
    }

    /* ======= Render Payload Claims Info ======= */
    function renderClaims(payload) {
        if (!payload || typeof payload !== 'object') { claimsInfo.innerHTML = ''; return; }
        var keys = Object.keys(payload);
        if (keys.length === 0) { claimsInfo.innerHTML = ''; return; }
        var html = '<table class="jwt-claims-table"><thead><tr><th>Claim</th><th>Value</th><th>Description</th></tr></thead><tbody>';
        keys.forEach(function (k) {
            var v = payload[k];
            var desc = CLAIMS[k] || '';
            var extra = '';
            if ((k === 'exp' || k === 'nbf' || k === 'iat' || k === 'auth_time') && typeof v === 'number') {
                var d = new Date(v * 1000);
                extra = d.toISOString();
                if (k === 'exp') {
                    if (d < new Date()) extra += ' <span class="jwt-exp-badge expired">EXPIRED</span>';
                    else extra += ' <span class="jwt-exp-badge active">ACTIVE</span>';
                }
            }
            var display = typeof v === 'object' ? JSON.stringify(v) : String(v);
            html += '<tr><td class="claim-name">' + esc(k) + '</td><td>' + esc(display) +
                (extra ? '<br><span style="font-size:.68rem;color:rgba(255,255,255,.35)">' + extra + '</span>' : '') +
                '</td><td class="claim-exp">' + esc(desc) + '</td></tr>';
        });
        html += '</tbody></table>';
        claimsInfo.innerHTML = html;
    }

    /* ======= Event Listeners ======= */
    encoded.addEventListener('input', decodeFromEncoded);
    headerBox.addEventListener('input', encodeFromDecoded);
    payloadBox.addEventListener('input', encodeFromDecoded);
    algoSel.addEventListener('change', function () {
        var algo = algoSel.value;
        // Update placeholder based on algo type
        if (HMAC_MAP[algo]) {
            secretInp.placeholder = 'your-256-bit-secret';
            secretInp.disabled = false;
        } else if (algo === 'none') {
            secretInp.placeholder = 'no secret needed';
            secretInp.disabled = true;
        } else {
            secretInp.placeholder = 'paste public key or certificate (PEM)';
            secretInp.disabled = false;
        }
        if (headerBox.value) {
            try {
                var h = JSON.parse(headerBox.value);
                h.alg = algo;
                headerBox.value = JSON.stringify(h, null, 2);
            } catch (e) { }
        }
        encodeFromDecoded();
    });
    secretInp.addEventListener('input', function () {
        var jwt = encoded.value.trim();
        if (jwt && jwt.split('.').length >= 3) verifySignature();
        else encodeFromDecoded();
    });
    b64Check.addEventListener('change', function () {
        var jwt = encoded.value.trim();
        if (jwt && jwt.split('.').length >= 3) verifySignature();
        else encodeFromDecoded();
    });

    /* ======= Sample & Clear ======= */
    sampleBtn.addEventListener('click', function () {
        encoded.value = SAMPLE_JWT;
        decodeFromEncoded();
    });
    clearBtn.addEventListener('click', function () {
        encoded.value = '';
        headerBox.value = '';
        payloadBox.value = '';
        overlay.innerHTML = '';
        verifyRes.innerHTML = '';
        claimsInfo.innerHTML = '';
        algoSel.selectedIndex = 0;
    });
})();
