# Twitter Cleaner

A web application that helps users manage their Twitter/X account by allowing them to delete tweets and comments in bulk.

## Features

- OAuth authentication with Twitter/X
- View count of tweets and comments
- Selective deletion of tweets and/or comments
- Progress tracking for deletion process
- Secure authentication handling

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/twitter-cleaner.git
cd twitter-cleaner
```

2. Install dependencies:
```bash
npm install
```

3. Create a Twitter Developer account and get API credentials
4. Copy `src/config/twitter.example.js` to `src/config/twitter.js` and add your credentials
5. Run the development server:
```bash
npm run dev
```

## Technology Stack

- React
- Vite
- TailwindCSS
- Shadcn/UI Components
- Twitter API v2

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
