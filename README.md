# Music Player Module

[![devDependencies Status](https://david-dm.org/luvuong-le/mplayer-module/dev-status.svg)](https://david-dm.org/luvuong-le/mplayer-module?type=dev)
[![dependencies Status](https://david-dm.org/luvuong-le/mplayer-module/status.svg)](https://david-dm.org/luvuong-le/mplayer-module)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## Development Status: In Progress

> ### Information about the project
>
> A customisable music player for the web

> ### Technologies Used

| Technology   | Description                                                                           | Link                        |
| ------------ | ------------------------------------------------------------------------------------- | --------------------------- |
| HTML5        | Hyper Text Markup Language                                                            | ----                        |
| CSS3         | Cascading Style Sheets                                                                | ----                        |
| JavaScript   | High Level, Dynamic, Interpreted Language                                             | ----                        |
| SASS         | Syntactically Awesome Style Sheets                                                    | https://sass-lang.com/      |
| Babel        | Javascript Compiler                                                                   | https://babeljs.io/         |
| Webpack      | Javascript Module Bundler                                                             | https://webpack.js.org/     |
| Browser Sync | Synchronised Browser Testing                                                          | https://www.browsersync.io/ |
| NodeJS       | Open Source, Javascript Run Time Environment, Execute Javascript code for server side | https://nodejs.org/en/      |

### Build Process Used

> Webpack as module bundler and build tool

### Setup Process

```javascript
    npm install
```

### Usage

```javascript
const mplayer = new MPlayer(options);
```

### Options Format

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

### Song List Format

```javascript
songList = {
	name: 'songName',
	artist: 'songArtist',
	cover: 'songCover',
	url: 'songPath',
};
```

### Options | Properties

| Option Name | Description                                                                                                      | Default           | Required |
| ----------- | ---------------------------------------------------------------------------------------------------------------- | ----------------- | -------- |
| theme       | Choose a specified theme                                                                                         | false             | No       |
| mini        | Remove playlist showing and shrinks the player                                                                   | false             | No       |
| fixed       | Make this a fixed music player (Mini needs to be enabled for this to work)                                       | false             | No       |
| position    | Choose a position for the player if it's mini and fixed ('TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT') | false && centered | No       |
| container   | Element container for the player                                                                                 | -                 | Yes      |
| volume      | Set volume for the player                                                                                        | 0.5               | No       |
| song list   | An array of objects                                                                                              | -                 | Yes      |

### Themes

```javascript
    By Default: 'mp'
    Black & Red: 'mp--black-red'
    Materialistic: 'mp--materialistic'
    Light Theme: 'mp--light'
```

### Notes

-   Song Names must be unique
