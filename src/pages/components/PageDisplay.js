import React from 'react';
import { IntlContext } from '../../components/intlwrapper.js';
import { injectIntl } from 'react-intl';

const BrailleStyle = {
    
    textAlign: 'left',
    
}

class PageDisplay extends React.Component {
    static contextType = IntlContext;
    constructor(props) {
        super(props);
        this.state = {
            pagenbr:props.pagenbr,
            braillepages:props.pages
        }

        
    }
    
    /*  
    getsvg ()
    {
        if (this.state.checked !== false)
            return (<g >
                    <circle cx="50" cy="50" r="46" fill="black" stroke="black" strokeWidth="4"/>
                    <text dx="-10%" dy="10%" x="50" y= "50" font-size="40" stroke='black' fill="white" stroke_opacity="0.5">{this.props.name}</text>
                </g>);
        else
            return (<g >
                    <text dx="-10%" dy="10%" x="50" y= "50" font-size="40" fill="black" stroke='black'>{this.props.name}</text>
                    <circle cx="50" cy="50" r="46" fill="none"  stroke="black" strokeWidth="4"/>
                    </g>
                    );
    }  
    */
    render() {
        
        let page = this.state.braillepages.getPage (this.props.pagenbr);
        return (
        
        <div style={BrailleStyle} aria-hidden="true">
                               
            {page.map ((line, index)=> (<div className={this.context.getStyleClass("BrailleOutput")} key={index}>{line}</div>))}
            
        </div>  
        
    );
  }

}

export default injectIntl(PageDisplay);