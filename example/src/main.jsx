import React from 'react'
import { render } from 'react-dom'
import { createInertiaApp, Link } from '@inertiajs/inertia-react'

function Wrapper({ children }) {
    return (
        <div>
            <h2>Inertia Demo</h2>
            <nav>
                <Link href="/">Home</Link>
                <Link href="/about">About</Link>
            </nav>
            {children}
        </div>
    )
}

createInertiaApp({
    resolve: name => require(`./pages/${name}.jsx`).default,
    setup({ el, App, props }) {
        render(<Wrapper>
            <App {...props} />
        </Wrapper>, el)
    },
})
