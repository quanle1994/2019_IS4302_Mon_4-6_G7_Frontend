module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb",
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "react/prop-types": 0,
    "global-require": 0,
    "linebreak-style": 0,
    "react/destructuring-assignment": [true, { "extensions": [".jsx"] }],
    'max-len': ["error", { "code": 150 }],
  },
  "env": {
    "browser": true,
    "node": true
  },
  "globals": {
    "document": false
  }
};
