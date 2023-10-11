import 'src/styles/globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import type { AppProps } from 'next/app';
import Head from 'next/head';

const plusJakartaSans = Plus_Jakarta_Sans({
	subsets: ['latin'],
});

export default function App({ Component, pageProps }: AppProps) {
	return (
		<main className={plusJakartaSans.className}>
			<Head>
				<title>EpicChat</title>
				<link
					rel="icon"
					type="image/x-icon"
					href="/favicon.ico"
				></link>
			</Head>
			<Component {...pageProps} />
		</main>
	);
}
