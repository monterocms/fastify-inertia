import * as React from 'react';
import { render } from 'react-dom';
import { createInertiaApp, Link } from '@inertiajs/inertia-react';
import { InertiaProgress } from '@inertiajs/progress'
import {ChakraProvider, Heading, Link as ChakraLink, HStack} from '@chakra-ui/react';
import { ColorModeScript } from "@chakra-ui/react";

InertiaProgress.init({
    delay: 0
})

const Wrapper: React.FunctionComponent<any> = function(props) {
    return (
        <ChakraProvider>
            <ColorModeScript />
            <Heading>Inertia Demo</Heading>
            <HStack py="2" spacing="2">
                <ChakraLink as={Link} href="/">Home</ChakraLink>
                <ChakraLink as={Link} href="/about">About</ChakraLink>
                <ChakraLink as={Link} href="/contact">Contact</ChakraLink>
            </HStack>
            {props?.children}
        </ChakraProvider>
    )
}

createInertiaApp({
    // @ts-ignore-next
    resolve: name => import(`./pages/${name}`), 

    setup({ el, App, props }) {
        render(
            <React.StrictMode>
                <Wrapper>
                    <App {...props} />
                </Wrapper>
            </React.StrictMode>
        ,el)
    },
})
