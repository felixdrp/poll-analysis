import * as React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';

export default class About extends React.Component {
  reference(ref) {
    const style = {
      ref: {
        fontSize: 'small',
        color: '#555',
        fontFamily: 'sans-serif',
      }
    }
    
    return <span class="referencies" style={style.ref}> {`< ${ref} >`} </span>
  }

  render() {
    return (
      <div>
        <Link to="/">
          <i className="fa fa-arrow-left fa-2x" />
        </Link>
        <h1>History Log</h1>
        <ul><li>
          <h1>Version 1</h1>
            Glasgow, 2018.
          <h3>Promoters</h3>
          <ul>
            <li>
              Yunhyong Kim {this.reference('Yunhyong.Kim@glasgow.ac.uk')} {this.reference('https://www.gla.ac.uk/schools/humanities/staff/yunhyongkim')}
            </li>
            <li>
              Geethanjali Selvaretnam {this.reference('Geethanjali.Selvaretnam@glasgow.ac.uk')} {this.reference('https://www.gla.ac.uk/schools/business/staff/geethanjaliselvaretnam/')}
            </li>
            <li>
              Lynn Bradley {this.reference('Lynn.Bradley@glasgow.ac.uk')} {this.reference('https://www.gla.ac.uk/schools/business/staff/lynnbradley/')}
            </li>
          </ul>

          <h3>Developers</h3>
          <ul>
            <li>
              Felix Rodriguez Perez {this.reference('felixdrp@gmail.com')}
            </li>
          </ul>

          <h3>Special thanks: </h3>
          <ul>
            <li>
              Yunhyong Kim for her positive energy.
            </li>
            <li>
              Jesus Rodriguez Perez {this.reference('rpsoft@gmail.com')} for his coaching and mentoring.
            </li>
          </ul>
        </li></ul>
      </div>
    );
  }
}
