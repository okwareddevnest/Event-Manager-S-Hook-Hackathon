# Event Manager Hackathon Challenge 🚀

## Overview
Build a modern, interactive Event Management System using pure HTML, CSS, and JavaScript for the frontend, with Node.js and MySQL for the backend. This challenge tests your full-stack development skills, focusing on creating a responsive, user-friendly interface while implementing proper database management.

## Required Features 📋

### Basic Requirements (Must Have) ✅
1. **User Interface**
   - Clean, modern, and responsive design
   - Intuitive navigation
   - Animated transitions and interactions
   - Mobile-friendly layout

2. **Event Management**
   - Create new events with title, description, and date
   - View list of all events in an organized grid/list
   - View detailed information about each event
   - Update existing events
   - Delete events with confirmation

3. **Data Validation**
   - Form validation for all inputs
   - Proper error handling and user feedback
   - Date validation (no past dates for new events)

4. **Database**
   - MySQL database implementation
   - Proper table structure
   - Efficient queries and data management

### Bonus Features (Extra Points) 🌟
1. **Enhanced UI/UX**
   - Custom animations
   - Dark/Light mode toggle
   - Loading states
   - Error states with proper user feedback

2. **Additional Functionality**
   - Event categories/tags
   - Search/Filter events
   - Sort events by date/title
   - Event image upload
   - User authentication
   - Share events functionality

3. **Deployment**
   - Deploy the application online (Heroku, DigitalOcean, etc.)
   - Provide a live demo URL
   - Document deployment process

## Technical Requirements 💻

### Frontend
- HTML5
- CSS3 (with animations and transitions)
- Vanilla JavaScript (no frameworks allowed)
- Responsive design (mobile-first approach)
- FontAwesome for icons
- Modern UI components (modals, cards, etc.)

### Backend
- Node.js
- Express.js
- MySQL
- RESTful API architecture

## Project Structure 📁
```
event-manager/
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── views/
│   ├── index.html
│   ├── add-event.html
│   └── view-event.html
├── server.js
├── db.sql
├── package.json
└── README.md
```

## Getting Started 🚀

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Git

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/okwareddevnest/Event-Manager-S-Hook-Hackathon.git
   cd Event-Manager-S-Hook-Hackathon
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   mysql -u root -p < db.sql
   ```

4. Configure environment variables:
   ```env
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=event_manager_db
   ```
   Create a `.env` file in the root directory and add the above configuration.

5. Start the server:
   ```bash
   node server.js
   ```

6. Access the application at `http://localhost:3000`

## API Endpoints 🛣️
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get specific event
- `POST /add-event` - Create new event
- `DELETE /api/events/:id` - Delete event

## Deployment Guidelines 🌐

### Recommended Platforms
1. **Heroku**
   - Easy deployment process
   - Free tier available
   - Supports Node.js applications

2. **DigitalOcean**
   - More control over infrastructure
   - Affordable pricing
   - Better performance

3. **Railway**
   - Simple deployment
   - Good free tier
   - Excellent for Node.js apps

### Deployment Steps
1. Create an account on your chosen platform
2. Set up environment variables
3. Configure database connection
4. Deploy application
5. Test thoroughly in production environment

## Evaluation Criteria 📊
Your project will be evaluated based on:
1. Code quality and organization (25%)
2. UI/UX design and responsiveness (25%)
3. Functionality and features (25%)
4. Innovation and creativity (15%)
5. Deployment and documentation (10%)

## Tips for Success 💡
1. Focus on core functionality first
2. Write clean, well-documented code
3. Pay attention to user experience
4. Test thoroughly across different devices
5. Add creative features to stand out
6. Document your code and setup process
7. Create an impressive README
8. Deploy early to avoid last-minute issues

## Resources 📚
- [Node.js Documentation](https://nodejs.org/docs)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Express.js Guide](https://expressjs.com/guide/routing.html)
- [CSS Animation Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/animation)
- [FontAwesome Icons](https://fontawesome.com/icons)
- [Deployment Guides](https://devcenter.heroku.com/categories/deployment)

## Submission Requirements 📝
1. GitHub repository link
2. Live demo URL (if deployed)
3. Brief project description
4. Setup instructions
5. List of implemented features
6. Any additional notes or known issues

Good luck! 🎉 Remember, clean code and attention to detail will set your project apart.

---
© 2025 Event Manager Hackathon. All rights reserved. 