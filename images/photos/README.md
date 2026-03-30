Place photo page images in this folder.

Each entry in `_data/photos.yml` should provide:

```yml
- date: 2026-03-30
  title: Lab dinner
  description: Optional text
  images:
    - dinner-1.jpg
    - dinner-2.jpg
```

If `images` has one file, it is shown as a single photo.
If `images` has multiple files, they are shown as a slideshow.
If you use only a filename, the page automatically prepends `/images/photos/`.
