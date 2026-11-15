import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import InteractiveEffects from '@/components/common/InteractiveEffects';

export const metadata = {
  title: 'Tandava Nritya Academy | Cosmic Real-Time Dance Conservatory',
  description: 'Sanctuary of Classical Indian, Contemporary, and Global Dance Arts inspired by the cosmic dance of Lord Shiva Nataraja. Managed with MongoDB Atlas and Socket.IO.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <InteractiveEffects />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
