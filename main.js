const qrText = document.getElementById('qr-text');
const sizes = document.getElementById('sizes');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const qrContainer = document.querySelector('.qr-body');
const colorDarkInput = document.getElementById('colorDark');
const colorLightInput = document.getElementById('colorLight');
const backgroundColorPicker = document.getElementById('backgroundColorPicker');
const messageBox = document.getElementById('messageBox');

// Elements for QR type selection (select dropdown)
const qrTypeSelect = document.getElementById('qrTypeSelect');
const textUrlInputDiv = document.getElementById('textUrlInput');
const wifiInputDiv = document.getElementById('wifiInput');
const phoneInputDiv = document.getElementById('phoneInput');
const contactInputDiv = document.getElementById('contactInput');
const geoInputDiv = document.getElementById('geoInput');
const smsInputDiv = document.getElementById('smsInput');
const emailInputDiv = document.getElementById('emailInput');
const whatsappInputDiv = document.getElementById('whatsappInput');
const instagramInputDiv = document.getElementById('instagramInput');

// Elements for Background type selection (new select dropdown)
const backgroundTypeSelect = document.getElementById('backgroundTypeSelect');

// Wi-Fi specific inputs
const wifiSsid = document.getElementById('wifi-ssid');
const wifiPassword = document.getElementById('wifi-password');
const wifiEncryption = document.getElementById('wifi-encryption');

// Phone specific inputs
const phoneNumber = document.getElementById('phone-number');

// Contact specific inputs
const contactName = document.getElementById('contact-name');
const contactPhone = document.getElementById('contact-phone');
const contactEmail = document.getElementById('contact-email');

// GEO specific inputs
const geoLatitude = document.getElementById('geo-latitude');
const geoLongitude = document.getElementById('geo-longitude');
const geoAltitude = document.getElementById('geo-altitude');

// SMS specific inputs
const smsNumber = document.getElementById('sms-number');
const smsMessage = document.getElementById('sms-message');

// Email specific inputs
const emailTo = document.getElementById('email-to');
const emailSubject = document.getElementById('email-subject');
const emailBody = document.getElementById('email-body');

// WhatsApp specific inputs
const whatsappNumber = document.getElementById('whatsapp-number');
const whatsappMessage = document.getElementById('whatsapp-message');

// Instagram specific input
const instagramUsername = document.getElementById('instagram-username');


let size = sizes.value; // Will now be 500px by default from HTML
let colorDark = colorDarkInput.value;
let colorLight; // Will be set based on backgroundTypeSelect
let currentQrType = qrTypeSelect.value;
let currentBackgroundType = backgroundTypeSelect.value; // Will now be 'transparent' by default from HTML

// Set initial colorLight based on default background type
if (currentBackgroundType === 'transparent') {
    colorLight = "#ffffff00";
} else {
    colorLight = colorLightInput.value;
}

// Initial state: color picker is hidden by default due to transparent background
// This is now handled directly in HTML style attribute for backgroundColorPicker


// Function to display messages in the UI
function showMessage(message, type = 'error') {
    messageBox.textContent = message;
    messageBox.style.display = 'block';
    if (type === 'error') {
        messageBox.className = 'message-box error-style';
    } else {
        messageBox.className = 'message-box success-style';
    }
    // Hide message after 3 seconds
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000);
}

// Function to switch input fields based on QR type selection
function switchQrTypeInputs() {
    textUrlInputDiv.classList.add('hidden');
    wifiInputDiv.classList.add('hidden');
    phoneInputDiv.classList.add('hidden');
    contactInputDiv.classList.add('hidden');
    geoInputDiv.classList.add('hidden');
    smsInputDiv.classList.add('hidden');
    emailInputDiv.classList.add('hidden');
    whatsappInputDiv.classList.add('hidden');
    instagramInputDiv.classList.add('hidden');

    if (currentQrType === 'text-url') {
        textUrlInputDiv.classList.remove('hidden');
    } else if (currentQrType === 'wifi') {
        wifiInputDiv.classList.remove('hidden');
    } else if (currentQrType === 'phone') {
        phoneInputDiv.classList.remove('hidden');
    } else if (currentQrType === 'contact') {
        contactInputDiv.classList.remove('hidden');
    } else if (currentQrType === 'geo') {
        geoInputDiv.classList.remove('hidden');
    } else if (currentQrType === 'sms') {
        smsInputDiv.classList.remove('hidden');
    } else if (currentQrType === 'email') {
        emailInputDiv.classList.remove('hidden');
    } else if (currentQrType === 'whatsapp') {
        whatsappInputDiv.classList.remove('hidden');
    } else if (currentQrType === 'instagram') {
        instagramInputDiv.classList.remove('hidden');
    }
    // Clear previous QR code and hide download button when switching types
    qrContainer.innerHTML = "";
    downloadBtn.classList.add('hidden');
}

// Add event listener for QR type select dropdown
qrTypeSelect.addEventListener('change', (e) => {
    currentQrType = e.target.value;
    switchQrTypeInputs();
});

// Event listener for background type select dropdown
backgroundTypeSelect.addEventListener('change', (e) => {
    currentBackgroundType = e.target.value;
    if (currentBackgroundType === 'colored') {
        backgroundColorPicker.style.display = 'flex'; // Show color picker
        colorLight = colorLightInput.value; // Use the current value of the color picker
    } else { // transparent
        backgroundColorPicker.style.display = 'none'; // Hide color picker
        colorLight = "#ffffff00"; // Set to transparent
    }
});

// Event listener for generate button - THIS IS THE PRIMARY TRIGGER FOR GENERATION
generateBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    generateQrCodeBasedOnType(); // Only generate when the button is pressed
});

// Event listener for size change
sizes.addEventListener('change',(e)=>{
    size = e.target.value;
});

// Event listener for dark color change
colorDarkInput.addEventListener('change',(e)=>{
    colorDark = e.target.value;
});

// Event listener for light color change (background)
colorLightInput.addEventListener('change',(e)=>{
    colorLight = e.target.value;
});

// Function to get current date in YYYY-MM-DD format
function getCurrentDateFormatted() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Event listener for download button
downloadBtn.addEventListener('click', ()=>{
    let img = document.querySelector('.qr-body img');
    const date = getCurrentDateFormatted();
    const filename = `hasil-download-${date}.png`;

    if(img !== null){
        let imgAtrr = img.getAttribute('src');
        downloadBtn.setAttribute("href", imgAtrr);
        downloadBtn.setAttribute("download", filename);
    }
    else{
        const canvas = document.querySelector('canvas');
        if (canvas) {
            downloadBtn.setAttribute("href", canvas.toDataURL());
            downloadBtn.setAttribute("download", filename);
        } else {
            showMessage("Harap hasilkan kode QR terlebih dahulu.");
            downloadBtn.removeAttribute("href");
            downloadBtn.removeAttribute("download");
        }
    }
});

// Main function to generate QR code based on selected type
function generateQrCodeBasedOnType() {
    let qrData = '';
    let isInputValid = true;

    // Hide any previous messages
    messageBox.style.display = 'none';

    if (currentQrType === 'text-url') {
        qrData = qrText.value;
        if (qrData.length === 0) {
            showMessage("Masukkan teks atau URL untuk menghasilkan kode QR Anda.");
            isInputValid = false;
        }
    } else if (currentQrType === 'wifi') {
        const ssid = wifiSsid.value;
        const pass = wifiPassword.value;
        const encryption = wifiEncryption.value;

        if (ssid.length === 0) {
            showMessage("SSID Wi-Fi tidak boleh kosong.");
            isInputValid = false;
        } else {
            qrData = `WIFI:S:${ssid};T:${encryption};P:${pass};;`;
        }
    } else if (currentQrType === 'phone') {
        const phoneNum = phoneNumber.value;
        if (phoneNum.length === 0) {
            showMessage("Nomor telepon tidak boleh kosong.");
            isInputValid = false;
        } else {
            qrData = `tel:${phoneNum}`;
        }
    } else if (currentQrType === 'contact') {
        const name = contactName.value;
        const phone = contactPhone.value;
        const email = contactEmail.value;

        if (name.length === 0 && phone.length === 0 && email.length === 0) {
            showMessage("Setidaknya satu bidang kontak (Nama, Telepon, Email) harus diisi.");
            isInputValid = false;
        } else {
            qrData = `BEGIN:VCARD\nVERSION:3.0\n`;
            if (name) qrData += `FN:${name}\nN:${name.split(' ').reverse().join(';')}\n`;
            if (phone) qrData += `TEL:${phone}\n`;
            if (email) qrData += `EMAIL:${email}\n`;
            qrData += `END:VCARD`;
        }
    } else if (currentQrType === 'geo') {
        const latitude = geoLatitude.value;
        const longitude = geoLongitude.value;
        const altitude = geoAltitude.value;

        if (latitude.length === 0 || longitude.length === 0) {
            showMessage("Lintang dan Bujur tidak boleh kosong untuk lokasi.");
            isInputValid = false;
        } else {
            qrData = `geo:${latitude},${longitude}`;
            if (altitude.length > 0) {
                qrData += `,${altitude}`;
            }
        }
    } else if (currentQrType === 'sms') {
        const smsNum = smsNumber.value;
        const smsMsg = smsMessage.value;

        if (smsNum.length === 0) {
            showMessage("Nomor penerima SMS tidak boleh kosong.");
            isInputValid = false;
        } else {
            qrData = `SMSTO:${smsNum}:${smsMsg}`;
        }
    } else if (currentQrType === 'email') {
        const emailToAddr = emailTo.value;
        const emailSubj = encodeURIComponent(emailSubject.value);
        const emailBodyMsg = encodeURIComponent(emailBody.value);

        if (emailToAddr.length === 0) {
            showMessage("Alamat email penerima tidak boleh kosong.");
            isInputValid = false;
        } else {
            qrData = `mailto:${emailToAddr}`;
            if (emailSubj.length > 0 || emailBodyMsg.length > 0) {
                qrData += `?`;
                if (emailSubj.length > 0) {
                    qrData += `subject=${emailSubj}`;
                }
                if (emailBodyMsg.length > 0) {
                    if (emailSubj.length > 0) qrData += `&`;
                    qrData += `body=${emailBodyMsg}`;
                }
            }
        }
    } else if (currentQrType === 'whatsapp') {
        const waNum = whatsappNumber.value;
        const waMsg = encodeURIComponent(whatsappMessage.value);

        if (waNum.length === 0) {
            showMessage("Nomor WhatsApp tidak boleh kosong.");
            isInputValid = false;
        } else {
            qrData = `https://wa.me/${waNum}`;
            if (waMsg.length > 0) {
                qrData += `?text=${waMsg}`;
            }
        }
    } else if (currentQrType === 'instagram') {
        const igUsername = instagramUsername.value;
        if (igUsername.length === 0) {
            showMessage("Nama pengguna Instagram tidak boleh kosong.");
            isInputValid = false;
        } else {
            qrData = `https://www.instagram.com/${igUsername}`;
        }
    }


    if (isInputValid && qrData.length > 0) {
        qrContainer.innerHTML = "";
        new QRCode(qrContainer, {
            text: qrData,
            height: size,
            width: size,
            colorLight: colorLight,
            colorDark: colorDark,
        });
        downloadBtn.classList.remove('hidden');
    } else {
        qrContainer.innerHTML = "";
        downloadBtn.classList.add('hidden');
    }
}

// Initialize input fields visibility on load
switchQrTypeInputs();
