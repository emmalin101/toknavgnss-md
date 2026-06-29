self.__BUILD_MANIFEST = {
  "__rewrites": {
    "afterFiles": [
      {
        "source": "/index.html",
        "destination": "/"
      },
      {
        "source": "/products.html",
        "destination": "/products"
      },
      {
        "source": "/blog.html",
        "destination": "/blog"
      },
      {
        "source": "/about.html",
        "destination": "/about"
      },
      {
        "source": "/contact.html",
        "destination": "/contact"
      },
      {
        "source": "/inquiry.html",
        "destination": "/inquiry"
      },
      {
        "source": "/news.html",
        "destination": "/news"
      },
      {
        "source": "/thanks.html",
        "destination": "/thanks"
      },
      {
        "source": "/products/:category/index.html",
        "destination": "/products/:category"
      },
      {
        "source": "/products/:category/:model.html",
        "destination": "/products/:category/:model"
      },
      {
        "source": "/blog/:slug.html",
        "destination": "/blog/:slug"
      }
    ],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()