

import Testheader from './components/Testheader';
import RoundCheckbox from './components/RoundCheckBox';

function Home() {
    return (
        <div>
        
        
        <Testheader text='Work' name='in progress'></Testheader>

        <table>
          <thead>
            <tr>
              <td></td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <RoundCheckbox name="1"  />
              </td>
              <td>
                <RoundCheckbox name="4"   />
              </td>
            </tr>
            <tr>
              <td>
                <RoundCheckbox name="2"   />
              </td>
              <td>
                <RoundCheckbox name="5"   />
              </td>
            </tr>
            <tr>
              <td>
                <RoundCheckbox name="3"   />
              </td>
              <td>
                <RoundCheckbox name="6"   />
              </td>
            </tr>
          </tbody>
        </table>
        <RoundCheckbox name="1"/>
        <RoundCheckbox name="2"/>
        <RoundCheckbox name="3"/>

      </div>
    );
  }
  
  export default Home;