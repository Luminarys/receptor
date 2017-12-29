# receptor

Web frontend for [synapse](https://github.com/Luminarys/synapse).

[![](https://sr.ht/PQfE.png)](https://sr.ht/PQfE.png)

A hosted instance is available at https://web.synapse-bt.org.

## Installation

```shell
git submodule update --init --recursive
npm install
npm start
```

At this point you can navigate to http://localhost:3000 to make sure everything
worked. At this point your configuration should be suitable for local
development. For a production installation, press Ctrl-C and continue:

```shell
npm run build:production
```

Serve `index.html` and the `dist/` directory as static content on your web
server. You'll need to serve index.html for any route that would otherwise 404.
Here's an example nginx configuration:

```nginx
server {
    server_name web.synapse-bt.org;
    listen 80;
    
    location / {
        root /var/www/path/to/site;
        try_files $uri /index.html;
    }

    location /dist {
        root /var/www/path/to/site/dist;
    }
}
```
