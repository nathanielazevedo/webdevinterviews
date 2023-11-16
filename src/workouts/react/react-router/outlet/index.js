export default {"template":{"/styles.css":{"code":"body {\n  font-family: sans-serif;\n  -webkit-font-smoothing: auto;\n  -moz-font-smoothing: auto;\n  -moz-osx-font-smoothing: grayscale;\n  font-smoothing: auto;\n  text-rendering: optimizeLegibility;\n  font-smooth: always;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n\nh1 {\n  font-size: 1.5rem;\n}\n\n*{\n  padding: 0;\n  margin: 0\n}"},"/App.js":{"code":"import { createBrowserRouter, RouterProvider } from \"react-router-dom\";\nimport Root from \"./root\";\nimport contacts from \"./contacts\";\nconsole.log(contacts)\n\nconst router = createBrowserRouter([\n  {\n    path: \"/\",\n    element: <Root />,\n    loader: () => contacts,\n    children: [\n      {\n        path: \"/\",\n        element: <div>hello</div>,\n      },\n    ],\n  },\n]);\n\nexport default function App() {\n  return <RouterProvider router={router} />;\n}\n"},"/index.js":{"code":"import React, { StrictMode } from \"react\";\nimport { createRoot } from \"react-dom/client\";\nimport \"./styles.css\";\n\nimport App from \"./App\";\n\nconst root = createRoot(document.getElementById(\"root\"));\nroot.render(\n  <StrictMode>\n    <App />\n  </StrictMode>\n);"},"/public/index.html":{"code":"<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Document</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n  </body>\n</html>"},"/package.json":{"code":"{\n  \"dependencies\": {\n    \"react\": \"^18.0.0\",\n    \"react-dom\": \"^18.0.0\",\n    \"react-scripts\": \"^5.0.0\",\n    \"jest-extended\": \"^3.0.2\",\n    \"react-router-dom\": \"^6.16.0\"\n  },\n  \"main\": \"/index.js\",\n  \"devDependencies\": {}\n}"},"/root.js":{"code":"// root.js\nimport { useLoaderData, NavLink } from \"react-router-dom\";\n\nexport default () => {\n  const contacts = useLoaderData();\n  console.log('hello liyuan')\n\n  return (\n    <div\n      style={{\n        width: \"100vw\",\n        height: \"100vh\",\n      }}\n    >\n      <ul\n        style={{\n          width: \"100px\",\n          borderRight: \"1px solid gray\",\n          height: \"100vh\",\n          display: \"flex\",\n          flexDirection: \"column\",\n          alignItems: \"center\",\n          paddingTop: \"20px\",\n        }}\n      >\n        {contacts.map((contact) => {\n          return (\n            <li>\n              <NavLink to=\"/dogs\">{contact.name}</NavLink>\n            </li>\n          );\n        })}\n      </ul>\n    </div>\n  );\n};\n"},"/contacts.js":{"code":"// contacts.js\n\nexport default [\n  {\n    id: 1,\n    name: 'Nate',\n  }\n]"}},"solution":{"/styles.css":{"code":"body {\n  font-family: sans-serif;\n  -webkit-font-smoothing: auto;\n  -moz-font-smoothing: auto;\n  -moz-osx-font-smoothing: grayscale;\n  font-smoothing: auto;\n  text-rendering: optimizeLegibility;\n  font-smooth: always;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n\nh1 {\n  font-size: 1.5rem;\n}"},"/App.js":{"code":"export default function App() {\n  console.log('solution')\n  console.log('editing solution')\n  console.log('hi')\n  console.log('bye')\n  return <h1>Hello world</h1>\n}\n"},"/index.js":{"code":"import React, { StrictMode } from \"react\";\nimport { createRoot } from \"react-dom/client\";\nimport \"./styles.css\";\n\nimport App from \"./App\";\n\nconst root = createRoot(document.getElementById(\"root\"));\nroot.render(\n  <StrictMode>\n    <App />\n  </StrictMode>\n);"},"/public/index.html":{"code":"<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Document</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n  </body>\n</html>"},"/package.json":{"code":"{\n  \"dependencies\": {\n    \"react\": \"^18.0.0\",\n    \"react-dom\": \"^18.0.0\",\n    \"react-scripts\": \"^5.0.0\",\n    \"jest-extended\": \"^3.0.2\",\n    \"react-router-dom\": \"^6.16.0\"\n  },\n  \"main\": \"/index.js\",\n  \"devDependencies\": {}\n}"}},"checkList":["Create a controlled input.","Send a request to the Age API.","Display the response from the Age API.","Create a cache so the same request is not sent twice."],"id":"15","name":"outlet","title":"Outlet","path":"/workouts/react/react-router/outlet","difficulty":"2","link":"https://youtu.be/1T0iMtIWmrw","isSolution":"false"}