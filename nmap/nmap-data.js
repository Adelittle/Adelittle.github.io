/* Nmap Command Builder — Options Data */
var NMAP = {};

NMAP.PRESETS = [
    { name: 'Quick Scan', desc: 'Fast scan top 100 ports', set: { scanType: '-sS', timing: '-T4', ports: '-F', target: '192.168.1.0/24' } },
    { name: 'Intense Scan', desc: 'SYN + Version + OS + Scripts', set: { scanType: '-sS', sV: true, O: true, sC: true, timing: '-T4', target: '192.168.1.1' } },
    { name: 'Full TCP', desc: 'All 65535 TCP ports', set: { scanType: '-sS', ports: '-p-', timing: '-T4', target: '192.168.1.1' } },
    { name: 'UDP Scan', desc: 'Top UDP ports', set: { scanType: '-sU', timing: '-T4', target: '192.168.1.1' } },
    { name: 'Stealth Scan', desc: 'Evasive SYN scan', set: { scanType: '-sS', timing: '-T2', frag: true, 'data-length': '24', target: '192.168.1.1' } },
    { name: 'Ping Sweep', desc: 'Host discovery only', set: { scanType: '-sn', target: '192.168.1.0/24' } },
    { name: 'Vuln Scan', desc: 'Run vuln NSE scripts', set: { scanType: '-sS', sV: true, nseCategories: ['vuln'], timing: '-T4', target: '192.168.1.1' } },
    { name: 'Web Recon', desc: 'HTTP enum + headers', set: { scanType: '-sS', sV: true, ports: '-p 80,443,8080,8443', nseCustom: 'http-enum,http-headers,http-methods,http-title', timing: '-T4', target: 'example.com' } },
    { name: 'Aggressive', desc: 'OS + Version + Scripts + Traceroute', set: { scanType: '-sS', A: true, timing: '-T4', target: '192.168.1.1' } },
    { name: 'Firewall Detect', desc: 'ACK scan for firewall rules', set: { scanType: '-sA', timing: '-T4', target: '192.168.1.1' } },
];

NMAP.SECTIONS = [
    {
        id: 'target', title: 'Target', icon: '🎯',
        fields: [
            { type: 'text', id: 'target', label: 'Target(s)', placeholder: '192.168.1.1, 10.0.0.0/24, example.com', wide: true, help: 'IP, CIDR, hostname, range (10.0.0.1-50), or file (-iL)' },
            { type: 'text', id: 'iL', label: 'Target file (-iL)', placeholder: '/path/to/targets.txt' },
            { type: 'text', id: 'exclude', label: 'Exclude (--exclude)', placeholder: '192.168.1.1,192.168.1.2' },
            { type: 'text', id: 'excludefile', label: 'Exclude file (--excludefile)', placeholder: '/path/to/exclude.txt' },
        ]
    },
    {
        id: 'scantype', title: 'Scan Technique', icon: '📡',
        fields: [
            {
                type: 'radio', id: 'scanType', options: [
                    { val: '', label: 'Default' },
                    { val: '-sS', label: 'SYN Stealth', tt: '-sS' },
                    { val: '-sT', label: 'TCP Connect', tt: '-sT' },
                    { val: '-sU', label: 'UDP', tt: '-sU' },
                    { val: '-sA', label: 'ACK', tt: '-sA' },
                    { val: '-sW', label: 'Window', tt: '-sW' },
                    { val: '-sM', label: 'Maimon', tt: '-sM' },
                    { val: '-sN', label: 'TCP Null', tt: '-sN' },
                    { val: '-sF', label: 'FIN', tt: '-sF' },
                    { val: '-sX', label: 'Xmas', tt: '-sX' },
                    { val: '-sn', label: 'Ping Only', tt: '-sn' },
                    { val: '-sL', label: 'List Scan', tt: '-sL' },
                    { val: '-sY', label: 'SCTP INIT', tt: '-sY' },
                    { val: '-sZ', label: 'SCTP Cookie', tt: '-sZ' },
                    { val: '-sO', label: 'IP Protocol', tt: '-sO' },
                    { val: '-b', label: 'FTP Bounce', tt: '-b' },
                ]
            },
            { type: 'check', id: 'scanflags_custom', label: 'Custom scanflags', tt: '--scanflags' },
            { type: 'text', id: 'scanflags', label: '--scanflags', placeholder: 'URG,ACK,PSH,RST,SYN,FIN', showIf: 'scanflags_custom' },
        ]
    },
    {
        id: 'discovery', title: 'Host Discovery', icon: '🔎',
        fields: [
            { type: 'check', id: 'Pn', label: 'Skip host discovery', tt: '-Pn' },
            { type: 'check', id: 'PS', label: 'TCP SYN ping', tt: '-PS' },
            { type: 'text', id: 'PS_ports', label: '-PS ports', placeholder: '22,80,443', showIf: 'PS' },
            { type: 'check', id: 'PA', label: 'TCP ACK ping', tt: '-PA' },
            { type: 'text', id: 'PA_ports', label: '-PA ports', placeholder: '80,443', showIf: 'PA' },
            { type: 'check', id: 'PU', label: 'UDP ping', tt: '-PU' },
            { type: 'text', id: 'PU_ports', label: '-PU ports', placeholder: '40125', showIf: 'PU' },
            { type: 'check', id: 'PE', label: 'ICMP Echo', tt: '-PE' },
            { type: 'check', id: 'PP', label: 'ICMP Timestamp', tt: '-PP' },
            { type: 'check', id: 'PM', label: 'ICMP Netmask', tt: '-PM' },
            { type: 'check', id: 'PO', label: 'IP Protocol ping', tt: '-PO' },
            { type: 'check', id: 'PR', label: 'ARP ping', tt: '-PR' },
            { type: 'check', id: 'traceroute', label: 'Traceroute', tt: '--traceroute' },
            { type: 'check', id: 'n_dns', label: 'No DNS resolution', tt: '-n' },
            { type: 'check', id: 'R_dns', label: 'Always resolve DNS', tt: '-R' },
            { type: 'text', id: 'dns_servers', label: '--dns-servers', placeholder: '8.8.8.8,1.1.1.1' },
        ]
    },
    {
        id: 'ports', title: 'Port Specification', icon: '🔌',
        fields: [
            {
                type: 'radio', id: 'ports', options: [
                    { val: '', label: 'Default (top 1000)' },
                    { val: '-F', label: 'Fast (top 100)', tt: '-F' },
                    { val: '-p-', label: 'All 65535', tt: '-p-' },
                    { val: 'custom', label: 'Custom' },
                ]
            },
            { type: 'text', id: 'ports_custom', label: '-p ports', placeholder: '22,80,443,8080 or 1-1024', showIf: 'ports_custom_show' },
            { type: 'text', id: 'top_ports', label: '--top-ports', placeholder: '200' },
            { type: 'text', id: 'port_ratio', label: '--port-ratio', placeholder: '0.5' },
            { type: 'check', id: 'r_norand', label: 'Don\'t randomize ports', tt: '-r' },
        ]
    },
    {
        id: 'svcdetect', title: 'Service / Version Detection', icon: '🔬',
        fields: [
            { type: 'check', id: 'sV', label: 'Version detection', tt: '-sV' },
            {
                type: 'select', id: 'version_intensity', label: '--version-intensity',
                options: [
                    { val: '', label: 'Default (7)' },
                    { val: '0', label: '0 (lightest)' }, { val: '1', label: '1' }, { val: '2', label: '2 (light)' },
                    { val: '3', label: '3' }, { val: '4', label: '4' }, { val: '5', label: '5' },
                    { val: '6', label: '6' }, { val: '7', label: '7 (default)' }, { val: '8', label: '8' },
                    { val: '9', label: '9 (all probes)' },
                ]
            },
            { type: 'check', id: 'version_light', label: 'Light mode (intensity 2)', tt: '--version-light' },
            { type: 'check', id: 'version_all', label: 'Try all probes', tt: '--version-all' },
            { type: 'check', id: 'version_trace', label: 'Trace version scan', tt: '--version-trace' },
        ]
    },
    {
        id: 'osdetect', title: 'OS Detection', icon: '💻',
        fields: [
            { type: 'check', id: 'O', label: 'OS detection', tt: '-O' },
            { type: 'check', id: 'osscan_limit', label: 'Limit to promising hosts', tt: '--osscan-limit' },
            { type: 'check', id: 'osscan_guess', label: 'Guess aggressively', tt: '--osscan-guess' },
            { type: 'text', id: 'max_os_tries', label: '--max-os-tries', placeholder: '5' },
        ]
    },
    {
        id: 'scripts', title: 'NSE Scripts', icon: '📜',
        fields: [
            { type: 'check', id: 'sC', label: 'Default scripts', tt: '-sC' },
            { type: 'check', id: 'A', label: 'Aggressive (OS+Ver+Scripts+Trace)', tt: '-A' },
            {
                type: 'nse_cats', id: 'nseCategories', label: 'Script categories',
                cats: ['auth', 'broadcast', 'brute', 'default', 'discovery', 'dos', 'exploit', 'external', 'fuzzer', 'intrusive', 'malware', 'safe', 'version', 'vuln']
            },
            { type: 'text', id: 'nseCustom', label: '--script', placeholder: 'http-enum,smb-vuln-*,ssl-cert', wide: true },
            { type: 'text', id: 'script_args', label: '--script-args', placeholder: 'user=admin,pass=password', wide: true },
            { type: 'text', id: 'script_args_file', label: '--script-args-file', placeholder: '/path/to/args.txt' },
            { type: 'check', id: 'script_trace', label: 'Script trace', tt: '--script-trace' },
            { type: 'check', id: 'script_updatedb', label: 'Update script DB', tt: '--script-updatedb' },
        ]
    },
    {
        id: 'timing', title: 'Timing & Performance', icon: '⏱️',
        fields: [
            {
                type: 'radio', id: 'timing', options: [
                    { val: '', label: 'Default (T3)' },
                    { val: '-T0', label: 'T0 Paranoid', tt: '-T0' },
                    { val: '-T1', label: 'T1 Sneaky', tt: '-T1' },
                    { val: '-T2', label: 'T2 Polite', tt: '-T2' },
                    { val: '-T3', label: 'T3 Normal', tt: '-T3' },
                    { val: '-T4', label: 'T4 Aggressive', tt: '-T4' },
                    { val: '-T5', label: 'T5 Insane', tt: '-T5' },
                ]
            },
            { type: 'text', id: 'min_rate', label: '--min-rate', placeholder: '100' },
            { type: 'text', id: 'max_rate', label: '--max-rate', placeholder: '1000' },
            { type: 'text', id: 'min_parallelism', label: '--min-parallelism', placeholder: '10' },
            { type: 'text', id: 'max_parallelism', label: '--max-parallelism', placeholder: '256' },
            { type: 'text', id: 'min_hostgroup', label: '--min-hostgroup', placeholder: '16' },
            { type: 'text', id: 'max_hostgroup', label: '--max-hostgroup', placeholder: '256' },
            { type: 'text', id: 'max_retries', label: '--max-retries', placeholder: '3' },
            { type: 'text', id: 'host_timeout', label: '--host-timeout', placeholder: '30m' },
            { type: 'text', id: 'scan_delay', label: '--scan-delay', placeholder: '1s' },
            { type: 'text', id: 'max_scan_delay', label: '--max-scan-delay', placeholder: '10s' },
            { type: 'text', id: 'initial_rtt_timeout', label: '--initial-rtt-timeout', placeholder: '500ms' },
            { type: 'text', id: 'max_rtt_timeout', label: '--max-rtt-timeout', placeholder: '3s' },
            { type: 'text', id: 'min_rtt_timeout', label: '--min-rtt-timeout', placeholder: '100ms' },
        ]
    },
    {
        id: 'evasion', title: 'Firewall / IDS Evasion', icon: '🛡️',
        fields: [
            { type: 'check', id: 'frag', label: 'Fragment packets', tt: '-f' },
            { type: 'check', id: 'frag2', label: 'Double fragment (8-byte)', tt: '-ff' },
            { type: 'text', id: 'mtu', label: '--mtu', placeholder: '24' },
            { type: 'text', id: 'D_decoys', label: '-D decoys', placeholder: 'RND:5,ME,RND:3' },
            { type: 'text', id: 'S_source', label: '-S source IP', placeholder: '10.0.0.5' },
            { type: 'text', id: 'e_iface', label: '-e interface', placeholder: 'eth0' },
            { type: 'text', id: 'g_source_port', label: '-g source port', placeholder: '53' },
            { type: 'text', id: 'data_length', label: '--data-length', placeholder: '40' },
            { type: 'text', id: 'ttl', label: '--ttl', placeholder: '128' },
            { type: 'text', id: 'spoof_mac', label: '--spoof-mac', placeholder: '00:11:22:33:44:55 or Apple or 0' },
            { type: 'check', id: 'badsum', label: 'Bad checksum', tt: '--badsum' },
            { type: 'check', id: 'adler32', label: 'SCTP Adler32', tt: '--adler32' },
            { type: 'text', id: 'ip_options', label: '--ip-options', placeholder: 'R (record route), T (timestamp)' },
            { type: 'check', id: 'send_eth', label: 'Send raw ethernet', tt: '--send-eth' },
            { type: 'check', id: 'send_ip', label: 'Send raw IP', tt: '--send-ip' },
        ]
    },
    {
        id: 'output', title: 'Output', icon: '📄',
        fields: [
            { type: 'text', id: 'oN', label: 'Normal (-oN)', placeholder: 'scan.txt' },
            { type: 'text', id: 'oX', label: 'XML (-oX)', placeholder: 'scan.xml' },
            { type: 'text', id: 'oG', label: 'Grepable (-oG)', placeholder: 'scan.gnmap' },
            { type: 'text', id: 'oS', label: 'Script kiddie (-oS)', placeholder: 'scan.skid' },
            { type: 'text', id: 'oA', label: 'All formats (-oA)', placeholder: 'scan_all' },
            { type: 'check', id: 'v', label: 'Verbose', tt: '-v' },
            { type: 'check', id: 'vv', label: 'Very verbose', tt: '-vv' },
            { type: 'check', id: 'd_debug', label: 'Debug', tt: '-d' },
            { type: 'check', id: 'dd_debug', label: 'More debug', tt: '-dd' },
            { type: 'check', id: 'reason', label: 'Show reason', tt: '--reason' },
            { type: 'check', id: 'open', label: 'Only open ports', tt: '--open' },
            { type: 'check', id: 'packet_trace', label: 'Packet trace', tt: '--packet-trace' },
            { type: 'check', id: 'append_output', label: 'Append output', tt: '--append-output' },
            { type: 'text', id: 'stylesheet', label: '--stylesheet', placeholder: 'nmap.xsl' },
        ]
    },
    {
        id: 'misc', title: 'Miscellaneous', icon: '🔧',
        fields: [
            { type: 'check', id: 'ipv6', label: 'IPv6 scan', tt: '-6' },
            { type: 'check', id: 'privileged', label: 'Assume privileged', tt: '--privileged' },
            { type: 'check', id: 'unprivileged', label: 'Assume unprivileged', tt: '--unprivileged' },
            { type: 'check', id: 'no_stylesheet', label: 'No XML stylesheet', tt: '--no-stylesheet' },
            { type: 'text', id: 'datadir', label: '--datadir', placeholder: '/usr/share/nmap' },
            { type: 'text', id: 'servicedb', label: '--servicedb', placeholder: '/path/to/nmap-services' },
            { type: 'text', id: 'versiondb', label: '--versiondb', placeholder: '/path/to/nmap-service-probes' },
            { type: 'text', id: 'extra_raw', label: 'Extra raw flags', placeholder: '--any-other-flag', wide: true, help: 'Append any additional nmap flags verbatim' },
        ]
    },
];
