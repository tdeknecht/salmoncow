// JSX setup: https://reactjs.org/docs/add-react-to-a-website.html
// cd js
// npx babel --watch src --out-dir . --presets react-app/prod

var myName = 'Cow';
var element = React.createElement(
  'h2',
  null,
  'Hello, ',
  myName
);

ReactDOM.render(element, document.getElementById('moo'));