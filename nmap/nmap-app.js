/* Nmap Command Builder — Application Logic */
(function () {
    'use strict';

    var optsContainer = document.getElementById('nmap-opts');
    var presetBar = document.getElementById('preset-bar');
    var cmdBox = document.getElementById('cmd-box');
    var copyBtn = document.getElementById('copy-btn');
    var resetBtn = document.getElementById('reset-btn');

    var state = {}; // id -> value
    var nseCats = []; // active NSE categories

    /* ====== Render Option Sections ====== */
    function renderSections() {
        NMAP.SECTIONS.forEach(function (sec) {
            var div = document.createElement('div');
            div.className = 'opt-section';
            div.innerHTML = '<h3><span>' + sec.icon + '</span> ' + sec.title + '</h3>';
            var content = document.createElement('div');

            sec.fields.forEach(function (f) {
                if (f.type === 'radio') renderRadio(content, f);
                else if (f.type === 'check') renderCheck(content, f);
                else if (f.type === 'text') renderText(content, f);
                else if (f.type === 'select') renderSelect(content, f);
                else if (f.type === 'nse_cats') renderNseCats(content, f);
            });

            div.appendChild(content);
            optsContainer.appendChild(div);
        });
    }

    function renderRadio(parent, f) {
        var row = document.createElement('div');
        row.className = 'opt-row';
        f.options.forEach(function (opt) {
            var lbl = document.createElement('label');
            lbl.className = 'chk-label radio-label';
            var inp = document.createElement('input');
            inp.type = 'radio';
            inp.name = f.id;
            inp.value = opt.val;
            if (opt.val === '') inp.checked = true;
            inp.addEventListener('change', function () {
                state[f.id] = this.value;
                if (f.id === 'ports' && this.value === 'custom') {
                    showConditional('ports_custom_show', true);
                } else if (f.id === 'ports') {
                    showConditional('ports_custom_show', false);
                }
                buildCommand();
            });
            lbl.appendChild(inp);
            lbl.appendChild(document.createTextNode(' ' + opt.label));
            if (opt.tt) {
                var tt = document.createElement('span');
                tt.className = 'chk-tt';
                tt.textContent = ' ' + opt.tt;
                lbl.appendChild(tt);
            }
            row.appendChild(lbl);
        });
        parent.appendChild(row);
    }

    function renderCheck(parent, f) {
        var label = document.createElement('label');
        label.className = 'chk-label';
        var inp = document.createElement('input');
        inp.type = 'checkbox';
        inp.id = 'chk-' + f.id;
        inp.addEventListener('change', function () {
            state[f.id] = this.checked;
            if (f.id) showConditional(f.id, this.checked);
            buildCommand();
        });
        label.appendChild(inp);
        label.appendChild(document.createTextNode(' ' + f.label));
        if (f.tt) {
            var tt = document.createElement('span');
            tt.className = 'chk-tt';
            tt.textContent = ' ' + f.tt;
            label.appendChild(tt);
        }
        // Wrap in a row or append inline
        var row = parent.lastElementChild;
        if (!row || !row.classList.contains('opt-row') || row.dataset.type !== 'checks') {
            row = document.createElement('div');
            row.className = 'opt-row';
            row.dataset.type = 'checks';
            parent.appendChild(row);
        }
        row.appendChild(label);
    }

    function renderText(parent, f) {
        var wrap = document.createElement('div');
        wrap.className = 'opt-input';
        if (f.showIf) {
            wrap.dataset.showIf = f.showIf;
            wrap.style.display = 'none';
        }
        if (f.wide) wrap.style.flex = '1 1 100%';
        var lbl = document.createElement('label');
        lbl.textContent = f.label;
        lbl.setAttribute('for', 'inp-' + f.id);
        var inp = document.createElement('input');
        inp.type = 'text';
        inp.id = 'inp-' + f.id;
        inp.placeholder = f.placeholder || '';
        if (f.wide) inp.style.width = '100%';
        inp.addEventListener('input', function () {
            state[f.id] = this.value.trim();
            buildCommand();
        });
        wrap.appendChild(lbl);
        wrap.appendChild(inp);
        if (f.help) {
            var help = document.createElement('span');
            help.style.cssText = 'font-size:.7rem;color:rgba(255,255,255,.3)';
            help.textContent = f.help;
            wrap.appendChild(help);
        }
        var row = document.createElement('div');
        row.className = 'opt-row';
        row.appendChild(wrap);
        parent.appendChild(row);
    }

    function renderSelect(parent, f) {
        var wrap = document.createElement('div');
        wrap.className = 'opt-input';
        var lbl = document.createElement('label');
        lbl.textContent = f.label;
        var sel = document.createElement('select');
        sel.id = 'sel-' + f.id;
        f.options.forEach(function (o) {
            var opt = document.createElement('option');
            opt.value = o.val;
            opt.textContent = o.label;
            sel.appendChild(opt);
        });
        sel.addEventListener('change', function () {
            state[f.id] = this.value;
            buildCommand();
        });
        wrap.appendChild(lbl);
        wrap.appendChild(sel);
        var row = document.createElement('div');
        row.className = 'opt-row';
        row.appendChild(wrap);
        parent.appendChild(row);
    }

    function renderNseCats(parent, f) {
        var row = document.createElement('div');
        row.className = 'opt-row';
        var lbl = document.createElement('label');
        lbl.style.cssText = 'font-size:.78rem;color:rgba(255,255,255,.55);width:100%;margin-bottom:.25rem';
        lbl.textContent = f.label + ':';
        row.appendChild(lbl);
        var cats = document.createElement('div');
        cats.className = 'nse-cats';
        f.cats.forEach(function (cat) {
            var chip = document.createElement('span');
            chip.className = 'nse-chip';
            chip.textContent = cat;
            chip.dataset.cat = cat;
            chip.addEventListener('click', function () {
                var idx = nseCats.indexOf(cat);
                if (idx === -1) { nseCats.push(cat); chip.classList.add('active'); }
                else { nseCats.splice(idx, 1); chip.classList.remove('active'); }
                buildCommand();
            });
            cats.appendChild(chip);
        });
        row.appendChild(cats);
        parent.appendChild(row);
    }

    /* ====== Conditional show/hide ====== */
    function showConditional(key, show) {
        var els = document.querySelectorAll('[data-show-if="' + key + '"]');
        for (var i = 0; i < els.length; i++) {
            els[i].style.display = show ? '' : 'none';
        }
    }

    /* ====== Presets ====== */
    function renderPresets() {
        NMAP.PRESETS.forEach(function (p, idx) {
            var btn = document.createElement('button');
            btn.className = 'preset-btn';
            btn.textContent = p.name;
            btn.title = p.desc;
            btn.type = 'button';
            btn.dataset.idx = idx;
            btn.addEventListener('click', function () {
                // Highlight active preset
                var all = presetBar.querySelectorAll('.preset-btn');
                for (var i = 0; i < all.length; i++) all[i].classList.remove('active');
                btn.classList.add('active');
                applyPreset(p);
            });
            presetBar.appendChild(btn);
        });
    }

    function applyPreset(preset) {
        resetAll();
        var s = preset.set;
        for (var key in s) {
            if (key === 'nseCategories') {
                nseCats = s[key].slice();
                var chips = document.querySelectorAll('.nse-chip');
                for (var c = 0; c < chips.length; c++) {
                    if (nseCats.indexOf(chips[c].dataset.cat) !== -1) chips[c].classList.add('active');
                }
                continue;
            }
            var val = s[key];
            // Radio
            var radio = document.querySelector('input[type="radio"][name="' + key + '"][value="' + val + '"]');
            if (radio) { radio.checked = true; state[key] = val; continue; }
            // Checkbox
            if (val === true) {
                var chk = document.getElementById('chk-' + key);
                if (chk) { chk.checked = true; state[key] = true; showConditional(key, true); continue; }
            }
            // Text
            var inp = document.getElementById('inp-' + key);
            if (inp) { inp.value = val; state[key] = val; continue; }
            // Select
            var sel = document.getElementById('sel-' + key);
            if (sel) { sel.value = val; state[key] = val; continue; }
            // Fallback — store in state
            state[key] = val;
        }
        // Handle custom ports
        if (s.ports === 'custom' || (s.ports && s.ports.indexOf('-p ') === 0)) {
            var portRadio = document.querySelector('input[type="radio"][name="ports"][value="custom"]');
            if (portRadio && s.ports.indexOf('-p ') === 0) {
                portRadio.checked = true;
                state['ports'] = 'custom';
                showConditional('ports_custom_show', true);
                var portInp = document.getElementById('inp-ports_custom');
                if (portInp) { portInp.value = s.ports.replace('-p ', ''); state['ports_custom'] = s.ports.replace('-p ', ''); }
            } else if (s.ports && s.ports.indexOf('-p ') === 0) {
                portRadio = document.querySelector('input[type="radio"][name="ports"][value="custom"]');
                if (portRadio) portRadio.checked = true;
                state['ports'] = 'custom';
                showConditional('ports_custom_show', true);
                var p2 = document.getElementById('inp-ports_custom');
                if (p2) { p2.value = s.ports.replace('-p ', ''); state['ports_custom'] = s.ports.replace('-p ', ''); }
            }
        }
        buildCommand();
    }

    /* ====== Reset ====== */
    function resetAll() {
        state = {};
        nseCats = [];
        // Clear active preset
        var presetBtns = presetBar.querySelectorAll('.preset-btn');
        for (var i = 0; i < presetBtns.length; i++) presetBtns[i].classList.remove('active');
        // Reset all inputs
        var radios = optsContainer.querySelectorAll('input[type="radio"]');
        for (var i = 0; i < radios.length; i++) { radios[i].checked = radios[i].value === ''; }
        var checks = optsContainer.querySelectorAll('input[type="checkbox"]');
        for (var i = 0; i < checks.length; i++) { checks[i].checked = false; }
        var texts = optsContainer.querySelectorAll('input[type="text"]');
        for (var i = 0; i < texts.length; i++) { texts[i].value = ''; }
        var selects = optsContainer.querySelectorAll('select');
        for (var i = 0; i < selects.length; i++) { selects[i].selectedIndex = 0; }
        var chips = document.querySelectorAll('.nse-chip');
        for (var i = 0; i < chips.length; i++) { chips[i].classList.remove('active'); }
        // Hide conditionals
        var conds = document.querySelectorAll('[data-show-if]');
        for (var i = 0; i < conds.length; i++) { conds[i].style.display = 'none'; }
        buildCommand();
    }

    /* ====== Build Nmap Command ====== */
    function buildCommand() {
        var parts = [];
        var s = state;

        // Scan type
        if (s.scanType) parts.push(s.scanType);

        // Host discovery
        if (s.Pn) parts.push('-Pn');
        if (s.PS) { parts.push(s.PS_ports ? '-PS' + s.PS_ports : '-PS'); }
        if (s.PA) { parts.push(s.PA_ports ? '-PA' + s.PA_ports : '-PA'); }
        if (s.PU) { parts.push(s.PU_ports ? '-PU' + s.PU_ports : '-PU'); }
        if (s.PE) parts.push('-PE');
        if (s.PP) parts.push('-PP');
        if (s.PM) parts.push('-PM');
        if (s.PO) parts.push('-PO');
        if (s.PR) parts.push('-PR');
        if (s.n_dns) parts.push('-n');
        if (s.R_dns) parts.push('-R');
        if (s.dns_servers) parts.push('--dns-servers ' + s.dns_servers);

        // Ports
        if (s.ports === '-F') parts.push('-F');
        else if (s.ports === '-p-') parts.push('-p-');
        else if (s.ports === 'custom' && s.ports_custom) parts.push('-p ' + s.ports_custom);
        if (s.top_ports) parts.push('--top-ports ' + s.top_ports);
        if (s.port_ratio) parts.push('--port-ratio ' + s.port_ratio);
        if (s.r_norand) parts.push('-r');

        // Service/Version
        if (s.sV) parts.push('-sV');
        if (s.version_intensity) parts.push('--version-intensity ' + s.version_intensity);
        if (s.version_light) parts.push('--version-light');
        if (s.version_all) parts.push('--version-all');
        if (s.version_trace) parts.push('--version-trace');

        // OS
        if (s.O) parts.push('-O');
        if (s.osscan_limit) parts.push('--osscan-limit');
        if (s.osscan_guess) parts.push('--osscan-guess');
        if (s.max_os_tries) parts.push('--max-os-tries ' + s.max_os_tries);

        // Aggressive
        if (s.A) parts.push('-A');

        // Scripts
        if (s.sC) parts.push('-sC');
        var scriptParts = [];
        if (nseCats.length > 0) scriptParts = scriptParts.concat(nseCats);
        if (s.nseCustom) scriptParts.push(s.nseCustom);
        if (scriptParts.length > 0) parts.push('--script ' + scriptParts.join(','));
        if (s.script_args) parts.push('--script-args "' + s.script_args + '"');
        if (s.script_args_file) parts.push('--script-args-file ' + s.script_args_file);
        if (s.script_trace) parts.push('--script-trace');
        if (s.script_updatedb) parts.push('--script-updatedb');

        // Custom scanflags
        if (s.scanflags_custom && s.scanflags) parts.push('--scanflags ' + s.scanflags);

        // Timing
        if (s.timing) parts.push(s.timing);
        if (s.min_rate) parts.push('--min-rate ' + s.min_rate);
        if (s.max_rate) parts.push('--max-rate ' + s.max_rate);
        if (s.min_parallelism) parts.push('--min-parallelism ' + s.min_parallelism);
        if (s.max_parallelism) parts.push('--max-parallelism ' + s.max_parallelism);
        if (s.min_hostgroup) parts.push('--min-hostgroup ' + s.min_hostgroup);
        if (s.max_hostgroup) parts.push('--max-hostgroup ' + s.max_hostgroup);
        if (s.max_retries) parts.push('--max-retries ' + s.max_retries);
        if (s.host_timeout) parts.push('--host-timeout ' + s.host_timeout);
        if (s.scan_delay) parts.push('--scan-delay ' + s.scan_delay);
        if (s.max_scan_delay) parts.push('--max-scan-delay ' + s.max_scan_delay);
        if (s.initial_rtt_timeout) parts.push('--initial-rtt-timeout ' + s.initial_rtt_timeout);
        if (s.max_rtt_timeout) parts.push('--max-rtt-timeout ' + s.max_rtt_timeout);
        if (s.min_rtt_timeout) parts.push('--min-rtt-timeout ' + s.min_rtt_timeout);

        // Evasion
        if (s.frag && !s.frag2) parts.push('-f');
        if (s.frag2) parts.push('-f -f');
        if (s.mtu) parts.push('--mtu ' + s.mtu);
        if (s.D_decoys) parts.push('-D ' + s.D_decoys);
        if (s.S_source) parts.push('-S ' + s.S_source);
        if (s.e_iface) parts.push('-e ' + s.e_iface);
        if (s.g_source_port) parts.push('-g ' + s.g_source_port);
        if (s.data_length) parts.push('--data-length ' + s.data_length);
        if (s.ttl) parts.push('--ttl ' + s.ttl);
        if (s.spoof_mac) parts.push('--spoof-mac ' + s.spoof_mac);
        if (s.badsum) parts.push('--badsum');
        if (s.adler32) parts.push('--adler32');
        if (s.ip_options) parts.push('--ip-options ' + s.ip_options);
        if (s.send_eth) parts.push('--send-eth');
        if (s.send_ip) parts.push('--send-ip');

        // Output
        if (s.oN) parts.push('-oN ' + s.oN);
        if (s.oX) parts.push('-oX ' + s.oX);
        if (s.oG) parts.push('-oG ' + s.oG);
        if (s.oS) parts.push('-oS ' + s.oS);
        if (s.oA) parts.push('-oA ' + s.oA);
        if (s.vv) parts.push('-vv');
        else if (s.v) parts.push('-v');
        if (s.dd_debug) parts.push('-dd');
        else if (s.d_debug) parts.push('-d');
        if (s.reason) parts.push('--reason');
        if (s.open) parts.push('--open');
        if (s.packet_trace) parts.push('--packet-trace');
        if (s.append_output) parts.push('--append-output');
        if (s.stylesheet) parts.push('--stylesheet ' + s.stylesheet);

        // Misc
        if (s.ipv6) parts.push('-6');
        if (s.privileged) parts.push('--privileged');
        if (s.unprivileged) parts.push('--unprivileged');
        if (s.no_stylesheet) parts.push('--no-stylesheet');
        if (s.datadir) parts.push('--datadir ' + s.datadir);
        if (s.servicedb) parts.push('--servicedb ' + s.servicedb);
        if (s.versiondb) parts.push('--versiondb ' + s.versiondb);
        if (s.traceroute) parts.push('--traceroute');

        // Extra raw
        if (s.extra_raw) parts.push(s.extra_raw);

        // Target input
        if (s.iL) parts.push('-iL ' + s.iL);
        if (s.exclude) parts.push('--exclude ' + s.exclude);
        if (s.excludefile) parts.push('--excludefile ' + s.excludefile);

        // Target last
        var target = s.target || '<target>';

        // Build highlighted HTML
        var html = '<span class="cmd-nmap">nmap</span>';
        parts.forEach(function (p) {
            html += ' ';
            // Split flag from value
            var match = p.match(/^(-{1,2}[a-zA-Z0-9_-]+)(.*)/);
            if (match) {
                html += '<span class="cmd-flag">' + esc(match[1]) + '</span>';
                if (match[2]) html += '<span class="cmd-val">' + esc(match[2]) + '</span>';
            } else {
                html += '<span class="cmd-flag">' + esc(p) + '</span>';
            }
        });
        html += ' <span class="cmd-target">' + esc(target) + '</span>';

        cmdBox.innerHTML = html;
    }

    function esc(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function getPlainCommand() {
        return cmdBox.textContent || cmdBox.innerText;
    }

    /* ====== Copy ====== */
    copyBtn.addEventListener('click', function () {
        navigator.clipboard.writeText(getPlainCommand()).then(function () {
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('copied');
            setTimeout(function () { copyBtn.textContent = 'Copy Command'; copyBtn.classList.remove('copied'); }, 2000);
        });
    });

    resetBtn.addEventListener('click', resetAll);

    /* ====== Advanced Toggle ====== */
    var advToggle = document.getElementById('adv-toggle');
    var advBody = document.getElementById('adv-body');
    var advChevron = document.getElementById('adv-chevron');
    advToggle.addEventListener('click', function () {
        advBody.classList.toggle('open');
        advChevron.classList.toggle('open');
    });

    /* ====== Init ====== */
    renderSections();
    renderPresets();
    buildCommand();
})();
