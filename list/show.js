const urlApi = 'https://api.ipify.org?format=json'
        function getPublicIP() {
            fetch(urlApi)
                .then(response => response.json())
                .then(data => {
                    document.getElementById('public-ip').textContent = 'Public IP: ' + data.ip;
                })
                .catch(error => {
                    console.error('Error fetching the public IP:', error);
                    document.getElementById('public-ip').textContent = 'Unable to fetch public IP';
                });
        }

        async function getLocalIP() {
            const peerConnection = new RTCPeerConnection({
                iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
            });

            peerConnection.createDataChannel(""); // Create a bogus data channel

            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            return new Promise((resolve, reject) => {
                peerConnection.onicecandidate = (event) => {
                    if (!event || !event.candidate) {
                        reject(new Error("Gagal mengumpulkan kandidat ICE"));
                        return;
                    }

                    const candidate = event.candidate.candidate;
                    const parts = candidate.split(" ");
                    const ip = parts[4];
                    const type = parts[7];

                    if (type === "host") {
                        resolve(ip);
                        peerConnection.close();
                    }
                };
            });
        }

        getPublicIP();

        getLocalIP().then((ip) => {
            document.getElementById('local-ip').textContent = 'Local IP: ' + ip;
        }).catch((error) => {
            console.error('Error fetching local IP:', error);
            document.getElementById('local-ip').textContent = 'Unable to fetch local IP';
        });

        function ipToBinary(ip) {
            return ip.split('.').map(function(octet) {
                return ('00000000' + parseInt(octet, 10).toString(2)).slice(-8);
            }).join('');
        }

        function binaryToIp(binary) {
            return binary.match(/.{1,8}/g).map(function(byte) {
                return parseInt(byte, 2);
            }).join('.');
        }

        function calculateBroadcastAddress(ip, subnetMask) {
            const ipBinary = ipToBinary(ip);
            const subnetBinary = ipToBinary(subnetMask);

            // Calculate the network part and broadcast address
            const networkPart = ipBinary.slice(0, subnetBinary.indexOf('0'));
            const broadcastBinary = networkPart + '1'.repeat(32 - networkPart.length);

            return binaryToIp(broadcastBinary);
        }

        function updateBroadcastIP() {
            const ip = document.getElementById('ip-address').value.trim();
            const subnetMask = document.getElementById('subnet-mask').value.trim();

            if (!ip || !subnetMask) {
                document.getElementById('broadcast-ip').textContent = 'Please enter both IP address and subnet mask.';
                return;
            }

            // Validate IP and subnet mask format (simple validation)
            const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            const maskPattern = /^(255|254|252|248|240|224|192|128|0)\.(255|254|252|248|240|224|192|128|0)\.(255|254|252|248|240|224|192|128|0)\.(255|254|252|248|240|224|192|128|0)$/;

            if (!ipPattern.test(ip) || !maskPattern.test(subnetMask)) {
                document.getElementById('broadcast-ip').textContent = 'Invalid IP address or subnet mask format.';
                return;
            }

            const broadcastIp = calculateBroadcastAddress(ip, subnetMask);
            document.getElementById('broadcast-ip').textContent = 'Broadcast IP: ' + broadcastIp;
        }