import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from 'src/utils/firebase';
import { Button } from '@mui/material';
import Image from 'next/image';

const Login = () => {
	const [signInWithGoogle] = useSignInWithGoogle(auth);

	return (
		<div className="app">
			<div className="login">
				<div className="login__background"></div>
				<div className="login__container">
					<Image
						src="/logo.png"
						alt="Logo"
						width={100}
						height={100}
					/>
					<div className="login__text">
						<h1>Sign in to EpicChat</h1>
					</div>
					<Button onClick={() => signInWithGoogle()}>Sign in with Google</Button>
				</div>
			</div>
		</div>
	);
};

export default Login;
