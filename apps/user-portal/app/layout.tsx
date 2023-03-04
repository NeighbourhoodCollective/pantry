
type AppProps = {
    children: React.ReactNode
}



export default function RootLayout({ children }: AppProps) {
    return (
        <html lang="en">
            <body>
                <main>{children}</main>

            </body>
        </html>
    )
}
