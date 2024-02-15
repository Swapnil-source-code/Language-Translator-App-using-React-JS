import { useState, useEffect } from 'react';
import './LanguageTranslator-style.css'
import countries from '../assets/countries'

const LanguageTranslator = () => {

  const [fromText, setFromText] = useState('');
  const [toText, setToText] = useState('');
  const [translateFrom, setTranslateFrom] = useState('en-GB');
  const [translateTo, setTranslateTo] = useState('hi-IN');
  const [selectedLanguage, setSelectedLanguage] = useState({
    from: 'en-GB',
    to: 'hi-IN',
  });
  const [countriesList, setCountriesList] = useState([]);

  useEffect(() => {
    setCountriesList(Object.entries(countries));
  }, []);

  const handleExchange = () => {
    const tempText = fromText;
    const tempLang = selectedLanguage.from;

    setFromText(toText);
    setToText(tempText);
    setSelectedLanguage({
      from: selectedLanguage.to,
      to: tempLang,
    });
  };

  const handleTranslate = () => {
    const apiUrl = `https://api.mymemory.translated.net/get?q=${fromText}&langpair=${translateFrom}|${translateTo}`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setToText(data.responseData.translatedText);
      });
  };

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id === 'from' ? fromText : toText);
  };

  const handleSpeak = (id) => {
    const utterance = new SpeechSynthesisUtterance(id === 'from' ? fromText : toText);
    utterance.lang = id === 'from' ? selectedLanguage.from : selectedLanguage.to;
    speechSynthesis.speak(utterance);
  };


  return (
    <>
      <div className="container">
        <div className="wrapper">
          <div className="text-input">
            
            <textarea
              spellCheck="false"
              className="from-text"
              value={fromText}
              onChange={(e) => setFromText(e.target.value)}
              placeholder="Enter text"
              defaultValue={""}
            />
            
            <textarea
              spellCheck="false"
              className="to-text"
              value={toText}
              placeholder="Translation"
              defaultValue={""}
              readOnly
              disabled
            />
          </div>

          <ul className="controls">
            <li className="row from">
              <div className="icons">
                <i id="from" className="fas fa-volume-up" onClick={() => handleSpeak('from')}/>
                <i id="from" className="fas fa-copy"  onClick={() => handleCopy('from')} />
              </div>
              <select
                value={translateFrom}
                onChange={(e) => setTranslateFrom(e.target.value)}
              >
                {countriesList.map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </li>

            <li className="exchange" onClick={handleExchange}><i className="fas fa-exchange-alt" /></li>

            <li className="row to">
            <select
              value={translateTo}
              onChange={(e) => setTranslateTo(e.target.value)}
            >
              {countriesList.map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
              <div className="icons">
                <i id="to" className="fas fa-volume-up" onClick={() => handleSpeak('to')} />
                <i id="to" className="fas fa-copy" onClick={() => handleCopy('to')} />
              </div>
            </li>
          </ul>

        </div>
        <button onClick={handleTranslate}>Translate Text</button>
      </div>
    </>
  )
}

export default LanguageTranslator