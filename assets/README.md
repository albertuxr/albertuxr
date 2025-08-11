# Assets Folder

This folder contains all the image assets used in the Site Onboarding project.

## Overview

- **Total Files**: 27 SVG icons
- **Downloaded**: All assets from the localhost server
- **Manifest**: See `manifest.json` for complete file list

## File Categories

### Navigation Icons
- `5841e84510623414aa849b2407ec94129468fdee.svg` - Main Logo
- `fde9efdbdb12f6aa8a49ddfdc88279c57a80a84c.svg` - EDC Navigation
- `998190efcabefdbfb00f69fe401b089b60a4ed97.svg` - Trials Navigation
- `8288d77c572821ac541a9cbf2e6ece1d07805e86.svg` - SSU Navigation
- `e5ef1887d7c980fdaafb2eb0365aa5e2ca1d7173.svg` - MP Navigation

### UI Icons
- `781a4c5eee3d9d900bf0ed73c03a347048f486db.svg` - Home Breadcrumb
- `e583706497bd9953b308af70a673eff54acdd925.svg` - Chevron (small)
- `aa4eb539740608aa375cf91f45b44a3c48414304.svg` - Dropdown Arrow
- `8380afb072245f0cf59f735c8076182425370fda.svg` - Search Icon
- `cdb2e1c65e6cd84bc4c20bb93dd0dfef54ef9db1.svg` - Action Items

### Task Icons
- `2ef2bcf95a70a0aa96591a73a643522fd6b20a9a.svg` - Feasibility Questionnaire
- `667e3d9f36857ce2e0212ecdbccf6ac42e50cd9e.svg` - Generic Task
- `8cf8200db0ecf842a3736c534c68390ec697e8ec.svg` - Point of Contacts
- `3845ce9ce2b2b2fa536286c75b3986badb3197fd.svg` - Regulatory Documents

### Status Icons
- `8e8269db2fe8c646c1ed0be85c00cd2ee71a1a50.svg` - Completed/Approved Checkmark
- `e6da9f1fa973f15a78e1475d3fc3f7a2708c1579.svg` - Clock/Pending

### Form Icons
- `84fc22550c76ed3fe247f7c054db1fd65c249ed9.svg` - Edit Button
- `26386cd2b3111d1f8c7139075b1bfc53372bb6ad.svg` - Check Mark
- `5d36ec79e18547c76a7473c07b20d607272b67b4.svg` - User Icon
- `466ca090bd01d8369fd61a41cbf7a588ea953807.svg` - Phone Icon
- `14498bc2d3865b1d5d909cc9c6ebd215ed2aeb35.svg` - Email Icon
- `4f078d6320459c33edc71777dddec3be4767ed8b.svg` - Add Icon

### Regulatory Document Icons
- `34089f7cf686190c349d049f1a68a424621dc759.svg` - Document Icon
- `bc64d3813d46a4c401f1483207e7f0e8e21ac561.svg` - Completed Document
- `2fd5f8d407e64971be64b8cac59706ee27a3b771.svg` - Check Mark (small)
- `ca8c893b22777b673bde977237f61bbfca118bef.svg` - Chevron Right
- `78ada98ada7eeee46eabb24f671e18ec7375a7d1.svg` - Check Mark (alternative)

## Usage

All assets are now stored locally in this folder. To use them in your HTML/CSS:

```html
<!-- Instead of: -->
<img src="http://localhost:3845/assets/filename.svg">

<!-- Use: -->
<img src="./assets/filename.svg">
```

## File Sizes

All files are optimized SVG icons, ranging from 312B to 4.4KB in size.

## Maintenance

- Run `node download-assets.js` to re-download all assets
- Check `manifest.json` for the complete file list
- All assets are version-controlled and should be committed to the repository
