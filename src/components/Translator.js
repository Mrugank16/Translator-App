import React, { useState } from 'react';
import './Translator.css';
import languageList from './language.json'; 
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function Translator() { 
    const [inputFormat, setInputFormat] = useState('en'); 
    const [outputFormat, setOutputFormat] = useState('hi'); 
    const [translatedText, setTranslatedText] = useState(''); 
    const [inputText, setInputText] = useState(''); 
    const [copyStatus, setCopyStatus] = useState(false); 
    const [loading, setLoading] = useState(false); 

    const buttonStyle = copyStatus ? { backgroundColor: 'green', color: 'white' } : {};

    const onCopyText = () => {
        setCopyStatus(true);
        setTimeout(() => setCopyStatus(false), 2000); 
    };

    const handleReverseLanguage = () => { 
        const value = inputFormat; 
        setInputFormat(outputFormat); 
        setOutputFormat(value); 
        setInputText(''); 
        setTranslatedText(''); 
    } 

    const handleRemoveInputText = () => { 
        setInputText(''); 
        setTranslatedText(''); 
    } 

    const handleTranslate = async () => { 
        if (!inputText || !inputFormat || !outputFormat) return; 
        
        setLoading(true); 
        
        const url = `https://microsoft-translator-text.p.rapidapi.com/translate?to%5B0%5D=${outputFormat}&api-version=3.0&profanityAction=NoAction&textType=plain`; 
        const options = { 
            method: 'POST', 
            headers: { 
                'content-type': 'application/json', 
                'X-RapidAPI-Key': process.env.REACT_APP_API_KEY, 
                'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
            }, 
            body: JSON.stringify([{ Text: inputText }]) 
        }; 
        try { 
            const response = await fetch(url, options); 
            const result = await response.text(); 
            const responseObject = JSON.parse(result); 
            const translation = responseObject[0].translations[0].text; 
            setTranslatedText(translation); 
        } catch (error) { 
            console.log(error); 
            alert("Please Try Again! Some Error Occurred at your side"); 
        } finally {
            setLoading(false); 
        }
    } 

    return ( 
        <div className="container"> 
            <header className="header">
                <h1>Translator</h1>
                <p>Translate text easily between multiple languages</p>
            </header>
            <div className="row1"> 
                <select value={inputFormat} onChange={(e) => setInputFormat(e.target.value)}> 
                    {Object.keys(languageList).map((key, index) => ( 
                        <option key={index} value={key}>{languageList[key].name}</option> 
                    ))} 
                </select> 
                <svg className='reversesvg' onClick={handleReverseLanguage} focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> 
                    <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/> 
                </svg> 
                <select value={outputFormat} onChange={(e) => { 
                    setOutputFormat(e.target.value); 
                    setTranslatedText(''); 
                }}> 
                    {Object.keys(languageList).map((key, index) => ( 
                        <option key={index + 118} value={key}>{languageList[key].name}</option> 
                    ))} 
                </select> 
            </div> 
            <div className="row2"> 
                <div className="inputText"> 
                    <svg className='removeinput' style={{ display: inputText.length ? "block" : "none" }} onClick={handleRemoveInputText} focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> 
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/> 
                    </svg> 
                    <textarea type="text" value={inputText} placeholder='Enter Text' onChange={(e) => setInputText(e.target.value)} /> 
                </div> 
                <div className="outputText"> 
                    <textarea value={translatedText} placeholder='Translated Text' onChange={(e) => setTranslatedText(e.target.value)}>{translatedText}</textarea> 
                    <center>
                        <CopyToClipboard text={translatedText} onCopy={onCopyText}>
                            <button class="Btn">
                                <svg viewBox="0 0 512 512" class="svgIcon" height="1em"><path d="M288 448H64V224h64V160H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H288c35.3 0 64-28.7 64-64V384H288v64zm-64-96H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H224c-35.3 0-64 28.7-64 64V288c0 35.3 28.7 64 64 64z"></path></svg>
                                <p class="text">Copy</p>
                                <span class="effect"></span>
                            </button>
                        </CopyToClipboard>
                    </center>
                    {copyStatus && <p>Text copied to clipboard!</p>}
                    
                </div> 
            </div> 
            <div className="row3">  
                <center>
                    {loading && <div class="loader"></div>}
                    <br></br>
                    <button class="Btn" onClick={handleTranslate}>
                        <p class="text">Translate</p>
                        <span class="effect"></span>
                    </button>
                </center>
            </div> 
            
            
        </div> 
    ) 
}
