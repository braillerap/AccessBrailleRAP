
import React from 'react';
import RoundCheckBox from './components/RoundCheckBox';
class BrailleTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            check : [0,0,0,0,0,0,0,0,0]
        };

        this.myhandleOnChange = this.myhandleOnChange.bind(this);
        this.myhandleOnClick = this.myhandleOnClick.bind(this);

    }

    myhandleOnChange (event)
    {
        //console.log (event);
        let bit = parseInt(event.target.id)
        let tmp = this.state.check;
        tmp[bit] = ! tmp[bit];
        this.setState ({check:tmp});
        //console.log (tmp);
    }
    myhandleOnClick (event)
    {
        //console.log (event);
        let bit = parseInt(event.target.id)
        //console.log (bit);
        let tmp = this.state.check;
        //console.log (tmp);
        tmp[bit] = ! tmp[bit];
        this.setState ({check:tmp});
        //console.log (tmp);
    }    
    render () 
    {
        let braille = 0x2800;
        
        for (let i = 0; i < this.state.check.length - 1; i++)
        {
            braille += this.state.check[i + 1] ? 1 << i : 0;
        }    
        
        let braillechar = String.fromCharCode(braille)
        return (
            <div className='App'>
                <div className='BrailleDotInput pure-checkbox'>
                <table className='BrailleInputTable'>
                    <thead>
                        <tr>
                            <td></td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                        
                            <div >
                                <label for="1">1</label>
                                <input type="checkbox"  id='1' onChange={this.myhandleOnChange} value={this.state.check[1]}/>
                                
                            </div>
                            
                        </td>    
                        <td>
                        <div >
                        <label for="4">4</label>
                            <input type="checkbox"  id='4' onChange={this.myhandleOnChange} value={this.state.check[3]}/>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td>2<input type="checkbox" className="checkbox-circle2" id='2' onChange={this.myhandleOnChange} value={this.state.check[2]}/></td>
                        <td>5<input type="checkbox" className="checkbox-circle2" id='5' onChange={this.myhandleOnChange} value={this.state.check[4]}/></td>
                    </tr>
                    <tr>
                        <td>3<input type="checkbox" className="checkbox-circle2" id='3' onChange={this.myhandleOnChange} value={this.state.check[3]}/></td>
                        <td>6<input type="checkbox" className="checkbox-circle2" id='6' onChange={this.myhandleOnChange} value={this.state.check[6]}/></td>
                    </tr>
                    </tbody>
                </table>
                </div>
                Unicode : 0X{braille.toString(16)}
                <h1 className='BigBraille'>{braillechar}</h1>
            </div>    
        );
    };
}

export default BrailleTable;