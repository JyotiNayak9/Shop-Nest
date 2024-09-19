# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list




header
banner
catefory list 
products list 


## node
-Default /core integration
-fetch package
-axios package
    -promise based
    - get, post, put/patch, delete
    -interceptors

    
XMLHttpRequest (xhr)

cookie
  => string
  => per domain/path dependend
  => 50 cookie store
  => key value
  => matures at expiry date
  => self destroy
  => volatile

  document.cookie = "name=value;path=/;expiresIn=date;"
  document.cookie = "name=value;path=/;expiresIn=date;"

  const data = document.cookie;

  cookie ko satta localStorage or sessionStorage use garxam
  -5mb
  - permanent stirage
  - string
  -domain dependent

  .setItem("key", "value");
  .getItem("key");
  .clear();
  .removeItem("key");



