import React from 'react';

const divstyle = {
    width:'3em',
    height:'3em',
    
};
class RoundCheckBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {checked:props.checked}

        this.handleClick = this.handleClick.bind (this);
    }
  
    handleClick(event)
    {
        this.setState({checked: ! this.state.checked});
        if (this.props.onClick)
            this.props.onClick (event);
        /*
            if (this.props.onChange)
        {
            var ev = new Event('change', { bubbles: true});
            ev.simulated = false;
            ev.target = event.target;
            this.value = ! this.state.checked;
            //this.dispatchEvent(ev);
            this.props.onChange (ev);
        }
        */
            
    }  
    getsvg ()
    {
        if (this.state.checked !== false)
            return (<g >
                    
                    <circle cx="50" cy="50" r="46" fill="black" stroke="black" strokeWidth="4" cursor={"pointer"}/>
                    <text dx="-10%" dy="10%" x="50" y= "50" font-size="40" 
                        stroke='black' fill="white" stroke_opacity="0.5" cursor={"pointer"} 
                        pointer-events="none" user-select="none" >{this.props.name}</text>
                    
                </g>);
        else
            return (<g >
                    <text dx="-10%" dy="10%" x="50" y= "50" font-size="40" fill="black" stroke='black' cursor={"pointer"} 
                    pointer-events="none" user-select="none">
                        {this.props.name}</text>
                    <circle cx="50" cy="50" r="46" fill="none"  stroke="black" strokeWidth="4" cursor={"pointer"}/>
                    </g>
                    );
    }  
    render() {
        return (
        <div style={divstyle}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" onClick={this.handleClick}>
            
                {this.getsvg()}
            </svg>
        </div>
    );
  }

}

export default RoundCheckBox;