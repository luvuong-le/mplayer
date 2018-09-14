import moment from  'moment';
import ui from '../helpers/ui';

import '../scss/main.scss';

export default class MPlayer {

    constructor(config) {
        this.dataSongList = config.songList || null;
        this.dataAudioElementList = [];
        this.playing = [];
        this.shuffle = false;
        this.repeat = false;
        this.fixed = config.fixed || false;
        this.container = config.container || null;
        this.theme = config.theme || false;
        this.volume = config.volume || false; 
        this.mini = config.mini || false;
        this.position = config.position || false;
    }

    /**
        Getters
    */

    get currentAudio() { return this.playing[0] }

    get currentAudioIndex() { return this.dataAudioElementList.findIndex(element => element.title === this.currentAudio.title ) }

    get playlistBtns() { return ui.queryAll('.mp__playlist-btn') }

    get randomIndex() { return Math.floor(Math.random() * this.dataAudioElementList.length) }

    get firstSong() { return this.dataAudioElementList[0] }

    get lastSong() { return this.dataAudioElementList[this.dataAudioElementList.length - 1] }

    get startTimeEl() { return ui.getElId('mpStartTime') }

    get endTimeEl() { return ui.getElId('mpEndTime') }

    get progressBar() { return ui.getElId('mpProgressBar') }

    get volumeBar() { return ui.getElId('mp__volume-slider') }

    get volumeValue() { return ui.getElId('mpVolumeValue') }

    /**
     * @description Set Configuration Options
     */
    setConfigurations() {
        ui.addClass(this.container, 'mp');

        this.theme ? ui.addClass(this.container, this.theme) : null; 

        this.mini ? ui.addClass(this.container, 'mp__mini') : null;

        this.fixed && this.mini && this.position ? this.setFixedPosition(this.position) : null;

        if (this.volume) {
            ui.getElId('mp__volume-slider').value = this.volume * 100;
            ui.getElId('mpVolumeValue').textContent = this.volume * 100;
        }
    }

    setFixedPosition(position) {
        switch (position) {
            case 'TOP_LEFT':
                ui.addClass(this.container, 'mp__tl');
                break;
            case 'TOP_RIGHT': 
                ui.addClass(this.container, 'mp__tr');
                break;
            case 'BOTTOM_LEFT':
                ui.addClass(this.container, 'mp__bl');
                break;
            case 'BOTTOM_RIGHT': 
                ui.addClass(this.container, 'mp__br');
                break;
            default:
                console.log('Not a valid position');
                break;
        }
    }

    /** Functionality */
    stopAll() {
        if (this.playing.length !== 0) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.playing = [];
        }
    }

    play(audioElement) {
        this.stopAll();

        const play = audioElement.play();

        if (play !== undefined) {
            play.then(() => {
                this.progressBar.max = audioElement.duration;
                this.playing.push(audioElement);
                this.updateSongDetails(this.dataSongList[this.currentAudioIndex]);
                this.currentAudio.volume = ui.getElId('mp__volume-slider').value / 100;

                audioElement.addEventListener('timeupdate', () => {
                    const time = audioElement.currentTime * 1000;
                    const currentTime = moment.utc(time).format('mm:ss');

                    this.startTimeEl.textContent = currentTime;

                    this.progressBar.value = (audioElement == null) ? 0 : audioElement.currentTime;
                });
            }).catch((err) => console.log(err));
        }

        audioElement.addEventListener('ended', () => {
            if (this.repeat) {
                this.play(audioElement);
            } else {
                if (this.shuffle) {
                    this.playRandomSong();
                } else {
                    this.playNextSong();
                }
            }
        });
    }

    playToggle() {
        if (this.playing.length !== 0) {
            if (this.currentAudio.paused) {
                this.currentAudio.play();
                ui.rmClass(ui.getElId('mpPlayBtn'), 'fa-play');
                ui.addClass(ui.getElId('mpPlayBtn'), 'fa-pause');
            } else {
                this.currentAudio.pause();
                ui.rmClass(ui.getElId('mpPlayBtn'), 'fa-pause');
                ui.addClass(ui.getElId('mpPlayBtn'), 'fa-play');
            }
        } else {
            this.play(this.firstSong);
            ui.rmClass(ui.getElId('mpPlayBtn'), 'fa-play');
            ui.addClass(ui.getElId('mpPlayBtn'), 'fa-pause');

            // Remove All Selected
            this.toggleSelected(ui.query('.mp__playlist-btn'));
        }
    }

    playNextSong() {
        if (this.shuffle) {
            console.log(true);
            this.playRandomSong();
        } else {
            if (this.currentAudio) {
                if (this.currentAudioIndex === this.dataSongList.length - 1) {
                    this.toggleSelected(this.playlistBtns[0]);
                    this.play(this.firstSong);
                } else {
                    this.toggleSelected(this.playlistBtns[this.currentAudioIndex + 1]);
                    const next = this.dataAudioElementList[this.currentAudioIndex + 1]
                    this.play(next);
                }
            }
        }
    }

    playRandomSong() {
        this.toggleSelected(this.playlistBtns[this.randomIndex]);
        this.play(this.dataAudioElementList[this.randomIndex]);
    }

    playPreviousSong() {
        if (this.currentAudio) {
            console.log(this.currentAudioIndex);
            if (this.currentAudioIndex === 0) {
                this.toggleSelected(this.playlistBtns[this.playlistBtns.length - 1]);
                this.play(this.lastSong);
            } else {
                this.toggleSelected(this.playlistBtns[this.currentAudioIndex - 1]);
                const previous = this.dataAudioElementList[this.currentAudioIndex - 1]
                this.play(previous);
            }
        }
    }

    updateSongDetails(songData) {
        ui.query('.mp__details-cover').src = (songData.cover === null) ? 'https://via.placeholder.com/150x150' : songData.cover;
        ui.query('.mp__playing-now').textContent = songData.name.toLowerCase();

        if (this.currentAudio) {
            this.endTimeEl.textContent = moment.utc(this.currentAudio.duration * 1000).format('mm:ss');
        }
    }

    toggleControl(property, e) {
        this[property] = !this[property];
        return this[property] === true ? (e.target.style.color = '#ccc') : (e.target.style.color = '#000'); ;
    }

    toggleSelected(element) {
        ui.removeClassAll('.mp__playlist-btn', 'mp__playlist-btn--selected');
        ui.addClass(element, 'mp__playlist-btn--selected');
    }

    createDetails() {
        let mpDetails = ui.el('div', { id: 'mpDetails', class: 'mp__details' });
        ui.append(mpDetails, ui.el('img', { src: 'https://via.placeholder.com/150x150', alt: 'Cover', class: 'mp__details-cover'}));

        // Now Playing Div
        let nowPlaying = ui.el('div', {id: 'mpNowPlaying', class: 'mp__playing' });
        ui.append(nowPlaying, ui.el('h3', {}, 'Now Playing'));
        ui.append(nowPlaying, ui.el('p', { id: 'mpNowPlayingText', class: 'mp__playing-now'}));

        // Controls here
        let mpControls = ui.el('div', { id: 'mpControls', class: 'mp__controls' });

        ui.append(nowPlaying, mpControls);

        /* Play */
        let playBtn = ui.el('button', { class: 'mp__controls-btn'});
        ui.append(playBtn, ui.createIcon(['fas', 'fa-play'], 'mpPlayBtn'));
        playBtn.addEventListener('click', () => this.playToggle());

        // Skip
        let nextBtn = ui.el('button', { class: 'mp__controls-btn'}); 
        ui.append(nextBtn, ui.createIcon(['fas', 'fa-forward']));
        nextBtn.addEventListener('click', () => this.playNextSong());

        // Previous
        let previousBtn = ui.el('button', { class: 'mp__controls-btn'});
        ui.append(previousBtn, ui.createIcon(['fas', 'fa-backward']));
        previousBtn.addEventListener('click', () => this.playPreviousSong());

        // Shuffle
        let shuffleBtn = ui.el('button', { id: 'mp__controls-shuffle', class: 'mp__controls-btn'});
        ui.append(shuffleBtn, ui.createIcon(['fas', 'fa-random'], 'mpShuffleBtn'));
        shuffleBtn.addEventListener('click', e => this.toggleControl('shuffle', e));

        // Repeat
        let repeatBtn = ui.el('button', { id: 'mp__controls-repeat', class: 'mp__controls-btn' });
        ui.append(repeatBtn, ui.createIcon(['fas', 'fa-redo'], 'mpRepeatBtn'));
        repeatBtn.addEventListener('click', e => this.toggleControl('repeat', e));

        ui.appendMulti(mpControls, [repeatBtn, previousBtn, playBtn, nextBtn, shuffleBtn]);

        // Song Duration Div
        let songDurationDiv = ui.el('div', { id: 'mpSongDuration', class: 'mp__song-duration' });

        let startTime = ui.el('span', { id: 'mpStartTime', class: 'mp__song-duration-start' }, '00:00');

        let progressInput = ui.el('input', {
            type: 'range', 
            id: 'mpProgressBar',
            class: 'mp__song-duration-bar',
            min: 0,
            value: 0
        });

        let endTime = ui.el('span', { id: 'mpEndTime',class: 'mp__song-duration-end' }, '00:00');

        ui.appendMulti(songDurationDiv, [startTime, progressInput, endTime]);

        // Volume Div
        let volumeDiv = ui.el('div', { class: 'mp__volume' });

        let volumeSlider = ui.el('input', { type: 'range', id: 'mp__volume-slider', class: 'mp__volume-slider', min: 0, max: 100, value: 50});

        ui.append(volumeDiv, ui.createIcon(['mp__volume-value', 'fas', 'fa-volume-up']));
        ui.append(volumeDiv, volumeSlider);
        ui.append(volumeDiv, ui.el('span', { id: 'mpVolumeValue', class: 'mp__volume-value' }, volumeSlider.value)); 
        
        volumeDiv.addEventListener('input', (e) =>  {
            ui.getElId('mpVolumeValue').textContent = e.target.value; 
            this.currentAudio ? this.currentAudio.volume = e.target.value / 100 : null ;
        });

        ui.appendMulti(mpDetails, [nowPlaying, songDurationDiv, volumeDiv]);
        ui.append(this.container, mpDetails);
    }

    createPlaylist() {
        let mpPlayList = ui.el('div', { id: 'mpPlayList', class: 'mp__playlist' });
        ui.append(mpPlayList, ui.el('h4', {}, 'Song List'));

        let mpPlayListItems = ui.el('div', { id: 'mpPlayListItems', class: 'mp__playlist-items'});
        ui.append(mpPlayList, mpPlayListItems);
        ui.append(this.container, mpPlayList);
        
        // Create Music Player Items
        for (let song of this.dataSongList) {
            this.createButton(song);
            this.createAudio(song);
        }
    }

    createButton(song) {
        let mpItem = ui.el('div', {class: 'mp__playlist-btn' });

        let mpItemText = ui.el('span', {}, song.name.toLowerCase(), { pointerEvents: 'none'});

        let mpItemTime = ui.el('span', {}, song.artist, { pointerEvents: 'none' });

        ui.appendMulti(mpItem, [mpItemText, mpItemTime]);

        mpItem.addEventListener('click', e => {
            const audio = this.dataAudioElementList.find(element => element.title === song.name );
            
            this.play(audio);

            this.toggleSelected(e.target);
            
            ui.rmClass(ui.getElId('mpPlayBtn'), 'fa-play');
            ui.addClass(ui.getElId('mpPlayBtn'), 'fa-pause');
        });

        ui.append(ui.getElId('mpPlayListItems'), mpItem);
    }

    createAudio(songData) {
        let mpAudioEl = ui.el('audio', {title: songData.name, src: songData.url });
        this.dataAudioElementList.push(mpAudioEl);
    }

    addListeners() {
        this.progressBar.addEventListener('input', (e) => {
            if (this.progressBar && this.currentAudio) {
                this.currentAudio.currentTime = e.target.value;
                this.progressBar.value = e.target.value;
            }
        });

        window.addEventListener('keydown', e => {
			const LEFT = 37,
				RIGHT = 39,
				SPACE = 32,
				UP = 38,
				DOWN = 40;
			switch (e.keyCode) {
				case LEFT: 
					this.playPreviousSong();
					break;
				case RIGHT:
					this.playNextSong();
					break;
				case SPACE:
                    this.playToggle();
					break;
				case UP:
                    this.volumeBar.value++;
                    this.volumeValue.textContent = this.volumeBar.value;
                    this.currentAudio ? this.currentAudio.volume = this.volumeBar.value / 100 : null;
					break;
				case DOWN:
                    this.volumeBar.value--;
                    this.volumeValue.textContent = this.volumeBar.value;
                    this.currentAudio ? this.currentAudio.volume = this.volumeBar.value / 100 : null;
					break;
				default:
					console.log('Error');
					break;
			}
		});
    }

    initialize() {
        if (this.dataSongList.length !== 0) {
            this.createDetails();
            this.createPlaylist();
            this.addListeners();
            this.setConfigurations();
        }
    }
}
