import React from 'react'
import './Components/CSS/loginportal.css';
function Popup(props) {
    const capitalize = (word)=>{
        if(word==="danger"){
            word="error"
        }
        else if(word==="primary")
        {
            word = "info"
        }
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
    return (
        <div style={{height: '0px'}}>
        {props.popup && <div className={`alert alert-${props.popup.type} alert-dismissible fade show`} role="alert">
           <strong>{capitalize(props.popup.type)}</strong>: {props.popup.message} 
        </div>}
        </div>
    )
}

export default Popup;