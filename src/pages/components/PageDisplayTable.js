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
            braillepages:props.pages,
            render:props.render
        }

        this.copyfunction = this.copyfunction.bind(this);
        
    }
    
    async copyfunction (event) {
        

        let page = this.state.braillepages.getPage (this.props.pagenbr);
        let page_black = this.state.braillepages.getPageBlack (this.props.pagenbr);

        let toclip = '';
        if (this.state.render === "braille")
        {
            page.map ((line) => {
                toclip = toclip + line;
                toclip = toclip + '\n';
            });
        }
        else
        {
             page.map ((line, index)=> {
                let lineb = page_black[index];
                toclip = toclip + line;
                toclip = toclip + '\n';
                toclip = toclip + lineb;
                toclip = toclip + '\n';    
             });
        }

        const type = "text/plain";
        const clipboardItemData = {
            [type]: toclip,
        };
        const clipboardItem = new ClipboardItem(clipboardItemData);
        await navigator.clipboard.write([clipboardItem]);

        event.preventDefault();
    }
    
    render() {
        
        let page = this.state.braillepages.getPage (this.props.pagenbr);
        let page_black = this.state.braillepages.getPageBlack (this.props.pagenbr);
        //console.log (page_black);

        if (this.state.render === "braille")
        {
            return (
        
                <div className={this.context.getStyleClass("BrailleTable")} >
                    <table >
                    <tbody onCopy={this.copyfunction}>
                    {
                        page.map ((line)=> {
                            return (
                                <>
                                <BrailleLine displine={line} class={this.context.getStyleClass("BrailleOutput")}/>
                                </>

                            );
                        
                        })
                    }
                    </tbody>
                    </table>                   
                </div>  
                
            );
        }
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