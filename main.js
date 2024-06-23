document.addEventListener('DOMContentLoaded', () => {
    const synth = window.speechSynthesis;

    // DOM Elements
    const textForm = document.querySelector('form');
    const textInput = document.querySelector('#input');
    const voiceSelect = document.querySelector('#selectvoice');
    const pitch = document.querySelector('#pitch');
    const rate = document.querySelector('#rate');
    const pitchValue = document.querySelector('#pitch-value');
    const rateValue = document.querySelector('#rate-value');
    const speakButton = document.querySelector('.button');
    const body = document.querySelector('Body');

    if (!textForm || !textInput || !voiceSelect || !pitch || !rate || !pitchValue || !rateValue || !speakButton) {
        console.error("One or more required DOM elements are missing.");
        return;
    }

    let voices = [];
    
    const getVoices = () => {
        voices = synth.getVoices();
        voiceSelect.innerHTML = ''; 
        voices.forEach(voice => {
            const option = document.createElement('option');
            option.textContent = `${voice.name} (${voice.lang})`;
            option.setAttribute("data-lang", voice.lang);
            option.setAttribute("data-name", voice.name);
            voiceSelect.appendChild(option);
        });
    };

    getVoices();
    if (typeof synth.onvoiceschanged !== 'undefined') {
        synth.onvoiceschanged = getVoices;
    }

    const speak = () => {
        setTimeout(() => document.querySelector(".alert").remove(), 3000);
        setTimeout(() => document.querySelector(".already").remove(), 1500);



        if (synth.speaking) {
            const div=document.createElement("div");
            div.className="alert already";
            div.appendChild(document.createTextNode("Already speaking..."));
            const row=document.querySelector(".row");
            const col=document.querySelector(".col-md-6");
            row.insertBefore(div, col);
            return;
        }
        if (textInput.value !== '') {
            body.style.background="#141414 url(img/wave.gif)";
            body.style.backgroundRepeat="repeat-x";
            body.style.backgroundSize="100% 100%";
            const speakText = new SpeechSynthesisUtterance(textInput.value);

            speakText.onend = () => {
                const div=document.createElement("div");
                div.className="alert";
                div.appendChild(document.createTextNode("Done speaking..."));
                const row=document.querySelector(".row");
                const col=document.querySelector(".col-md-6");
                row.insertBefore(div, col);
                body.style.background="#141414";
            };

            speakText.onerror = (e) => {
                const div=document.createElement("div");
                div.className="alert";
                div.appendChild(document.createTextNode("Something went wrong.",e));
                const row=document.querySelector(".row");
                const col=document.querySelector(".col-md-6");

                row.insertBefore(div, col);
            };


            const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');
            voices.forEach(voice => {
                if (voice.name === selectedVoice) {
                    speakText.voice = voice;
                }
            });

            speakText.rate = rate.value;
            speakText.pitch = pitch.value;
            synth.speak(speakText);
        }
    };

    textForm.addEventListener('submit', e => {
        e.preventDefault();
        speak();
        textInput.blur();
    });

    rate.addEventListener('change', () => {
        rateValue.textContent = rate.value;
    });

    pitch.addEventListener('change', () => {
        pitchValue.textContent = pitch.value;
    });

    speakButton.addEventListener('click', speak);
});
