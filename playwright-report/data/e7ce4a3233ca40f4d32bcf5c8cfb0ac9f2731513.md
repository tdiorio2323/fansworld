# Page snapshot

```yaml
- generic [ref=e2]:
  - link "Skip to main content" [ref=e3] [cursor=pointer]:
    - /url: "#main-content"
  - generic [ref=e5]:
    - region "Notifications (F8)":
      - list
    - region "Notifications alt+T"
    - main [ref=e6]:
      - generic [ref=e8]:
        - heading "404" [level=1] [ref=e9]
        - paragraph [ref=e10]: Oops! Page not found
        - link "Return to Home" [ref=e11] [cursor=pointer]:
          - /url: /
```