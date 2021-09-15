
const kLazy = Symbol('InertiaLazy')
const globallyShared = {}

class Inertia {
    static lazy(value) {
        return {
            [kLazy]: true,
            value
        }
    }

    static share(key, value) {
        globallyShared[key] = value
    }

    constructor({request, reply, options}) {
        this.request = request
        this.reply = reply
        this.options = options
        this.sharedProps = {}
        this.viewProps = {}
        this.cache = {}
    }

    share(key, value) {
        this.sharedProps[key] = value
    }

    flushShared() {
        this.sharedProps = {}
    }

    async render(component, data = {}) {
        this._applyHeaders()

        const currentAssetVersion = await this._version()
        const requestAssetVersion = this.request.headers['x-inertia-version'] ?? "1"

        const props = await this._resolveProps(data)
        const url = this.request.url
        const pageData = {
            component,
            props,
            url,
            version: currentAssetVersion
        }

        if (this.request.headers['x-inertia']) {
            if (currentAssetVersion === requestAssetVersion) {
                return this.reply
                    .headers({
                        'Vary': "Accept",
                        'X-Inertia-Version': currentAssetVersion
                    })
                    .send(pageData)
            } else {
                console.log('new asset version')
                return this.reply.status(409).headers({
                    'X-Inertia-Location': url
                }).send(pageData)
                // return this.location(`http://localhost:3000${this.request.url}`, pageData)
            }
        }

        const result = await this.options.renderRootView({
            ...this.viewProps,
            page: JSON.stringify(pageData)
        })


        if (typeof result == 'string') {
            this.reply.type('text/html')
        }

        return this.reply 
            .headers({
                'Vary': "Accept",
                'X-Inertia-Version': currentAssetVersion
            })
            .send(result)
    }

    location(url, data) {
        return this.reply.status(409).headers({
            'X-Inertia-Location': url
        }).send(data)
    }
    
    redirect(url) {
        this._applyHeaders()

        return this.reply.redirect(
            url ?? this.request.headers.url
        )
    }

    _applyHeaders() {
        this.reply.headers({
            'X-Inertia': true
        })
    }

    async _version() {
        if (!this.cache.version) {
            this.cache.version = await this.options.resolveAssetVersion(this.request)
        }
        return this.cache.version
    }

    async _resolveProps(renderProps) {
        const resolvedProps = {}  
        const allProps = {
            ...globallyShared,
            ...this.options.share(),
            ...this.sharedProps,
            ...renderProps
        }
        
        const propKeys = this.request.headers['x-inertia-partial-data']
            ? this.request.headers['x-inertia-partial-data'].split(',')
            : Object.keys(allProps)

        propKeys.forEach(async propKey => {
            // Check if the prop needs to be resovled (partial reloads)
            if (typeof allProps[propKey] === 'function') {
                resolvedProps[propKey] = await allProps[propKey]()
            }

            // Check if the prop is lazy (partial reloads)
            if (allProps[propKey] && allProps[propKey][kLazy]) {
                resolvedProps[propKey] = allProps[propKey].value
            }

            resolvedProps[propKey] = allProps[propKey]
        })

        return resolvedProps
    }
}

module.exports = Inertia