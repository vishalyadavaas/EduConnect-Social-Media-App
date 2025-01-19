# EduConnect

EduConnect is an Expo-powered React Native app designed to connect educators, students, and learning resources in one place. The goal is to simplify and enhance the virtual learning experience.

## Features
- User authentication with Supabase
- Create, like, and share posts
- Comment on posts in real-time
- Manage and view media files
- Clean and modern UI with React Native

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```
2. **Start Development Server**
   ```bash
   npm run start
   ```
3. **Build and Test for Android**
   ```bash
   npm run android
   ```
4. **Build and Test for iOS (macOS only)**
   ```bash
   npm run ios
   ```

## Project Structure
- **app**: Entry points for Expo Router screens
- **components**: Reusable UI components (e.g., Avatar, PostCard)
- **services**: Supabase and API logic (postService, imageService)
- **helpers**: Utility functions (stripHtmlTags)
- **contexts**: Context providers, e.g., AuthContext
- **constants**: Theme, color, and layout definitions
