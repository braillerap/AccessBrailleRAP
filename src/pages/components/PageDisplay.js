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