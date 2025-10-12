export const restApiQuiz = [
  {
    question: "What does REST stand for?",
    options: [
      "Representational State Transfer",
      "Remote System Transfer",
      "Representational Software Technique",
      "Resource State Transfer"
    ],
    correctAnswer: "Representational State Transfer"
  },
  {
    question: "Which HTTP method is typically used to retrieve data from a REST API?",
    options: [
      "GET",
      "POST",
      "PUT",
      "DELETE"
    ],
    correctAnswer: "GET"
  },
  {
    question: "Which HTTP method is used to create a new resource in a REST API?",
    options: [
      "POST",
      "GET",
      "DELETE",
      "PATCH"
    ],
    correctAnswer: "POST"
  },
  {
    question: "What is the purpose of the PUT method in REST?",
    options: [
      "To update an existing resource or create a new one if it does not exist",
      "To delete a resource",
      "To partially update a resource",
      "To retrieve a resource"
    ],
    correctAnswer: "To update an existing resource or create a new one if it does not exist"
  },
  {
    question: "Which HTTP method is used to delete a resource in a REST API?",
    options: [
      "DELETE",
      "POST",
      "GET",
      "PUT"
    ],
    correctAnswer: "DELETE"
  },
  {
    question: "What does the HTTP status code 200 indicate in a REST API?",
    options: [
      "OK: The request was successful",
      "Created: A new resource was created",
      "Bad Request: The request was invalid",
      "Not Found: The resource does not exist"
    ],
    correctAnswer: "OK: The request was successful"
  },
  {
    question: "What does the HTTP status code 404 indicate in a REST API?",
    options: [
      "Not Found: The resource does not exist",
      "Unauthorized: The user is not authenticated",
      "Internal Server Error: The server encountered an error",
      "OK: The request was successful"
    ],
    correctAnswer: "Not Found: The resource does not exist"
  },
  {
    question: "Which format is commonly used to exchange data in REST APIs?",
    options: [
      "JSON",
      "XML",
      "YAML",
      "Both JSON and XML"
    ],
    correctAnswer: "Both JSON and XML"
  },
  {
    question: "What is an endpoint in a REST API?",
    options: [
      "A URL that identifies a specific resource",
      "A function that executes server-side logic",
      "A database table used in the API",
      "A network address of the API server"
    ],
    correctAnswer: "A URL that identifies a specific resource"
  },
  {
    question: "What does statelessness mean in the context of REST?",
    options: [
      "Each request from the client contains all necessary information to process the request",
      "The server maintains a session state for each client",
      "The API does not support stateful operations",
      "The API cannot handle multiple requests at the same time"
    ],
    correctAnswer: "Each request from the client contains all necessary information to process the request"
  },
  {
    question: "Which HTTP method is used to partially update a resource in REST?",
    options: [
      "PATCH",
      "PUT",
      "POST",
      "GET"
    ],
    correctAnswer: "PATCH"
  },
  {
    question: "What is the purpose of the HTTP status code 201?",
    options: [
      "Created: A new resource was successfully created",
      "OK: The request was successful",
      "No Content: The request was successful but no content is returned",
      "Conflict: The request could not be completed due to a conflict"
    ],
    correctAnswer: "Created: A new resource was successfully created"
  },
  {
    question: "Which header is used to specify the format of the data being sent to the server in a REST API?",
    options: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Cache-Control"
    ],
    correctAnswer: "Content-Type"
  },
  {
    question: "What is the purpose of the Authorization header in a REST API?",
    options: [
      "To include credentials or tokens for accessing protected resources",
      "To specify the format of the response data",
      "To cache the response for a given request",
      "To specify the language of the content"
    ],
    correctAnswer: "To include credentials or tokens for accessing protected resources"
  },
  {
    question: "Which HTTP status code indicates a client-side error?",
    options: [
      "4xx",
      "2xx",
      "3xx",
      "5xx"
    ],
    correctAnswer: "4xx"
  },
  {
    question: "What is HATEOAS in the context of REST APIs?",
    options: [
      "Hypermedia as the Engine of Application State",
      "High Availability Transactions for Enterprise APIs",
      "A protocol for encrypting REST API data",
      "A way to handle large file uploads in REST APIs"
    ],
    correctAnswer: "Hypermedia as the Engine of Application State"
  },
  {
    question: "What is the purpose of the Accept header in a REST API?",
    options: [
      "To specify the desired format of the response data",
      "To include authentication credentials",
      "To control caching behavior",
      "To limit the size of the response"
    ],
    correctAnswer: "To specify the desired format of the response data"
  },
  {
    question: "What does the HTTP status code 500 indicate?",
    options: [
      "Internal Server Error: The server encountered an unexpected condition",
      "Not Found: The requested resource could not be found",
      "Unauthorized: Authentication is required",
      "Bad Request: The server could not understand the request"
    ],
    correctAnswer: "Internal Server Error: The server encountered an unexpected condition"
  },
  {
    question: "Which HTTP method should be idempotent in a REST API?",
    options: [
      "GET, PUT, DELETE",
      "POST",
      "PATCH",
      "All methods"
    ],
    correctAnswer: "GET, PUT, DELETE"
  },
  {
    question: "What is the base URL in a REST API?",
    options: [
      "The root URL from which all endpoints are derived",
      "The URL of the database",
      "The IP address of the client",
      "The URL of a specific resource"
    ],
    correctAnswer: "The root URL from which all endpoints are derived"
  }
];
