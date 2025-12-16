import React from 'react';
import { IntlContext } from '../../components/intlwrapper.js';
import { injectIntl } from 'react-intl';

class BrailleLine extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            line:props.line,
            
        }

        
    }
    
    
    render() {
            let charline = [...this.state.line];
            
            return (
                <tr>
                    {charline.map((char) => (<td>{char}</td>))}
                </tr>
            );
            
           
        return (charline.map (char));
  }

}

export default BrailleLine;