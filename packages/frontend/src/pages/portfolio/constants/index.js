import {
  mobile,
  backend,
  creator,
  web,
  creative_mines,
  spark,
  ibanban,
  earth,
  chicken,
  gpt,
  br,
  code,
  pulse,
  os,
  srl
} from '../assets'

export const navLinks = [
  {
    id: 'about',
    title: 'About',
  },
  {
    id: 'work',
    title: 'Work',
  },
  {
    id: 'contact',
    title: 'Contact',
  },
]

const services = [
  {
    title: 'HTML',
    icon: web,
  },
  {
    title: 'CSS',
    icon: web,
  },
  {
    title: 'JavaScript',
    icon: mobile,
  },
  {
    title: 'Python',
    icon: backend,
  },
  {
    title: 'Vue',
    icon: creator,
  },
  {
    title: 'React',
    icon: creator,
  },
  {
    title: 'Django',
    icon: creator,
  },
  {
    title: 'Flask',
    icon: creator,
  },
  {
    title: 'Express',
    icon: creator,
  },
]

const technologies = [
  // {
  //   name: 'HTML 5',
  //   icon: html,
  // },
  // {
  //   name: 'CSS 3',
  //   icon: css,
  // },
  // {
  //   name: 'JavaScript',
  //   icon: javascript,
  // },
  // {
  //   name: 'TypeScript',
  //   icon: typescript,
  // },
  // {
  //   name: 'React JS',
  //   icon: reactjs,
  // },
  // {
  //   name: 'Redux Toolkit',
  //   icon: redux,
  // },
  // {
  //   name: 'Tailwind CSS',
  //   icon: tailwind,
  // },
  // {
  //   name: 'Node JS',
  //   icon: nodejs,
  // },
  // {
  //   name: 'MongoDB',
  //   icon: mongodb,
  // },
  // {
  //   name: 'Three JS',
  //   icon: threejs,
  // },
  // {
  //   name: 'git',
  //   icon: git,
  // },
  // {
  //   name: 'figma',
  //   icon: figma,
  // },
  // {
  //   name: 'docker',
  //   icon: docker,
  // },
]

const experiences = [
  {
    title: 'Software Engineer',
    company_name: 'Boehringer Ingelheim',
    icon: br,
    iconBg: 'black',
    date: 'April 2025 - Current',
    points: [
      'Continue to design and implement frontend architecture, including user interface components and interactions, resulting in a user-friendly and responsive application that met business requirements.',
      'Collaborate with cross-functional teams to gather requirements, design solutions, and integrate APIs to streamline data retrieval processes, enhancing data accuracy and reducing processing time.',
      'Conduct code reviews and implement best practices to ensure scalable and maintainable codebase, resulting in improved code quality and reduced technical debt.',
      'Provide technical support and training to end-users on using internal tools effectively, resulting in an increase in user adoption and satisfaction.',
    ],
  },
  {
    title: 'Software Engineer',
    company_name: 'Boehringer Ingleheim (W2 Contract)',
    icon: br,
    iconBg: 'black',
    date: 'April 2024 - March 2025',
    points: [
      'Designed and implemented frontend architecture, including user interface components and interactions, resulting in a user-friendly and responsive application that met business requirements.',
      'Collaborated with cross-functional teams to gather requirements, design solutions, and integrate APIs to streamline data retrieval processes, enhancing data accuracy and reducing processing time.',
      'Conducted code reviews and implemented best practices to ensure scalable and maintainable codebase, resulting in improved code quality and reduced technical debt.',
      'Provided technical support and training to end-users on using internal tools effectively, resulting in an increase in user adoption and satisfaction.',
    ],
  },
  {
    title: 'Software Engineer',
    company_name: 'Creative Mines',
    icon: creative_mines,
    iconBg: 'black',
    date: 'November 2021 - March 2023',
    points: [
      'Collaborated with over 10 teams to create an cybersecurity application used by companies such as NASA, The US Air Force and thousands of other highly respected businesses worldwide.',
      'Spearheaded the development of a game-changing feature that optimized product usability and attained a 25%  higher conversion rate in a team of 6 developers.',
      'Restructured the main grid by breaking down complex code segments and implementing efficient data structures; decreased backend requests and re-rendering by 50%, leading to a streamlined system performance and reduced server load.',
      'Optimized the performance of the app by implementing redux, functional programming and asynchronous loading techniques; reduced page load times by 60% and raised user experience rating by 35%.',
      'Tracked and reported software defects using bug-tracking tools and assisted with root cause analysis, resolved 75% of issues discovered.',
    ],
  },
  {
    title: 'Systems Analyst',
    company_name: 'Spark Business Works',
    icon: spark,
    iconBg: 'black',
    date: 'April 2021 - October 2021',
    points: [

      'Led cross-functional team in the design and development of a new feature that increased user satisfaction by 50%; improved client throughput by over 40%.',

      'Minimized sprint time from 4 weeks to 2 weeks and eliminated bottlenecks by streamlining the development process from user stories through code check-in.',

      'Automated manual testing using Python and Selenium to reduce the time taken for regression testing.',
    ],
  },
]

const testimonials = [
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Nate does.",
    name: 'Asif Lundstrom',
    designation: 'Attorney',
    company: 'Foundry Law',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
  },
  {
    testimonial:
      'Nate is an incredible teammate and will add hard work, technical ability and skills to any team he joins.',
    name: 'Jake Northey',
    designation: 'CEO',
    company: 'Creative Mines',
    image: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
  {
    testimonial:
      'Nate is a skilled software engineer and a great mentor. It was an honor to work with him.',
    name: 'Lohane Diogo',
    designation: 'Web Developer',
    company: 'Youx Group',
    image: 'https://randomuser.me/api/portraits/women/6.jpg',
  },
]

const projects = [
  {
    name: 'Scientific Research Labs',
    description:
      'An attempt to organize the webspace of scientific research labs. This is an application to Y Combinator and currently hidden.',
    tags: [
      {
        name: 'react',
        color: 'blue-text-gradient',
      },
      {
        name: 'express',
        color: 'green-text-gradient',
      },
      {
        name: 'GPT-API',
        color: 'pink-text-gradient',
      },
    ],
    image: srl,
    source_code_link: 'https://github.com/nathanielazevedo/labs',
    live_link: 'https://labs-pi-eight.vercel.app/',
    hidden: true,
  },
  {
    name: 'Chicken Tinder',
    description:
      'Chicken Tinder helps your party decide where to eat and when. Used by hundreds of users all over the world.',
    tags: [
      {
        name: 'react',
        color: 'blue-text-gradient',
      },
      {
        name: 'TypeScript',
        color: 'green-text-gradient',
      },
      {
        name: 'Express',
        color: 'pink-text-gradient',
      },
      {
        name: 'MongoDB',
        color: 'blue-text-gradient',
      },
    ],
    image: chicken,
    source_code_link: 'https://github.com/nathanielazevedo/chickentinder',
    live_link: 'https://www.thechickentinder.com/',
  },
  {
    name: 'Ibanban',
    description:
      'Master Mandarin by playing engaging mini-games that reinforce what you learn.',
    tags: [
      {
        name: 'react',
        color: 'blue-text-gradient',
      },
      {
        name: 'TypeScript',
        color: 'green-text-gradient',
      },
      {
        name: 'Express',
        color: 'pink-text-gradient',
      },
      {
        name: 'MongoDB',
        color: 'blue-text-gradient',
      },
    ],
    image: ibanban,
    source_code_link: 'https://github.com/nathanielazevedo/ibanban',
    live_link: 'https://ibanban.vercel.app/',
  },
  {
    name: 'Pulse',
    description:
      "Make music with a looping drumpad. Includes a sound library and melody library.",
    tags: [
      {
        name: 'Vue',
        color: 'blue-text-gradient',
      },
      {
        name: 'Tone.js',
        color: 'green-text-gradient',
      },
    ],
    image: pulse,
    source_code_link: 'https://github.com/nathanielazevedo/pulse',
    live_link: 'https://pulse-ecru-two.vercel.app/',
  },
  {
    name: 'React Globe Frequency',
    description:
      'A React component library for displaying user location on an interactive 3D globe. Published on NPM.',
    tags: [
      {
        name: 'react',
        color: 'blue-text-gradient',
      },
      {
        name: 'npm-package',
        color: 'green-text-gradient',
      },
      {
        name: 'three.js',
        color: 'blue-text-gradient',
      },
    ],
    image: earth,
    source_code_link: 'https://github.com/nathanielazevedo/geo_front',
    live_link: 'https://www.npmjs.com/package/react-globe-frequency',
  },
  {
    name: 'JS OS',
    description:
      'A basic mac like operating system implemented in Javascript.',
    tags: [
      {
        name: 'react',
        color: 'blue-text-gradient',
      },
      {
        name: 'express',
        color: 'green-text-gradient',
      },
      {
        name: 'GPT-API',
        color: 'pink-text-gradient',
      },
    ],
    image: os,
    source_code_link: 'https://github.com/nathanielazevedo/os-portfolio',
    live_link: 'https://os-portfolio-two.vercel.app/',
  },
]

export { services, technologies, experiences, testimonials, projects }
