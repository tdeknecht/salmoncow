// JSX setup: https://reactjs.org/docs/add-react-to-a-website.html
// cd js
// npx babel --watch src --out-dir . --presets react-app/prod

const myName = 'Cow';
const element = <h2>Hello, {myName}</h2>;

ReactDOM.render(
  element,
  document.getElementById('moo')
);