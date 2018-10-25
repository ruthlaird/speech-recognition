window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

const recognition = new SpeechRecognition();
const icon = document.querySelector('i.fa.fa-microphone')
let paragraph = document.createElement('p');
let container = document.querySelector('.text-box');
container.appendChild(paragraph);
const sound = document.querySelector('.sound');

//add a click event listener to the icon
icon.addEventListener('click', () => {
    sound.play();
    dictate();
  });

//The dictate function starts the speech recognition service by calling the start method on the speech recognition instance.  
const dictate = () => {
  recognition.start();
  //To return a result for whatever a user says, we need to add a result event to our speech recognition instance. 
  recognition.onresult = (event) => {
    //The resulting event returns a SpeechRecognitionEvent which contains a results object. 
    //This in turn contains the transcript property holding the recognized speech in text. 
    const speechToText = event.results[0][0].transcript;
    
    //We save the recognized text in a variable called speechToText and put it in the paragraph element on the page
    paragraph.textContent = speechToText + '?';

    //call the isFinal method on our event result which returns true or false depending on if the user is done speaking
    //If the user is done speaking, we check if the transcript of what was said contains keywords such as what is the time , and so on. 
    //If it does, we call our speak function and pass it one of the three functions getTime, getDate or getTheWeather which all return a string for the browser to read
    if (event.results[0].isFinal) {
        if (speechToText.includes('what is the time')) {
            speak(getTime);
        }
        else if (speechToText.includes('what is today\'s date')) {
            speak(getDate);
        }
        else if (speechToText.includes('what is the weather in')) {
            getTheWeather(speechToText);
        }
        else {
            speak(noAnswer);
        };
      }
  }
}

//To add text to speech to our app, we’ll make use of the speechSynthesis interface of the WebSpeech API
const synth = window.speechSynthesis;

//function speak which we will call whenever we want the app to say something
//The speak function takes in a function called the action as a parameter. 
//The function returns a string which is passed toSpeechSynthesisUtterance. 
//SpeechSynthesisUtterance is the WebSpeech API interface that holds the content the speech recognition service should read. 
//The speechSynthesis speak method is then called on its instance and passed the content to read.
const speak = (action) => {
    utterThis = new SpeechSynthesisUtterance(action());
    synth.speak(utterThis);
  };

const getTime = () => {
    const time = new Date(Date.now());
    return `the current time is ${time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
};

const getDate = () => {
    const time = new Date(Date.now())
    return `today is ${time.toLocaleDateString()}`;
};

const getTheWeather = (speech) => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${speech.split(' ')[5]}&appid=58b6f7c78582bffab3936dac99c31b25&units=metric`)
    .then(function(response){
    return response.json();
    })
    .then(function(weather){
    if (weather.cod === '404') {
        utterThis = new SpeechSynthesisUtterance(`I cannot find the weather for ${speech.split(' ')[5]}`);
        synth.speak(utterThis);
        return;
    }
    utterThis = new SpeechSynthesisUtterance(`the weather condition in ${weather.name} is ${weather.weather[0].description} at a temperature of ${weather.main.temp} degrees Celcius`);
    synth.speak(utterThis);
    });
};

const noAnswer = () => {
    return `I'm sorry I can't answer that`;
};