# 🎵 🎼 Music Player Module 🎵

[![devDependencies Status](https://david-dm.org/luvuong-le/mplayer-module/dev-status.svg)](https://david-dm.org/luvuong-le/mplayer-module?type=dev)
[![dependencies Status](https://david-dm.org/luvuong-le/mplayer-module/status.svg)](https://david-dm.org/luvuong-le/mplayer-module)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

![MPlayer Demo](/src/images/mplayer-demo.gif)

## Project Information

A HTML Music Player for the Web. Rebuilt from a previous version in order to be modular and able to be imported with different projects easily.

### Technologies Used

| Technology   | Description                                                                           | Link ↘️                     |
| ------------ | ------------------------------------------------------------------------------------- | --------------------------- |
| HTML5        | Hyper Text Markup Language                                                            | ----                        |
| CSS3         | Cascading Style Sheets                                                                | ----                        |
| JavaScript   | High Level, Dynamic, Interpreted Language                                             | ----                        |
| SASS         | Syntactically Awesome Style Sheets                                                    | https://sass-lang.com/      |
| Babel        | Javascript Compiler                                                                   | https://babeljs.io/         |
| Webpack      | Javascript Module Bundler                                                             | https://webpack.js.org/     |
| Browser Sync | Synchronised Browser Testing                                                          | https://www.browsersync.io/ |
| NodeJS       | Open Source, Javascript Run Time Environment, Execute Javascript code for server side | https://nodejs.org/en/      |

### Development Setup Process

```javascript
npm install
```

### Setup / Usage

```javascript
import MPlayer from 'path/to/mplayer.js';

const mplayer = new MPlayer(options);
```

### Options Object Format

```javascript
new MPlayer({
	songList: [{}],
	container: document.getElementById('mp'),
	fixed: false,
	theme: false,
	position: false,
	mini: false,
	volume: 0.5,
});
```

### Song List Object Format

```javascript
songList = {
	name: 'songName',
	artist: 'songArtist',
	cover: 'songCover',
	url: 'songPath',
};
```

### Options / Properties

| Option Name | Description                                                                                                      | Default           | Required |
| ----------- | ---------------------------------------------------------------------------------------------------------------- | ----------------- | -------- |
| theme       | Choose a specified theme                                                                                         | false             | No       |
| mini        | Remove playlist showing and shrinks the player                                                                   | false             | No       |
| fixed       | Make this a fixed music player (Mini needs to be enabled for this to work)                                       | false             | No       |
| position    | Choose a position for the player if it's mini and fixed ('TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT') | false && centered | No       |
| container   | Element container for the player                                                                                 | -                 | Yes      |
| volume      | Set Volume for the player (Values between 0 - 1)                                                                 | 0.5               | No       |
| song list   | Array of song objects                                                                                            | -                 | Yes      |

### Available Themes

```javascript
By Default: 'mp'
Black & Red: 'mp--black-red'
Materialistic: 'mp--materialistic'
Light Theme: 'mp--light'
```

### Custom Themes

```javascript
In the options pass in your own custom theme name

new MPlayer({
	theme: 'custom_theme--name'
})

Create your own theme file under 'scss/themes' folder

'_custom-theme.scss'

Import into main.scss: @import 'themes/custom-theme.scss'

##  Look at the theme layout file for reference ##
```

## Additional

-   Song Names must be _unique_

### FAQ / Contact

-   Feel free to submit pull requests and issues! Always looking for improvements and fixes
-   Email: lu-vuongle@hotmail.com
