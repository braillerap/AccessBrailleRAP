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

        this.copyfunction = this.copyfunction.bind(this);
        
    }
    
    copyfunction (event) {
        console.log ("copy ", event);
    }
    
    render() {
        
        let page = this.state.braillepages.getPage (this.props.pagenbr);
        let page_black = this.state.braillepages.getPageBlack (this.props.pagenbr);
        console.log (page_black);
        return (
        
        <div className={this.context.getStyleClass("BrailleTable")} >
            <table >
            <tbody onCopy={this.copyfunction}>
            {
                page.map ((line, index)=> {
                    let lineb = page_black[index];
                    return (
                        <>
                        
                        <BrailleLine displine={line} class={this.context.getStyleClass("BrailleOutput")}/>
                        <BrailleLine displine={lineb} class={this.context.getStyleClass("BrailleSrcOutput")}/>
                        
                        </>

                    );
                
                })
            }
            </tbody>
            </table>                   
        </div>  
        
    );
  }

}

export default injectIntl(PageDisplayTable);