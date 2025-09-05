# Page snapshot

```yaml
- generic [ref=e2]:
  - link "Skip to main content" [ref=e3] [cursor=pointer]:
    - /url: "#main-content"
  - generic [ref=e5]:
    - region "Notifications (F8)":
      - list [ref=e7]:
        - listitem [ref=e8]:
          - generic [ref=e9]:
            - generic [ref=e10]: Error
            - generic [ref=e11]: Failed to load creator profile
          - button [ref=e12] [cursor=pointer]:
            - img [ref=e13] [cursor=pointer]
    - region "Notifications alt+T"
    - main [ref=e17]:
      - generic [ref=e19]:
        - img [ref=e21]
        - heading "Creator Not Found" [level=2] [ref=e25]
        - paragraph [ref=e26]: The creator profile you're looking for doesn't exist or has been removed.
        - button "Go Back" [ref=e27] [cursor=pointer]:
          - img
          - text: Go Back
```