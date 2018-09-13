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
    }

    /**
        Getters
    */

    get currentAudio() {
        return this.playing[0];
    }

    get currentAudioIndex() {
        return this.dataAudioElementList.findIndex(element => {
            return element.title === this.currentAudio.title;
        });
    }

    get randomIndex() {
        return Math.floor(Math.random() * this.dataAudioElementList.length);
    }

    get firstSong() {
        return this.dataAudioElementList[0];
    }

    get lastSong() {
        return this.dataAudioElementList[this.dataAudioElementList.length - 1];
    }

    get startTimeEl() {
        return ui.getElId('mpStartTime');
    }

    get endTimeEl() {
        return ui.getElId('mpEndTime');
    }

    get progressBar() {
        return ui.getElId('mpProgressBar');
    }

    /**
     * @description Set Configuration Options
     */
    setConfigurations() {
        ui.addClass(this.container, 'mp');

        this.theme ? ui.addClass(this.container, this.theme) : null; 

        this.mini ? ui.addClass(this.container, 'mp__mini') : null;

        this.fixed && this.mini ? ui.addClass(this.container, 'mp__fixed') : null;

        if (this.volume) {
            ui.getElId('mp__volume-slider').value = this.volume * 100;
            ui.getElId('mpVolumeValue').textContent = this.volume * 100;
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
            if (this.repeat === true) {
                this.play(audioElement);
            } else {
                if (this.shuffle === true) {
                    this.playRandomSong();
                } else {
                    this.playNextSong();
                }
            }
        });
    }

    playNextSong() {
        if (this.shuffle === true) {
            this.playRandomSong();
        } else {
            if (this.currentAudio) {
                if (this.currentAudioIndex === this.dataSongList.length - 1) {
                    this.play(this.firstSong);
                } else {
                    const next = this.dataAudioElementList[this.currentAudioIndex + 1]
                    this.play(next);
                }
            }
        }
    }

    playRandomSong() {
        this.play(this.dataAudioElementList[this.randomIndex]);
    }

    playPreviousSong() {
        if (this.currentAudio) {
            if (this.currentAudioIndex === 0) {
                this.play(this.lastSong);
            } else {
                const previous = this.dataAudioElementList[this.currentAudioIndex - 1]
                this.play(previous);
            }
        }
    }

    updateSongDetails(songData) {
        ui.query('.mp__details-cover').src = (songData.cover === null) ? 'https://via.placeholder.com/150x150' : songData.cover;
        ui.query('.mp__playing-now').textContent = songData.name.toLowerCase();
        // document.querySelector('.mp__details_artist').textContent = songData.artist.toString().toLowerCase();

        if (this.currentAudio !== undefined) {
            this.endTimeEl.textContent = moment.utc(this.currentAudio.duration * 1000).format('mm:ss');
        }
    }

    toggleControl(property, e) {
        this[property] = !this[property];
        return this[property] === true ? (e.target.style.color = '#000') : (e.target.style.color = '#ccc'); ;
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

        playBtn.addEventListener('click', () => {
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
            }
        });

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
            // Find the audio element with the song name
            const audio = this.dataAudioElementList.find(element => element.title === song.name );
            
            this.play(audio);

            // Remove All Selected
            ui.removeClassAll('.mp__playlist-btn', 'mp__playlist-btn--selected');
            ui.addClass(e.target, 'mp__playlist-btn--selected');
            
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
