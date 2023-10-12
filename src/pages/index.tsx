import { CircularProgress } from '@mui/material';
import Login from 'src/components/Login';
import Sidebar from 'src/components/Sidebar';
import Chat from 'src/components/Chat';
import useAuthUser from 'src/hooks/useAuthUser';

export default function Home() {
	const { user, loading } = useAuthUser();

	if (loading) {
		return (
			<div className="chat__deleting">
				<CircularProgress />
			</div>
		);
	}

	if (!user) return <Login />;

	return (
		<div className="app">
			<div className="app__body">
				<Sidebar user={user} />
				<Chat user={user} />
			</div>
		</div>
	);
}
