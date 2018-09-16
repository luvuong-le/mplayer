import moment from  'moment';
import ui from '@/helpers/ui';
import '@/scss/main.scss';

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
        this.hideCoverArt = config.hideCoverArt || false;
    }

    /**
     * @description Defines the getters
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

    get volumeIcon() { return ui.getElId('mpVolumeIcon') }

    get volumeBar() { return ui.getElId('mp__volume-slider') }

    get volumeValue() { return ui.getElId('mpVolumeValue') }

    /**
     * @description Set configuration options passed through 
     */
    setConfigurations() {
        ui.addClass(this.container, 'mp');

        this.theme ? ui.addClass(this.container, this.theme) : null; 

        this.mini ? ui.addClass(this.container, 'mp__mini') : null;

        this.fixed && this.mini && this.position ? this.setFixedPosition(this.position) : null;

        if (this.volume) {
            this.volumeBar.value = Math.round(this.volume * 100);
            this.volumeValue.textContent = Math.round(this.volume * 100);
        }

        this.hideCoverArt ? ui.addClass(this.container, 'mp__no-cover-art') : null; 
        
        console.info('[MPlayer] Initialized with configurations successfully | v1.0');
    }

    
    /**
     * @param  {String} position
     * @description Adds a fixed class to make the player in a fixed position
     */
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

    /** MPlayer Functionality */

    /**
     * @description Clears/Stops all songs
     */
    stopAll() {
        if (this.playing.length !== 0) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.playing = [];
        }
    }

    /**
     * 
     * @param {HTMLAudioElement} audioElement 
     * @description Plays the audio element passed in and updates the mplayer
     */
    play(audioElement) {
        this.stopAll();

        const play = audioElement.play();

        if (play !== undefined) {
            play.then(() => {
                this.progressBar.max = audioElement.duration;
                this.playing.push(audioElement);
                this.updateSongDetails(this.dataSongList[this.currentAudioIndex]);
                this.toggleSelected(this.playlistBtns[this.currentAudioIndex]);
                this.currentAudio.volume = ui.getElId('mp__volume-slider').value / 100;
                this.playIconToggle();

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
                return this.play(audioElement);
            }

            this.shuffle ? this.playRandomSong() : this.playNextSong();
        });
    }

    /**
     * @description Toggles the play button font awesome icon
     */
    playIconToggle() {
        if (this.currentAudio && !this.currentAudio.paused) {
            ui.rmClass(ui.getElId('mpPlayBtn'), 'fa-play');
            ui.addClass(ui.getElId('mpPlayBtn'), 'fa-pause');
        } else {
            ui.rmClass(ui.getElId('mpPlayBtn'), 'fa-pause');
            ui.addClass(ui.getElId('mpPlayBtn'), 'fa-play');
        }
    }

    /**
     * @description Toggles the audio element between playing and paused states
     */
    playToggle() {
        if (this.playing.length !== 0) {
            this.currentAudio.paused ? this.currentAudio.play() : this.currentAudio.pause();
            this.playIconToggle();
        } else {
            this.play(this.firstSong);
            this.playIconToggle();
            this.toggleSelected(ui.query('.mp__playlist-btn'));
        }
    }

    /**
     * @description Plays the next song depending on the current index
     */
    playNextSong() {
        this.shuffle ? this.playRandomSong() : null;
        
        if (!this.currentAudio) return; 

        if (this.currentAudioIndex === this.dataSongList.length - 1) {
            this.toggleSelected(this.playlistBtns[0]);
            this.play(this.firstSong);
        } else {
            this.toggleSelected(this.playlistBtns[this.currentAudioIndex + 1]);
            this.play(this.dataAudioElementList[this.currentAudioIndex + 1]);
        }
    }

    /**
     * @description Plays a random song using a randomly generated index
     */
    playRandomSong() { this.play(this.dataAudioElementList[this.randomIndex]) }


    /**
     * @description Play the previous song
     */
    playPreviousSong() {
        if (!this.currentAudio) return; 
        
        if (this.currentAudioIndex === 0) {
            this.toggleSelected(this.playlistBtns[this.playlistBtns.length - 1]);
            this.play(this.lastSong);
        } else {
            this.toggleSelected(this.playlistBtns[this.currentAudioIndex - 1]);
            this.play(this.dataAudioElementList[this.currentAudioIndex - 1]);
        }
    }
    
    /**
     * @description Check to see if there are two songs playing at once and only play the first song in the array
     */
    setMultiSongCheck() {
        setInterval(() => {
            if (this.playing.length >= 2) {
                for (let i = 1; i < this.playing.length; i++) {
                    this.playing[i].pause();
                }
                this.playing.splice(1);
                this.progressBar.max = this.currentAudio.duration;
                this.currentAudio.paused ? this.currentAudio.play() : null;
            }
        }, 500);
    }

    /**
     * @description Sets the volume and volume icon change
     */
    setVolume() {
        this.volumeValue.textContent = this.volumeBar.value;
        this.currentAudio ? this.currentAudio.volume = this.volumeBar.value / 100 : null;

        if (parseInt(this.volumeValue.textContent) === 0) {
			ui.setNewClass(this.volumeIcon, 'mp__volume-value fas fa-volume-off');
		}

        if (parseInt(this.volumeValue.textContent)  > 0 && parseInt(this.volumeValue.textContent)  <= 35) {
            ui.setNewClass(this.volumeIcon, 'mp__volume-value fas fa-volume-down');
        }

        if (parseInt(this.volumeValue.textContent)  > 35 && parseInt(this.volumeValue.textContent)  <= 75) {
            ui.setNewClass(this.volumeIcon, 'mp__volume-value fas fa-volume-down');
        }

        if (parseInt(this.volumeValue.textContent)  > 75 && parseInt(this.volumeValue.textContent)  <= 100) {
            ui.setNewClass(this.volumeIcon, 'mp__volume-value fas fa-volume-up');
        }
    }

    /**
     * 
     * @param {object} songData
     * @description Update song data in the UI based on the song data
     */
    updateSongDetails(songData) {
        ui.query('.mp__details-cover').src = (!songData.cover) ? 'https://via.placeholder.com/150x150' : songData.cover;
        ui.query('.mp__playing-now').textContent = songData.name;
        this.currentAudio ? this.endTimeEl.textContent = moment.utc(this.currentAudio.duration * 1000).format('mm:ss') : null;
    }

    /**
     * 
     * @param {string} property 
     * @param {event} e 
     * @description Toggles the control button (Shuffle / Repeat)
     */
    toggleControl(property, e) {
        this[property] = !this[property];
        return this[property] ? (e.target.style.color = '#ccc') : (e.target.style.color = '#000'); ;
    }

    toggleSelected(element) {
        ui.removeClassAll('.mp__playlist-btn', 'mp__playlist-btn--selected');
        ui.addClass(element, 'mp__playlist-btn--selected');
    }

    /**
     * @description Creates the UI layout of the mplayer and adds event listeners to controls
     */
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

        ui.append(volumeDiv, ui.createIcon(['mp__volume-value', 'fas', 'fa-volume-up'], 'mpVolumeIcon'));
        ui.append(volumeDiv, volumeSlider);
        ui.append(volumeDiv, ui.el('span', { id: 'mpVolumeValue', class: 'mp__volume-value' }, volumeSlider.value)); 
        
        volumeSlider.addEventListener('input', e => this.setVolume());

        ui.appendMulti(mpDetails, [nowPlaying, songDurationDiv, volumeDiv]);
        ui.append(this.container, mpDetails);
    }

    /**
     * @description Create the playist/songlist portion of the UI
     */
    createPlaylist() {
        let mpPlayList = ui.el('div', { id: 'mpPlayList', class: 'mp__playlist' });
        ui.append(mpPlayList, ui.el('h4', {}, 'Song List'));

        let mpPlayListItems = ui.el('div', { id: 'mpPlayListItems', class: 'mp__playlist-items'});
        ui.append(mpPlayList, mpPlayListItems);
        ui.append(this.container, mpPlayList);
        
        // Create Music Player Items
        for (let songData of this.dataSongList) {
            this.createButton(songData);
            this.createAudio(songData);
        }
    }

    /**
     * 
     * @param {object} songData
     * @description Creates the individual song buttons in the playlist/songlist
     *  
     */
    createButton(songData) {
        let mpItem = ui.el('div', {class: 'mp__playlist-btn' });

        let mpItemText = ui.el('span', {}, songData.name, { pointerEvents: 'none'});

        let mpItemTime = ui.el('span', {}, songData.artist, { pointerEvents: 'none' });

        ui.appendMulti(mpItem, [mpItemText, mpItemTime]);

        mpItem.addEventListener('click', e => {
            const audio = this.dataAudioElementList.find(element => element.title === songData.name );
            
            this.play(audio);

            this.toggleSelected(e.target);
            
            ui.rmClass(ui.getElId('mpPlayBtn'), 'fa-play');
            ui.addClass(ui.getElId('mpPlayBtn'), 'fa-pause');
        });

        ui.append(ui.getElId('mpPlayListItems'), mpItem);
    }

    /**
     * 
     * @param {object} songData
     * @description Creates the HTMLAudioElement based on the songData and appends it to an array 
     */
    createAudio(songData) {
        this.dataAudioElementList.push(ui.el('audio', { title: songData.name, src: songData.url }));
    }

    /**
     * @description Add event listeners for key control and progress/elapsed bar input
     */
    addListeners() {
        this.progressBar.addEventListener('input', e => {
            if (this.progressBar && this.currentAudio) {
                this.currentAudio.currentTime = e.target.value;
                this.progressBar.value = e.target.value;
            }
        });

        window.addEventListener('keydown', e => {
			const LEFT = 37, RIGHT = 39, SPACE = 32, UP = 38, DOWN = 40;
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
                    this.setVolume();
					break;
				case DOWN:
                    this.volumeBar.value--;
                    this.setVolume();
					break;
				default:
					console.warn('[ERROR=Key Error] Non Valid Key Pressed');
					break;
			}
		});
    }

    /**
     * @description Initialize the mplayer
     */
    initialize() {
        if (!this.container) throw new Error('[ERROR=No Container Element] MPlayer requires a container element to generate with'); 
        if (!this.dataSongList) throw new Error('[ERROR=No Song Data Given] MPlayer can not be initialized without song data'); 
        this.createDetails();
        this.createPlaylist();
        this.addListeners();
        this.setConfigurations();
        this.setMultiSongCheck();
    }
}
