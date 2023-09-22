import Button from '@mui/material/Button';
import logo from '../images/logo.png'
import { useHistory } from 'react-router-dom'

export default function SplashScreen() {
    const history = useHistory()

    function toRegister() {
        history.push('/register/');
    }

    function toLogin() {
        history.push('/login/');
    }

    return (
        <div id="splash-screen">
            <img id="splash-logo" 
                 src={logo} />
            <div id="splash-description">
                Need a place to discover other amazing playlists? Or create your own personalized playlist and share it to the world for everyone to hear? Come join Playlister! 
            </div>
            <Button
                id="splash-register-button"
                onClick={toRegister}
                variant="contained">
                Create Account
            </Button>
            <Button
                id="splash-login-button"
                onClick={toLogin}
                variant="contained">
                Login
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