import { GetServerSidePropsContext } from 'next';
import { useCallback, useState } from 'react';
import { AppProps } from 'next/app';
import { getCookie, setCookies } from 'cookies-next';
import Head from 'next/head';
import {
  MantineProvider,
  ColorScheme,
  ColorSchemeProvider,
  AppShell,
  Header,
  Group,
  Global,
} from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import KtIm from '../components/icons/KtIm';

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);

  const toggleColorScheme = useCallback(
    (value?: ColorScheme) => {
      const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
      setColorScheme(nextColorScheme);
      setCookies('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
    },
    [colorScheme]
  );

  return (
    <>
      <Head>
        <title>Nike da best</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon.svg?v=4" />
      </Head>

      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
          <NotificationsProvider>
            <Global
              styles={(theme) => ({
                '*, *::before, *::after': {
                  boxSizing: 'border-box',
                },

                body: {
                  ...theme.fn.fontStyles(),
                  backgroundColor:
                    theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.pink[1],
                  color: theme.colorScheme === 'dark' ? theme.colors.pink[1] : theme.colors.dark[9],
                  lineHeight: theme.lineHeight,
                },
              })}
            />
            <AppShell
              padding="md"
              header={
                <Header
                  sx={(theme) => ({
                    backgroundColor:
                      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.pink[2],
                    color:
                      theme.colorScheme === 'dark' ? theme.colors.pink[2] : theme.colors.dark[7],
                  })}
                  className="moon-header"
                  height={65}
                  p="xs"
                >
                  <Group position="apart">
                    <KtIm />
                    <ColorSchemeToggle />
                  </Group>
                </Header>
              }
            >
              <Component {...pageProps} />
            </AppShell>
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie('mantine-color-scheme', ctx) || 'light',
});
