
import React from 'react';



class TestSerial extends React.Component {

    constructor (props)
    {
        super (props);
        this.state = {
            data:""
        }
    }

    async componentDidMount()
    {
        let list = await eel.gcode_get_serial()();
        //console.log (list)
        this.setState ({data:list.toString()})
    }
    handleSubmit(event)
    {

    }

    handleChange(event)
    {
      //console.log (event.target.value)

    }
    render ()
    {
      return (
            <div className="App" role={'presentation'}>
              <div>
              <p>
              {this.state.data}
              </p>
              </div>


          </div>
        );
    }
  }

  export default TestSerial;