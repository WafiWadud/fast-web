# fast-web

A lightweight, production-ready web caching implementation that makes your
website blazingly fast! 🔥

## Overview

This project demonstrates how to implement an efficient service worker caching
strategy to significantly improve website performance, resilience, and offline
capabilities. The implementation follows best practices for modern progressive
web applications (PWAs).

## Features

- **Intelligent Cache Management**: Uses a cache-first strategy with automatic
  2-day expiration
- **Offline Functionality**: Provides seamless offline experience for
  previously visited content
- **Fallback Mechanism**: Gracefully handles network failures by serving
  expired cache when needed
- **Smart Resource Handling**: Selectively caches same-origin requests and
  specific API endpoints
- **Automatic Cleanup**: Periodically removes expired cache entries to conserve
  storage space

## Technologies Used

- **Service Workers**: Core technology that enables background caching and
  offline capabilities
- **Cache API**: For efficient storage and retrieval of network responses
- **Fetch API**: For flexible network request handling
- **Promise-based Architecture**: For clean asynchronous code
- **instant.page**: Preloads pages on hover for even faster page transitions

## Cache Strategy Implementation

- **Cache-First Strategy**: Checks for valid cached content before making
  network requests
- **Cache Invalidation**: Automatically expires content after 2 days
  (configurable)
- **Smart Caching**: Only caches GET requests from same-origin or whitelisted
  domains
- **Graceful Degradation**: Falls back to expired cache when network is
  unavailable

## Demo Page

The included demo page allows you to:

- Test image caching
- Test API response caching
- Verify offline functionality
- Experience the performance benefits firsthand

## Getting Started

1. Clone this repository
2. Serve the files using any static web server
3. Open the demo page in a modern browser
4. Use browser DevTools to test offline functionality and examine network
   behavior

## Browser Compatibility

This implementation works in all modern browsers that support Service Workers:

- Chrome/Edge (40+)
- Firefox (44+)
- Safari (11.1+)
- Opera (27+)

## Customization

You can easily customize the caching behavior by modifying the `sw.js` file:

- Change `CACHE_DURATION` to adjust the cache expiration time
- Modify the URL filtering logic to cache different resources
- Adjust the cache cleanup frequency by changing the random probability value
