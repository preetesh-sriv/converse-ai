import { Link, Outlet } from 'react-router-dom'
import './rootLayout.css'
import { ClerkProvider, SignedIn, UserButton } from '@clerk/clerk-react'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const queryClient = new QueryClient()

const RootLayout = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <QueryClientProvider client={queryClient}>
    <div className='rootLayout'>
    <header>
        <Link to="/" className='logo'>
        <img src='/ai2.ico' alt=''/>
        <span>ConverseAI</span>
        </Link>
        <div className='user'> 
        <SignedIn>
            <UserButton />
        </SignedIn>
        </div>
    </header>
    <main>
    {/* Whatever you write inside the children, it will be inside the Outlet */}
    <Outlet/>
    </main>
    </div>
    </QueryClientProvider>
    </ClerkProvider>
  )
}

export default RootLayout