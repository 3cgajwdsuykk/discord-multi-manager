# Discord Multi-Account Manager

A web application that allows you to manage multiple Discord accounts simultaneously, chat in different servers, join voice channels, and play audio across all connected accounts.

## Features

- **Multi-Account Management**: Connect and manage multiple Discord accounts using tokens
- **Chat Interface**: Send and receive messages across different Discord servers
- **Voice Channel Management**: Join and leave voice channels with multiple accounts
- **Audio Playback**: Play audio files through all connected accounts in voice channels
- **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS

## ⚠️ Important Notes

**This application is for educational purposes only. Please be aware of the following:**

1. **Discord Terms of Service**: Using multiple user tokens simultaneously may violate Discord's Terms of Service
2. **API Limitations**: Discord's official API has rate limits and connection restrictions
3. **Security**: User tokens provide full access to Discord accounts - keep them secure
4. **Legal Compliance**: Ensure you comply with all applicable laws and Discord's policies

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Discord user tokens (for each account you want to connect)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd discord-multi-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Optional: Add any environment variables here
   NODE_ENV=development
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### 1. Adding Discord Accounts

1. Go to the **Accounts** tab
2. Enter your Discord user token in the input field
3. Click "Add Account"
4. The account will be connected and displayed in the accounts list

### 2. Chatting

1. Go to the **Chat** tab
2. Select an account from the dropdown
3. Choose a server and channel
4. Start typing and sending messages

### 3. Voice Channels

1. Go to the **Voice** tab
2. Select an account
3. Choose a server and voice channel
4. Click "Join" to connect to the voice channel
5. Use "Join All" to connect all accounts to the same channel

### 4. Audio Playback

1. Go to the **Audio** tab
2. Select an audio file to play
3. Choose which accounts should play the audio
4. Adjust volume as needed
5. Click "Play Audio" to start playback

## Deployment to Vercel

This application is configured for easy deployment to Vercel:

1. **Push your code to GitHub**

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the Next.js configuration

3. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application

4. **Environment Variables** (if needed)
   - Add any environment variables in the Vercel dashboard
   - Redeploy if you make changes

## Project Structure

```
discord-multi-manager/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   │   └── discord/       # Discord-related API endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/             # React components
│   ├── AccountManager.tsx # Account management
│   ├── ChatInterface.tsx  # Chat functionality
│   ├── VoiceManager.tsx   # Voice channel management
│   └── AudioPlayer.tsx    # Audio playback
├── package.json           # Dependencies and scripts
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── vercel.json            # Vercel deployment configuration
└── README.md              # This file
```

## API Endpoints

- `POST /api/discord/connect` - Connect a Discord account
- `POST /api/discord/disconnect` - Disconnect a Discord account
- `GET /api/discord/channels` - Get channels for a guild
- `GET /api/discord/voice-channels` - Get voice channels for a guild
- `GET /api/discord/messages` - Get messages from a channel
- `POST /api/discord/send-message` - Send a message to a channel
- `POST /api/discord/join-voice` - Join a voice channel
- `POST /api/discord/leave-voice` - Leave a voice channel
- `POST /api/discord/play-audio` - Play audio in a voice channel
- `POST /api/discord/stop-audio` - Stop audio playback

## Technical Implementation Notes

### Current State
The current implementation includes:
- ✅ Complete UI components and routing
- ✅ API endpoint structure
- ✅ Mock data for testing
- ✅ TypeScript types and interfaces
- ✅ Responsive design with Tailwind CSS

### Production Implementation Required
To make this fully functional, you would need to implement:
- Client instance management and storage
- Real Discord API integration
- Voice connection handling
- Audio streaming and processing
- Error handling and reconnection logic
- Rate limiting and API compliance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This software is provided "as is" without warranty. The authors are not responsible for any misuse or violations of Discord's Terms of Service. Use at your own risk and ensure compliance with all applicable policies and laws.

## Support

For issues and questions:
1. Check the existing issues
2. Create a new issue with detailed information
3. Provide error logs and reproduction steps

---

**Remember**: This tool is for educational purposes. Always respect Discord's Terms of Service and use responsibly.
