import { Link } from 'react-router-dom'

import Button from '@mui/material/Button';
import Logo from '../images/logo.png'

export default function SplashScreen() {

    return (
        <div id="splash-screen">
            <img id="splash-logo" src={Logo} />
            <div id="splash-description">
                Need a place to discover other amazing playlists? Or create your own personalized playlist and share it to the world for everyone to hear? Come join Playlister! 
            </div>
            <Button
                id="splash-register-button"
                variant="contained">
                <Link style={{ textDecoration: 'none', color: 'white' }} to='/register/'>Create Account</Link>
            </Button>
            <Button
                id="splash-login-button"
                variant="contained">
                <Link style={{ textDecoration: 'none', color: 'white' }} to='/login/'>Login</Link>
            </Button>
            <Button
                id="splash-guest-button"
                variant="contained">
                Continue As Guest
            </Button>
            <div id="splash-credit">
                By: Christopher Lee
            </div>
        </div>
    )
}