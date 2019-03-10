import React, {Component} from 'react';
import Dropzone from 'react-dropzone'
import convert from 'xml-js'
import {CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis} from 'recharts';


const renderLineChart = (data) => (
  <LineChart width={1000} height={300} data={data} style={{margin: '0 auto'}}>
    <Line type="monotone" dataKey="amount" stroke="#8884d8"/>
    <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
    <XAxis dataKey="name"/>
    <YAxis/>
    <Tooltip/>
  </LineChart>
);

class App extends Component {
  state = {
    showChart: false,
    chartData: []
  };

  handleDrop = (acceptedFiles) => {
    const reader = new FileReader();

    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = () => {
      const data = reader.result;
      try {
        const res = convert.xml2js(data, {compact: true});
        const operations = res["account-history"].operations.operation.map(op => ({
          name: op["exec-date"]._text,
          amount: op.amount._text
        }));
        this.setState({chartData: operations.reverse(), showChart: true})
      } catch (e) {
        alert('Błędny plik.')
      }
    };
    acceptedFiles.forEach(file => reader.readAsBinaryString(file))
  };

  render() {
    return (
      <div className="App">
        <Dropzone onDrop={this.handleDrop}>
          {({getRootProps, getInputProps}) => (
            <section>
              <div {...getRootProps()} style={{
                height: '100%',
                border: '1px dashed black',
                margin: '10px',
                textAlign: 'center',
              }}>
                <input {...getInputProps()} />
                <p>Przeciągnij lub kliknij tutaj aby dodać plik xml z banku (PKO).</p>
              </div>
            </section>
          )}
        </Dropzone>
        <div>
          {this.state.showChart && renderLineChart(this.state.chartData)}
        </div>
      </div>
    );
  }
}

export default App;
