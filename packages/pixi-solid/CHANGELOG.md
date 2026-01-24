# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

- ✅ Added for new features.
- ⚙️ Changed for changes in existing functionality.
- 📺 Deprecated for soon-to-be removed features.
- Removed for now removed features.
- Fixed for any bug fixes.
- Security in case of vulnerabilities.

## 0.1.0 [Unreleased] - 2025-12-22

- ✅ Added a `usePixiScreen` hook that returns the Pixi Screen dimensions as a reactive store that can be subscribed to.
- ✅ Added a `useSmoothDamp` hook for smoothly dampening a numeric value towards a target over time, synchronized with the PixiJS ticker.
- ✅ Added a `useSpring` hook for creating spring-based animations for numeric values, synchronized with the PixiJS ticker.
