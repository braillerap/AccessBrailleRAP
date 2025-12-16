import React from 'react';
import { IntlContext } from '../../components/intlwrapper.js';
import { injectIntl } from 'react-intl';
import BrailleLine from './BrailleLine.js'

const BrailleStyle = {
    
    textAlign: 'left'
    
    
}

class PageDisplayTable extends React.Component {
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
            <table>

            {
                page.map ((line, index)=> {
                    return (
                        <BrailleLine line={line}/>
                        

                    );
                
                })
            }
            </table>                   
        </div>  
        
    );
  }

}

export default injectIntl(PageDisplayTable);