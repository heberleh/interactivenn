import { jscolor } from "../d3/jscolor/jscolor.js";

export class ColorInput extends React.Component {

  constructor(props) {
    super(props)
    this.ref = props.colorBoxRef;
  }

  componentDidMount() {
    const { setID, colors, changeColor } = this.props;

    const colorPicker = new jscolor.color(
      this.ref.current, 
      { adjust: true, 
        hash: true,
        slider: true,
        leaveValue: false,
        onImmediateChange: (e) => {
          const value = this.ref.current.value;
          changeColor(setID, value);
        }
       }).fromString(colors[setID]);
  }

  render() {
    const element = React.createElement;
    const { setID, colorBoxRef } = this.props;

    return element(
        'input', 
        { id: `color${setID}`, 
          ref: colorBoxRef, 
          style: { width: '17px', height: '17px', margin: '2px', borderRadius: '100%', border: '1px solid rgb(118, 118, 118)'},
        });
  }
}

